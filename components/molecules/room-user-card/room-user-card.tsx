import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { StoreState } from "../../../redux/create-store";
import { userSelector } from "../../../redux/db/user/selectors";
import IconButton from "../../atomic/button/icon-button/icon-button";
import VideoElement from "../video-element/video-element";

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  height: calc(width * 0.75);
  width: 100%;
  background: #251B3C;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
`;
const Name = styled.div`
  color: white;
`;
const UserImage = styled.img`
  width: 100%;
  max-width: 160px;
  padding: 24px;
`;
const LowerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 24px;
  padding: 0px;
  width: 100%;
  line-height: 150%;
`;
const UpperRow = styled.div`
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  padding: 0px;
  width: 100%;
`;

export interface RoomUserCardProps {
  userId: number;
  image?: string | null;
  volume: number;
  isMute: boolean;
  isVoicing: boolean;
  stream: MediaProvider | null;
  playState: "start" | "stop"
  width?: string;
  height?: string;
  onClickSpeaker?: ()=>void;
  onClickSetting?: ()=>void;
  onChangeActor?: ()=>void;
  onClickPin?: ()=>void;
}

export const RoomUserCard = (props: RoomUserCardProps): JSX.Element => {
  const user = useSelector((state: StoreState) => {return userSelector.getById(state, props.userId);});
  return(
  <CardWrapper>
    <UpperRow>
      <IconButton onClick={(): void=>{props.onClickSpeaker?.();}} src={"/img/pin-white.svg"} width={"24px"} height={"24px"}></IconButton>
      <IconButton onClick={(): void=>{props.onClickSetting?.();}} src={"/img/setting-white-btn.svg"} width={"24px"} height={"24px"}></IconButton>
    </UpperRow>
    <UserImage src={props.image != null ? props.image : "/img/default-user.png"}></UserImage>
    <VideoElement volume={props.volume} customSrcObject={props.stream} playState={props.playState}></VideoElement>
    <LowerRow>
      <IconButton onClick={(): void=>{props.onClickSpeaker?.();}} src={props.volume > 0 ?  "/img/speaker-white-normal.svg" : "/img/speaker-white-disable.svg"} width={"24px"} height={"24px"}></IconButton>
      <Name>{user?.name}</Name>
    </LowerRow>
  </CardWrapper>
  );
};

export default RoomUserCard;
