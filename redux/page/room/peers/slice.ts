import { PayloadAction, createSlice } from "@reduxjs/toolkit";


export interface PeerEntity {
  id: string;
  userId: string;
  isMute: boolean;
}

export interface RoomPeerEntity {
  roomId: string;
  peers: {[key: number]: PeerEntity};
}

export type RoomPagePeerState = {
  roomPeers: {[key: string]: RoomPeerEntity};
  localPeerId: string;
};

export const initialState: RoomPagePeerState = { roomPeers: {}, localPeerId: "" };

const roomPagePeerSlice = createSlice({
  name: "roomPagePeers",
  initialState,
  reducers: {
    addOrUpdatePeer: (state, action: PayloadAction<{roomId: string, peer: PeerEntity, isLocal: boolean}>) => {
      state.roomPeers[action.payload.roomId].peers[action.payload.peer.id] = action.payload.peer;
      action.payload.isLocal ? (state.localPeerId = action.payload.peer.id) : null;
      return state;
    },
    removePeer: (state, action: PayloadAction<{ roomId: string, peerId: string}>) =>  {
      delete state.roomPeers[action.payload.roomId].peers[action.payload.peerId];
      return state;
    },
  },
});

export default roomPagePeerSlice;
