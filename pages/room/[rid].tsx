import { Button, Card, Container, GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVoiceChatApi } from "../../api-fetch/index";
import { LoginController } from "../../components/auth/login-controller";
import { config } from "../../config/constants";
import { asyncFetchCurrentUser } from "../../redux/db/user/async-actions";
import { userSelector } from "../../redux/db/user/selectors";


export default function Room(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Peer: any;
  let jsLocalStream;
  let jsRemoteStream: HTMLElement | null;
  let jsLeaveTrigger: HTMLElement | null;
  const dispatch = useDispatch();

  const [roomName, setRoomName] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [peer, setPeer] = useState<any>(null);

  if (process.browser) {
    Peer = require("skyway-js");
    jsLocalStream = document.getElementById("js-local-stream");
    jsRemoteStream = document.getElementById("js-remote-streams");
    jsLeaveTrigger = document.getElementById("js-leave-trigger");
  }
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const roomId = router.query.rid;
  const currentUser = useSelector(userSelector.getCurrentUser);

  const joinToRoom = async (): Promise<void> => {
    if (peer?.open) {
      return;
    }
    const authToken = LoginController.getInfomation().authToken;
    if (authToken == null) {
      router.push("/loging/");
    }
    if (roomId == null) {
      router.push("/");
    }
    const api = getVoiceChatApi(authToken!);

    await api.postRoomsUsers({ roomId: (typeof roomId! == typeof ["", ""] ? roomId![0] : roomId!) as string });
    let room;
    peer.on("open", (id) => {
      room = peer.joinRoom(roomId, {
        mode: "mesh",
        stream: localStreamRef?.current?.srcObject,
      });
      room.once("open", () => {
        console.log("=== You joined ===\n");
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      room.on("peerJoin", (peerId: any) => {
        console.log(`=== ${peerId} joined ===\n`);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      room.on("stream", async (stream: any) => {
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
        // gridListTitle
        const gridListTitleRoot = document.createElement("li");
        gridListTitleRoot.setAttribute("id", stream.peerId);
        gridListTitleRoot.setAttribute("class", "MuiGridListTile-tile-root makeStyles-videoContainer-2");
        gridListTitleRoot.setAttribute("style", "width: 50%; padding: 1px; background-color:gray;");
        const gridListTitleVideo = document.createElement("div");
        gridListTitleVideo.setAttribute("class", "MuiGridListTile-tile");
        gridListTitleRoot.append(gridListTitleVideo);
        // video
        const newVideo = document.createElement("video");
        newVideo.setAttribute("id", `js-local-stream-${stream.peerId}`);
        newVideo.srcObject = stream;
        newVideo.playsInline = true;
        newVideo.setAttribute("width", "100%");
        newVideo.setAttribute("height", "100%");
        gridListTitleVideo.append(newVideo);

        // gridListTitleBar
        const gridListTitleBar = document.createElement("div");
        gridListTitleBar.setAttribute("class", "MuiGridListTileBar-root MuiGridListTileBar-titlePositionBottom");
        gridListTitleVideo.append(gridListTitleBar);
        const gridListTitleWrap = document.createElement("div");
        gridListTitleWrap.setAttribute("class", "MuiGridListTileBar-titleWrap");
        gridListTitleBar.append(gridListTitleWrap);
        const gridListTitle = document.createElement("div");
        gridListTitle.setAttribute("class", "MuiGridListTileBar-title");

        console.log(stream.peerId);
        const userName = document.createTextNode(user.name);
        gridListTitle.append(userName);
        gridListTitleWrap.append(gridListTitle);

        jsRemoteStream?.append(gridListTitleRoot);
        await newVideo.play().catch(console.error);
      });
      // for closing room members
      room.on("peerLeave", (peerId) => {
        const remoteVideoContainer = document.getElementById(`${peerId}`);
        const remoteVideoElement = document.querySelector<HTMLVideoElement>(`#js-local-stream-${peerId}`);

        if (remoteVideoElement == null) return;
        if (remoteVideoContainer == null) return;
        const remoteStream = remoteVideoElement.srcObject as MediaStream;
        remoteStream.getTracks().forEach((track: any) => {
          return track.stop();
        });
        remoteVideoElement.srcObject = null;
        remoteVideoContainer.remove();

        console.log(`=== ${peerId} left ===\n`);
      });

      // for closing myself
      room.once("close", () => {
        console.log("== You left ===\n");
        jsRemoteStream?.querySelectorAll("li:not(.my-video)").forEach((remoteVideoContainer) => {
          const remoteVideoElement = remoteVideoContainer.children[0].children[0] as HTMLVideoElement;
          if (remoteVideoElement == null) return;
          const remoteStream = remoteVideoElement.srcObject as MediaStream;
          remoteStream.getTracks().forEach((track: any) => {
            return track.stop();
          });
          remoteVideoElement.srcObject = null;
          remoteVideoContainer.remove();
        });
      });
    });

    window.addEventListener("beforeunload", (event) => {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      LeaveTriggerClick(true).then(() => {
        return 0;
      });
    });

    jsLeaveTrigger?.addEventListener(
      "click",
      async (event) => {
        event.preventDefault();
        room.close();
        await LeaveTriggerClick(false);
      },
      { once: true },
    );
    return;
  };
  const LeaveTriggerClick = async (flag) => {
    // 退出処理
    /*const user = await getCurrentUser();
        const userDocument = await selectUser(user.uid);
        await updateRoomDocumentWhenLeaved(Number(cid), roomId, userDocument);
    
        await localStreamOff();
    
        if (flag) {
          router.push("/");
        } else {
          router.push(`/categories/${cid}`);
        }*/
  };

  // ルームの情報を取得、ページを開くたびに取得でok (現状ページをまたがないのでreduxは使わない)
  useEffect(() => {
    (async (): Promise<void> => {
      const authToken = LoginController.getInfomation().authToken;
      if (authToken == null) {
        router.push("/logign/");
      }
      if (roomId == null) {
        router.push("/");
      }
      const token = LoginController.getInfomation().authToken;
      if (token == null || currentUser == null) {
        router.push("/loging/");
        return;
      }
      await dispatch(asyncFetchCurrentUser({ apiKey: authToken! }));
      const api = getVoiceChatApi(authToken!);
      const room = await api.getRoomsRoomId({ roomId: (typeof roomId! == typeof ["", ""] ? roomId![0] : roomId!) as string });
      setRoomName(room.title);
      console.log(`user_uid: ${currentUser?.uid}`);
      if (currentUser?.uid === "") return;
      setPeer(new Peer(currentUser?.uid.toString(), { key: config.key.SKYWAY_APIKEY }));
    })();
  }, [roomId, router, currentUser, Peer]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (peer) {
        await localStreamSetting();
        await joinToRoom();
      }
    })();
  }, [peer, localStreamRef]);

  const localStreamSetting = async (): Promise<void> => {
    if (localStreamRef == null) return;
    if (localStreamRef.current == null) return;
    localStreamRef.current.srcObject = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    await localStreamRef.current.play();
  };
  const localStreamOff = (): void => {
    // ローカルストリームを複数回オン, オフにしたとき, current = nullになるため
    if (localStreamRef.current) {
      if (localStreamRef.current.srcObject instanceof MediaStream) {
        localStreamRef.current.srcObject.getTracks().forEach((track) => {
          return track.stop();
        });
      }
    }
  };
  return (
    <Container maxWidth="lg">
      <Card>
        <GridList id="js-remote-streams" cols={2}>
          <GridListTile cols={2} className="my-video">
            <h1>{roomName}</h1>
          </GridListTile>
          <GridListTile className={"my-video"}>
            <video id="js-local-stream" muted ref={localStreamRef} playsInline width="100%" height="100%" />
            <GridListTileBar title={currentUser?.name} />
          </GridListTile>
        </GridList>

        <div>
          <Button variant="contained" id="js-leave-trigger" color="secondary">
            退出する
          </Button>
        </div>
      </Card>
    </Container>
  );
}
