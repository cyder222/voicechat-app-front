import { StoreState } from "../../../create-store";
import { PeerEntity } from "./slice";

export const roomPagePeerSelector = {
  getByRoomId: (state: StoreState, roomId: string): PeerEntity[] => {
    const peers = state.roomPagePeer.roomPeers?.[roomId]?.peers;
    return peers ? Object.values(peers) : [];
  },
  getByPeerId: (state: StoreState, roomId: string, peerId: string): PeerEntity => {
    return state.roomPagePeer.roomPeers?.[roomId]?.peers[peerId];
  },
  getLocalPeer: (state: StoreState, roomId: string): PeerEntity => {
    return state.roomPagePeer.roomPeers?.[roomId]?.peers[state.roomPagePeer.roomPeers?.[roomId]?.localPeerId];
  },
};
