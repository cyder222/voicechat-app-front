import { createAsyncThunk } from "@reduxjs/toolkit";
import { getVoiceChatApi } from "../../../api-fetch/index";
import { GetRoomsRequest, Room } from "../../../codegen/api/fetch";

export interface fetchRoomsPayload {
  rooms: Room[];
}
export const asyncFetchRooms = createAsyncThunk<fetchRoomsPayload, { request: GetRoomsRequest; apiKey: string }>(
  "db/room/asyncFetchRooms",
  async (payload: { request: GetRoomsRequest; apiKey: string }): Promise<fetchRoomsPayload> => {
    const api = getVoiceChatApi(payload.apiKey);

    const rooms = await api.getRooms(payload.request);

    return { rooms: rooms };
  },
);
