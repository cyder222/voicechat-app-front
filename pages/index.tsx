import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import React, { useEffect } from "react";
import styled from "styled-components";
import { LoginController } from "../components/auth/login-controller";
import CreateRoomDialog  from "../components/molecules/create-room-dialog/create-room-dialog";
import { HeaderComponent } from "../components/organisms/header";
import { asyncFetchCurrentUser } from "../redux/db/user/async-actions";
import { useUserState } from "../redux/db/user/selectors";

export default function Home(): JSX.Element {
  const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;
  const router = useRouter();
  const dispatch = useDispatch();
  const [stateRoomId, setStateRoomId] = React.useState("");

  // プロトタイプ用の簡易ログインシステム
  useEffect(()=>{
    const url = new URL(window.location.href);
    const auth_token = url.searchParams.get("auth_token");
    const uid = url.searchParams.get("uid");
    if(auth_token && auth_token !== "" && uid && uid !== "")
    {
      LoginController.setAuthToken(auth_token);
      LoginController.setUid(uid);
          // ユーザー情報をフェッチしておく
      dispatch(asyncFetchCurrentUser(auth_token!));
    }

  },[dispatch]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRoomIdChange = (e: any)=>{
    const value = e.target.value;
    setStateRoomId(value);
  };

  return (
    <div>
      <Head>
        <Title>Voice chat application</Title>
        <meta name="description" content="this is prototype of voice chat application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HeaderComponent userState={useUserState().user}></HeaderComponent>
        <h1>Prototype of voicechat system</h1>
        
        <h3>{process.env.DEV_MODE}</h3>
        <h1>2. PLEASE ENTER CODE or CREATE NEW ROOM</h1>
          <CreateRoomDialog 
            buttonText="ルームを作成する"
            callBackAfterCreateRoom={(roomId: string)=>{
              if(roomId == null){
                alert("部屋の作成に失敗しました");
              }
              router.push(`/enter-room/${roomId}/`);
            }}
          ></CreateRoomDialog>
          <form onSubmit={(e: React.FormEvent<HTMLFormElement>): void=>{
            e.preventDefault();
            if(stateRoomId === ""){
              alert("部屋IDを入れてください。");
              return;
            }
            router.push(`/enter-room/${stateRoomId}/`);
          }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="部屋のID"
              type="  text"
              onChange={handleRoomIdChange}
              value={stateRoomId}
              fullWidth
            />
            <Button type="submit" color="primary" variant="outlined">
              部屋に入る
            </Button>
          </form>
        <h1>公開部屋一覧</h1>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                roomの名前
              </Typography>
              <Typography variant="body2" component="p">
                ルームの詳細
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
               ルームの名前
              </Typography>
              <Typography variant="body2" component="p">
                ルームの詳細
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
