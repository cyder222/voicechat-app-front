import { StoreState } from "../../../create-store";
import { PeerEntity } from "./slice";

export const roomPagePeerSelector = {
  getByRoomId: (state: StoreState, roomId: string): PeerEntity[] => {
    return Object.values(state.roomPagePeer.roomPeers[roomId].peers);
  },
  getByPeerId: (state: StoreState, roomId: string, peerId: string): PeerEntity => {
    return state.roomPagePeer.roomPeers[roomId].peers[peerId];
  },
};
