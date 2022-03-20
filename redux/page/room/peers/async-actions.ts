import { createAsyncThunk } from "@reduxjs/toolkit";
import { getVoiceChatApi } from "../../../../api-fetch/index";
import { GetRoomsRequest, GetRoomsRoomIdRequest, Room } from "../../../../codegen/api/fetch";



export interface fetcRoomPayload {
  room: Room;
}

export const asyncFetchRoomById = createAsyncThunk<fetcRoomPayload, { apiKey: string, roomId: string }>(
  "db/user/asyncFetchRoomById",
  async ({ apiKey, roomId }): Promise<fetcRoomPayload> => {
    const api = getVoiceChatApi(apiKey);
    const reqParam: GetRoomsRoomIdRequest = { roomId };
    const room = await api.getRoomsRoomId(reqParam);
    return { room };
  },
);

export interface fetcRoomsPayload {
  rooms: Room[];
}

export const asyncFetchRooms = createAsyncThunk<fetcRoomsPayload, { apiKey: string, offset: number, limit: number, categoryId?: number }>(
  "db/user/asyncFetchRooms",
  async ({ apiKey, offset, limit, categoryId }): Promise<fetcRoomsPayload> => {
    const api = getVoiceChatApi(apiKey);
    const reqParam: GetRoomsRequest = {
      offset,
      categoryId,
      limit,
    };
    const rooms = await api.getRooms(reqParam);
    return { rooms };
  },
);
