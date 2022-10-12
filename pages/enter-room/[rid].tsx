// 部屋に入る準備画面
import { parseCookies } from "nookies";
import React, { useEffect, useRef, useState } from "react";
import { getVoiceChatApi } from "../../api-fetch";
import { GetRoomsRoomIdRequest } from "../../codegen/api/fetch";
import EnterRoomPage from "../../components/pages/enter-room";
import wrapper, { StoreState } from "../../redux/create-store";
import roomSlice from "../../redux/db/room/slice";
import { prepareSSP } from "../../util/ssp/prepareFetch";




export const getServerSideProps = wrapper.getServerSideProps((store) => {return prepareSSP({ forceAuth: true }, store, async (ctx, store)=>{
  const rid = ctx.query.rid as string;
  const parsedCookie = parseCookies(ctx);
  const token = parsedCookie["LoginControllerAuthToken"];
  const request: GetRoomsRoomIdRequest = { roomId: rid };
  const api = getVoiceChatApi(token);
  const room = await api.getRoomsRoomId(request);

  await store?.dispatch(roomSlice.actions.updateRoom({ room: room }));

  return { props: { rid: room.roomIdentity } };
});});

export default  function EnterRoom(props:{rid: string}): JSX.Element {
  return <EnterRoomPage rid={props.rid}></EnterRoomPage>
}
