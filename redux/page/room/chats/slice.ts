import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export enum ChatKind {
  "text",
  "image",
}
export interface ChatEntity {
  id: string;
  userId: string;
  type: ChatKind;
  text?: string;
  image?: string;
  created_at: Date;
}

export type RoomPageChatState = {
  peers: { [key: number]: ChatEntity };
  localPeer: string | null;
};

export const initialState: RoomPageChatState = { peers: {}, localPeer: null };

const roomSlice = createSlice({
  name: "roomPagePeers",
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
      const newRooms = {};
      newRooms[room.id] = room;
      state.rooms = Object.assign(state.rooms, newRooms);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncFetchRooms.fulfilled, (state, action) => {
      const rooms = action.payload.rooms;
      const mapedRoom = rooms.reduce((prev, next: Room) => {
        prev[next.id] = next;
        return prev;
      }, {});
      state.rooms = Object.assign(state.rooms, mapedRoom);
      return state;
    });
  },
});

export default roomSlice;
