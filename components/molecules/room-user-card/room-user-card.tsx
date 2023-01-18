import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { User } from "../../../codegen/api/fetch/models/User";
import { StoreState } from "../../../redux/create-store";
import { userSelector } from "../../../redux/db/user/selectors";
import { UserEntity } from "../../../redux/db/user/slice";
import IconButton from "../../atomic/button/icon-button/icon-button";
import VideoElement from "../video-element/video-element";

const pulseMotion = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0.9, 0.9);
    background-color: rgba(255, 255, 255, 0.1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1, 1.1);
    background-color: rgba(255, 255, 255, 0);
  }
  100% {
    transform: translate(-50%, -50%) scale(0.9, 0.9);
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;

  background: #251B3C;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
`;
const Name = styled.div`
  color: white;
  background-color: #0A0A0B;
`;
const UserImage = styled.div`
  width: 100%;
  max-width: 160px;
  padding: 24px;
  display: block;
  position: relative;
  border-radius: 50%;
  transition: background-color cubic-bezier(1.0, 1.0, 1.0, 1) .4s;
  > img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
  &.speaking {
    background-color: #FFFFFF00;
    border-radius: 50%;
  }
  &:after{
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: opacity linear 0.4s;
    content: '';
  }
  &.speaking:after{
    animation: ${pulseMotion} 1.0s linear infinite;
  }
`;
const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const BottomFlexRow = styled(FlexRow)`
  align-items: center;
  justify-content: flex-start;
  gap: 24px;
`;


export interface RoomUserCardProps {
  user: UserEntity;
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
  const user = props.user;
  return(
  <CardWrapper>
    <FlexRow>
      <IconButton src={"/img/pin-white.svg"} width={"24px"} height={"24px"} backgroundColor={"#0A0A0B"}></IconButton>
      <IconButton src={"/img/setting_btn-white.svg"} width={"24px"} height={"24px"} backgroundColor={"#0A0A0B"}></IconButton>
    </FlexRow>
    <UserImage className={props.isVoicing ? "speaking" : ""} >
      <img src={props.image != null ? props.image : "/img/default-user.png"} width={"100%"} height={"100%"}></img>
    </UserImage>
    <VideoElement volume={props.volume} customSrcObject={props.stream} playState={props.playState}></VideoElement>
    <BottomFlexRow>
      <IconButton backgroundColor={"#0A0A0B"} onClick={(): void=>{props.onClickSpeaker?.();}} src={props.volume > 0 ?  "/img/speaker-normal-white.svg" : "/img/speaker-disable-white.svg"} width={"48px"} height={"48px"}></IconButton>
      <Name>{user?.name}</Name>
    </BottomFlexRow>
  </CardWrapper>
  );
};

export default RoomUserCard;
