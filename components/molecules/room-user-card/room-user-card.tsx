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

  background: #F9F8FD;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
`;
const Name = styled.div``;
const UserImage = styled.img`
  width: 100%;
  max-width: 160px;
  padding: 24px;
`;
const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px;
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
}

export const RoomUserCard = (props: RoomUserCardProps): JSX.Element => {
  const user = useSelector((state: StoreState) => {return userSelector.getById(state, props.userId);});
  return(
  <CardWrapper>
    <Name>{user?.name}</Name>
    <UserImage src={props.image != null ? props.image : "/img/default-user.png"}></UserImage>
    <VideoElement volume={props.volume} customSrcObject={props.stream} playState={props.playState}></VideoElement>
    <FlexRow>
      <IconButton onClick={(): void=>{props.onClickSpeaker?.();}} src={props.volume > 0 ?  "/img/speaker-normal.svg" : "/img/speaker-disable.svg"} width={"48px"} height={"48px"}></IconButton>
      <IconButton src={"/img/setting_btn.svg"} width={"48px"} height={"48px"}></IconButton>
    </FlexRow>
  </CardWrapper>
  );
};

export default RoomUserCard;
