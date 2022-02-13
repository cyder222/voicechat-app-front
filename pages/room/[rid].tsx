import { Button, Card, Container, GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getVoiceChatApi } from "../../api-fetch/index";
import { GetRoomsRoomIdRequest, User } from "../../codegen/api/fetch";
import { LoginController } from "../../components/auth/login-controller";
import RoomUserCard, { RoomUserCardProps } from "../../components/molecules/room-user-card/room-user-card";
import { config } from "../../config/constants";
import wrapper, { StoreState } from "../../redux/create-store";
import { roomSelector } from "../../redux/db/room/selectors";
import roomSlice from "../../redux/db/room/slice";
import { asyncFetchCurrentUser } from "../../redux/db/user/async-actions";
import { userSelector } from "../../redux/db/user/selectors";
import userSlice, { UserEntity } from "../../redux/db/user/slice";
import { roomPagePeerSelector } from "../../redux/page/room/peers/selectors";
import roomPeerSlice, { PeerEntity } from "../../redux/page/room/peers/slice";
import { prepareSSP } from "../../util/ssp/prepareFetch";

const MainViewWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const VoiceChatViewWrapper = styled.div`
  display: flex;
  flex-direction: column;

`;

const VoiceChatTitle = styled.div`
  &::before{
    content: '';
    background: url('') no-repeat; 
    background-size: contain;
  }
`;

const VoiceChatPeers = styled.div``;

let Peer;
if (process.browser) {
  Peer = require("skyway-js");

}

const TextChatViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
export const getServerSideProps = wrapper.getServerSideProps((store) => {return prepareSSP(false, store, async (ctx, store)=>{
  const rid = ctx.query.rid as string;
  const parsedCookie = parseCookies(ctx);
  const token = parsedCookie["LoginControllerAuthToken"];
  const request: GetRoomsRoomIdRequest = { roomId: rid };
  const api = getVoiceChatApi(token);
  const room = await api.getRoomsRoomId(request);

  store?.dispatch(roomSlice.actions.updateRoom({ room: room }));

  return { props: { rid: room.roomIdentity } };
});});
 
const Room = (props: {rid: string}): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsLeaveTrigger = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async (): Promise<void> => {
      await localStreamSetting();
    })();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [peer, setPeer] = useState<any>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const router = useRouter();
  const roomId = props.rid as string;
  const currentUser = useSelector((state: StoreState)=> {return userSelector.getCurrentUser(state);});
  const currentPeers = useSelector((state: StoreState) => { return roomPagePeerSelector.getByRoomId(state, roomId);});
  const localPeer = useSelector((state: StoreState ) => { return roomPagePeerSelector.getLocalPeer(state, roomId);});
  const currentRoom = useSelector((state: StoreState) => { return roomSelector.getById(state, roomId);});

  // ルームの情報を取得、ページを開くたびに取得でok (現状ページをまたがないのでreduxは使わない)
  useEffect(() => {
    (async (): Promise<void> => {
      if (currentUser?.uid === "") return;
      if(peer == null){
        setPeer(new Peer(currentUser?.uid.toString(), { key: config.key.SKYWAY_APIKEY }));
      }
      if(!localStream) return;
      let room;
      peer.on("open", async (id) => {
        room = peer.joinRoom(roomId, {
          mode: "mesh",
          stream: localStream,
        });
        const newPeer: PeerEntity = {
          id: id,
          userId: currentUser?.id.toString() || "",
          isMute: false,
          stream: null,
          playState: "stop",
        };
        dispatch(roomPeerSlice.actions.addOrUpdatePeer({ roomId: roomId, peer: newPeer, isLocal: true }));
        room.once("open", () => {
          console.log("=== You joined ===\n");
          dispatch(roomPeerSlice.actions.updateByPeerId({
             roomId: roomId, peerId: id, updateData:{
                stream: localStream,
                playState: "start",
              }, 
            }));
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on("peerJoin", (peerId: any) => {
          console.log(`=== ${peerId} joined ===\n`);
        });
  
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on("stream", async (stream: any) => {
          console.log("stream");
          if (stream.peerId == currentUser?.uid) {
            return;
          }
          const authToken = LoginController.getInfomation().authToken;
          if (authToken == null) {
            router.push("/loging/");
          }
          const api = getVoiceChatApi(authToken!);
          const user = await api.getApiUsersUserId({ userId: stream.peerId });
          if (!user) return;
          dispatch(userSlice.actions.addOrUpdateUser({ newUser: { ...user, uid: stream.peerId } }));
  
          const newPeer: PeerEntity = {
            id: stream.peerId,
            userId: user.id.toString(),
            isMute: false,
            stream: stream,
            playState: "start",
          };
          dispatch(roomPeerSlice.actions.addOrUpdatePeer({ roomId: roomId! as string, peer: newPeer, isLocal: false }));
  
        });
        // for closing room members
        room.on("peerLeave", (peerId) => {
          dispatch(roomPeerSlice.actions.updateByPeerId({ roomId: roomId!,peerId, updateData: { playState: "stop" } }));
          dispatch(roomPeerSlice.actions.removePeer({ roomId: roomId!, peerId: peerId }));
          console.log(`=== ${peerId} left ===\n`);
        });
  
        // for closing myself
        room.once("close", () => {
          console.log("== You left ===\n");
          currentPeers.forEach((peer) => {
            const newPeer = Object.assign(peer, { playState: "stop" });
            dispatch(roomPeerSlice.actions.addOrUpdatePeer({ roomId: roomId!, peer: newPeer, isLocal: false }));
          });
        });
      });
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, router, currentUser, dispatch, localStream, peer]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (peer) {
        await localStreamSetting();
      }
    })();
  }, [peer]);

  const localStreamSetting = async (): Promise<void> => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    setLocalStream(stream);
  };

  const renderLocalRoom =  useCallback((): JSX.Element | void=> {
    if(currentUser && localPeer){
      const props: RoomUserCardProps = { 
        userId: currentUser?.id ,
        isMute: false,
        isVoicing: false,
        stream: localPeer.stream,
        volume: 50,
        playState: localPeer.playState,
      };
      console.log(localPeer.stream);
      return (
        <RoomUserCard key={currentUser?.uid} {...props}/>
      );
  }},[localPeer, currentUser]);
  return (
    <MainViewWrapper maxWidth="lg">
      <VoiceChatViewWrapper>
        <VoiceChatTitle>{currentRoom.title}</VoiceChatTitle>        
        <VoiceChatPeers>
          {
              renderLocalRoom()
          }
          
          {currentPeers.filter((peer)=>{ return peer.id != currentUser?.uid;}).map((peer) =>{
            const props: RoomUserCardProps = {
              userId: parseInt(peer.userId),
              isMute: peer.isMute,
              isVoicing: false,
              stream: peer.stream,
              volume: 50,
              playState: "start",

            };
            return (
              <RoomUserCard key={peer.userId} {...props}  ></RoomUserCard>
            );
          })}
        </VoiceChatPeers>
      </VoiceChatViewWrapper>
    </MainViewWrapper>
  );

  

};

export default Room;
