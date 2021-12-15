// 部屋に入る準備画面
import { Button, Card, Container, TextField, Typography, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import LoginController from "../../components/auth/login-controller";
import { asyncFetchCurrentUser } from "../../redux/db/user/async-actions";
import { useUserState } from "../../redux/db/user/selectors";

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    input: { marginTop: theme.spacing(2) },
    submit: { margin: theme.spacing(3, 0, 2) },
    panel: { padding: "12px" },
    container: { marginTop: "14px" },
  };
});

export default function EnterRoom(): JSX.Element {
  const userState = useUserState();
  const router = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  const localStreamRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    (async (): Promise<void> => {
      const token = LoginController.getInfomation().authToken;
      if (token == null) {
        router.push("/loging");
        return;
      }
      await dispatch(asyncFetchCurrentUser(token!));
      await localStreamSetting();
    })();
  }, [router, userState, dispatch, localStreamRef]);

  const localStreamSetting = async (): Promise<void> => {
    if (localStreamRef == null) return;
    if (localStreamRef.current == null) return;
    localStreamRef.current.srcObject = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    await localStreamRef.current.play();
  };
  const roomJoinClick = async (): Promise<void> => {
    if (typeof window !== "undefined") {
      const urls = router.pathname.split("/");
      const rid = router.query.rid;
      router.push(`/room/${rid}`);
    }
  };
  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Card className={classes.panel}>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            ルームに入室
          </Typography>
          <div className={classes.form}>
            <div className={classes.input}>
              <video id="js-local-stream" muted ref={localStreamRef} playsInline width="100%" height="100%" />
            </div>
            <Button
              variant="contained"
              id="js-join-trigger"
              type="submit"
              color="primary"
              fullWidth
              onClick={roomJoinClick}
              className={classes.submit}
            >
              通話を開始する
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
}
