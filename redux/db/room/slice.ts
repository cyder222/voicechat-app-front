import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Room } from "../../../codegen/api/fetch/models/Room";
import { asyncFetchRooms } from "./async-actions";


export type RoomEntity = Room;

export type RoomsState = {
  rooms: {[key: number]: RoomEntity};
  roomUsers: {[key: number]: Array<number>}
};

export const initialState: RoomsState = { rooms: {}, roomUsers: {}   };

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    updateName: (state, action: PayloadAction<{id: string, name:string}>) => {return {
      ...state,
      name: action.payload,
    };},
    updateNickname: (state, action: PayloadAction<{id: string, nickname: string}>) => {return {
      ...state,
      nickname: action.payload,
    };},
    updateRoom: (state, action: PayloadAction<{id: string, room: RoomEntity}>) => {
      return {
        ...state,
        ...action.payload.room,
      };},
    extraReducers: (builder) => {
      builder.addCase(asyncFetchRooms.fulfilled, (state, action) => {
        const rooms = action.payload.rooms;
        const mapedRoom = rooms.reduce((prev,next: Room)=>{
          prev[next.id] = next;
        },{});
      });
    },
  },
});

export default roomSlice;
