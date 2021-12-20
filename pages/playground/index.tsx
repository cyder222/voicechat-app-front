import React from "react";
import { useSelector } from "react-redux";
import { RoomUserCard } from "../../components/molecules/room-user-card/room-user-card";
import { HeaderComponent } from "../../components/organisms/header";
import { userSelector } from "../../redux/db/user/selectors";

export default function PlayGround(): JSX.Element {
    const currentUser = useSelector(userSelector.getCurrentUser);
    return(
        <div>
            <HeaderComponent currentUser={currentUser}></HeaderComponent>
            <RoomUserCard name={"taiki"} volume={50} isMute={false} isVoicing={false} image={null}></RoomUserCard>
        </div>
    );
}
