import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Room } from "../../../codegen/api/fetch/models/Room";
import { asyncFetchRooms } from "./async-actions";

export type RoomEntity = Room;

export type RoomsState = {
  rooms: { [key: number]: RoomEntity };
  roomUsers: { [key: number]: Array<number> };
};

export const initialState: RoomsState = { rooms: {}, roomUsers: {} };

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    updateName: (state, action: PayloadAction<{ id: string; name: string }>) => {
      return {
        ...state,
        name: action.payload,
      };
    },
    updateNickname: (state, action: PayloadAction<{ id: string; nickname: string }>) => {
      return {
        ...state,
        nickname: action.payload,
      };
    },
    updateRoom: (state, action: PayloadAction<{ room: RoomEntity }>) => {
      const room = action.payload.room;
      room.description === undefined ? room.description = "" : null;
      room.mainLangage === undefined ? room.mainLangage = "" : null;
      room.category === undefined ? room.category = null : null;
      room.currentUserNum === undefined ? room.currentUserNum = 0 : null;
      room.maxUserNum === undefined ? room.maxUserNum = 0 : null;

      state.rooms[room.roomIdentity] = room;

    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncFetchRooms.fulfilled, (state, action) => {
      const rooms = action.payload.rooms;
      const mapedRoom = rooms?.reduce((prev, next: Room) => {
        prev[next.id] = next;
        return prev;
      }, {});
      state.rooms = Object.assign(state.rooms, mapedRoom);
      return state;
    });
    builder.addCase(HYDRATE, (state, action: any) => {
      console.log(action.payload.room);
      return {
          ...state,
          ...action.payload.room,
      };
    });
  },
});

export default roomSlice;
