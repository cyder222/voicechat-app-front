import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootStateOrAny } from "react-redux";
import { getVoiceChatApi } from "../../../api-fetch/index";
import { GetRoomsRequest, GetRoomsRoomIdRequest, Room } from "../../../codegen/api/fetch";
import { AppState } from "../../create-store";

export interface fetchRoomsPayload {
  rooms: Room[];
}
export const asyncFetchRooms = createAsyncThunk<fetchRoomsPayload, { request: GetRoomsRequest; apiKey: string },{
  state: AppState,
  dispatch: any
}>(
  "db/room/asyncFetchRooms",
  async (payload: { request: GetRoomsRequest; apiKey: string }): Promise<fetchRoomsPayload> => {
    const api = getVoiceChatApi(payload.apiKey);

    const rooms = await api.getRooms(payload.request);

    return { rooms: rooms };
  },
);

export interface fetchRoomPayload {
  room: Room;
}

export const asyncFetchRoomById = createAsyncThunk<fetchRoomPayload, { request: GetRoomsRoomIdRequest; apiKey: string }>(
  "db/room/asyncFetchRooms",
  async (payload: { request: GetRoomsRoomIdRequest; apiKey: string }): Promise<fetchRoomPayload> => {
    const api = getVoiceChatApi(payload.apiKey);

    const room = await api.getRoomsRoomId(payload.request);

    return { room: room };
  },
);
