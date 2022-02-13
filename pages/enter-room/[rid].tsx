// 部屋に入る準備画面
import { Button, Card, Container, Typography, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVoiceChatApi } from "../../api-fetch";
import { GetRoomsRoomIdRequest } from "../../codegen/api/fetch";
import LoginController from "../../components/auth/login-controller";
import VideoElement from "../../components/molecules/video-element/video-element";
import wrapper, { StoreState } from "../../redux/create-store";
import { asyncFetchRoomById } from "../../redux/db/room/async-actions";
import { roomSelector } from "../../redux/db/room/selectors";
import roomSlice from "../../redux/db/room/slice";
import { asyncFetchCurrentUser } from "../../redux/db/user/async-actions";
import { userSelector } from "../../redux/db/user/selectors";
import { prepareSSP } from "../../util/ssp/prepareFetch";




export const getServerSideProps = wrapper.getServerSideProps((store) => {return prepareSSP(false, store, async (ctx, store)=>{
  const rid = ctx.query.rid as string;
  const parsedCookie = parseCookies(ctx);
  const token = parsedCookie["LoginControllerAuthToken"];
  const request: GetRoomsRoomIdRequest = { roomId: rid };
  const api = getVoiceChatApi(token);
  const room = await api.getRoomsRoomId(request);

  await store?.dispatch(roomSlice.actions.updateRoom({ room: room }));

  return { props: { rid: room.roomIdentity } };
});});

export default  function EnterRoom(props:{rid: string}): JSX.Element {
  const currentUser = useSelector(userSelector.getCurrentUser);
  const currentRoom = useSelector((state: StoreState) => {return roomSelector.getById(state, props.rid as string );});
  const router = useRouter();

  const [localStreamProvider, setLocalStreamProvider] = useState<MediaProvider | null>(null);
  const [playState, setPlayState] = useState<"start"|"stop">("stop");
  useEffect(() => {
    (async (): Promise<void> => {
      console.log(currentRoom?.title);
      await localStreamSetting();
    })();
  }, [currentRoom]);

  const localStreamSetting = async (): Promise<void> => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    setLocalStreamProvider(stream);
    setPlayState("start");
  };
  const roomJoinClick = async (): Promise<void> => {
    if (typeof window !== "undefined") {
      const rid = router.query.rid;
      router.push(`/room/${rid}`);
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Card>
        <div>
          <Typography component="h1" variant="h5">
            {currentRoom?.title}
          </Typography>
          <div>
            <div>
              <VideoElement customSrcObject={localStreamProvider} playState={playState}></VideoElement>
            </div>
            <Button
              variant="contained"
              id="js-join-trigger"
              type="submit"
              color="primary"
              fullWidth
              onClick={roomJoinClick}
            >
              通話を開始する
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
}
