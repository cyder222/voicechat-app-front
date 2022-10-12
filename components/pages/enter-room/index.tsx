// 部屋に入る準備画面
import { Button, Card, Container, Typography, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoElement from "../../molecules/video-element/video-element";
import wrapper, { StoreState } from "../../../redux/create-store";
import { roomSelector } from "../../../redux/db/room/selectors";
import { userSelector } from "../../../redux/db/user/selectors";

interface OwnProps {
    rid: string;
};

type Props = OwnProps;

const EnterRoomPage = ({rid}: Props ): JSX.Element => {
    const currentUser = useSelector(userSelector.getCurrentUser);
    const currentRoom = useSelector((state: StoreState) => {return roomSelector.getById(state, rid as string );});
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
        audio: {
          echoCancellationType: "system",
          echoCancellation: true,
          noiseSuppression: true,
        },
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
                <VideoElement volume={1.0} customSrcObject={localStreamProvider} playState={playState}></VideoElement>
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
export default EnterRoomPage;