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
import RoundBtn  from "../components/atomic/button/round-corner-button/round-corner-button";
import WaveButton from "../components/atomic/button/round-wave-button/round-wave-button";
import SimpleInput from "../components/atomic/input/simple-input/simple-input";
import { LoginController } from "../components/auth/login-controller";
import CreateRoomDialog  from "../components/molecules/create-room-dialog/create-room-dialog";
import { HeaderComponent } from "../components/organisms/header";
import { asyncFetchCurrentUser } from "../redux/db/user/async-actions";
import { useUserState } from "../redux/db/user/selectors";

const MainViewWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background: linear-gradient(to bottom, #EDF0F5, #FFF);
  height: 576px;
`;
const MainViewImageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const MainViewImage = styled.img`
  top: 154px;
  right: 0px;
  position: absolute;
`;

const MainViewContentWrapper = styled.div`
  height: 576px;
  padding: 176px 0 0 112px;
  min-width: 600px;
`;
const MainViewSubject = styled.div`
  font-size: 48px;
  font-family:  'Roboto Condensed', sans-serif;
  font-weight: 700;
`;

const MainViewDescription = styled.div`
  margin-top: 48px;
  font-size: 18px;
  font-family:  'Roboto Condensed', sans-serif;
  font-weight: 700;
  p {
    line-height: 125%;
  }
`;

const MainViewFormWrapper = styled.div`
  margin-top: 64px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;


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
        <meta name="description" content="this is prototype of voice chat application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HeaderComponent userState={useUserState().user}></HeaderComponent>
        <MainViewWrapper>
          <MainViewContentWrapper>
            <MainViewSubject>好きな声で好きを話そう</MainViewSubject>
            <MainViewDescription>
              <p>VTalkは匿名ボイスチャットサービスです。</p>
              <p>AIがあなたの声を変換し、匿名での通話を手助けします</p>
            </MainViewDescription>
            <MainViewFormWrapper>
              <RoundBtn text="部屋を作る" width="180px" height="48px"></RoundBtn>
              <span style={{ fontWeight: "bold", marginLeft: "16px" }}>or</span>
              <SimpleInput placeholder="部屋コードを入力" style={{ width:"200px", height: "46px", marginLeft: "16px" }} ></SimpleInput>
              <span style={{ marginLeft: "8px" }}></span>
              <RoundBtn text="入室" width="60px" height="48px"></RoundBtn>
            </MainViewFormWrapper>
          </MainViewContentWrapper>
          <MainViewImageWrapper>
            <MainViewImage src="/img/audio-image-top.png"></MainViewImage>
            <div style={{ margin: "auto 0 64px 0" }}>
              <WaveButton width="100px" height="100px" text="変換を試す" iconSrc="/img/phone.svg" iconWidth="54px" iconHeight="54px"></WaveButton>
            </div>
          </MainViewImageWrapper>
        </MainViewWrapper>
        
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
