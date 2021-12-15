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
    updateRoom: (state, action: PayloadAction<{ room: ChatEntity }>) => {
      const room = action.payload.room;
      const newRooms = {};
      newRooms[room.id] = room;

    },
  },
});

export default roomSlice;
