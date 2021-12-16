import styled from "styled-components";
import IconButton from "../../atomic/button/icon-button/icon-button";

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
  name: string;
  image?: string | null;
  volume: number;
  isMute: boolean;
  isVoicing: boolean;
  width?: string;
  height?: string;
};

export const RoomUserCard = (props: RoomUserCardProps): JSX.Element => {
  return(
  <CardWrapper>
    <Name>{props.name}</Name>
    <UserImage src={props.image != null ? props.image : "/img/default-user.png"}></UserImage>
    <FlexRow>
      <IconButton src={"/img/speaker-normal.svg"} width={"48px"} height={"48px"}></IconButton>
      <IconButton src={"/img/setting_btn.svg"} width={"48px"} height={"48px"}></IconButton>
    </FlexRow>
  </CardWrapper>
  );
};
