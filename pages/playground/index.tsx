import React from "react";
import { RoomUserCard } from "../../components/molecules/room-user-card/room-user-card";

export default function PlayGround(): JSX.Element {
    return(
        <div>
            <RoomUserCard name={"taiki"} volume={50} isMute={false} isVoicing={false} image={null}></RoomUserCard>
        </div>
    );
}