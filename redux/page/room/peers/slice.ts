import { stringify } from "querystring";
import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import CreateRoomDialogModule from "../../../../components/molecules/create-room-dialog/create-room-dialog";

export interface PeerEntity {
  id: string;
  userId: string;
  isMute: boolean;
  stream: any;
  playState: "start" | "stop";
}

export interface RoomPeerEntity {
  roomId: string;
  peers: { [key: number]: PeerEntity };
  localPeerId: string;
}

export type RoomPagePeerState = {
  roomPeers: { [key: string]: RoomPeerEntity };
};

export const initialState: RoomPagePeerState = { roomPeers: {} };

const roomPagePeerSlice = createSlice({
  name: "roomPagePeers",
  initialState,
  reducers: {
    addOrUpdatePeer: (state, action: PayloadAction<{ roomId: string; peer: PeerEntity; isLocal: boolean }>) => {
      const currentPeers: { [key: string]: PeerEntity} = {};
      currentPeers[action.payload.peer.id] = action.payload.peer;
      state.roomPeers[action.payload.roomId] == null ? state.roomPeers[action.payload.roomId] = {
        roomId: action.payload.roomId,
        peers: currentPeers,
        localPeerId: action.payload.isLocal ? action.payload.peer.id : "",
      } : state.roomPeers[action.payload.roomId].peers = Object.assign(state.roomPeers[action.payload.roomId].peers, currentPeers);
        

      return state;
    },
    updateByPeerId: (state, action: PayloadAction<{roomId: string, peerId: string, updateData: any}>) => {
      const { roomId, peerId, updateData } = action.payload;
      const peer: PeerEntity | null = state.roomPeers[roomId]?.peers?.[peerId];
      if(peer == null) {
        return;
      }
      const newPeer = Object.assign(peer, updateData);
      state.roomPeers[roomId].peers[peerId] = newPeer;

      return state;
    },
    removePeer: (state, action: PayloadAction<{ roomId: string; peerId: string }>) => {
      delete state.roomPeers[action.payload.roomId].peers[action.payload.peerId];
      return state;
    },
  },
});

export default roomPagePeerSlice;
