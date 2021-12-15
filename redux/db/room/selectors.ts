import { StoreState } from "../../create-store";
import { UserEntity } from "../user/slice";
import { RoomEntity } from "./slice";

export const roomSelector = {
  getById: (state: StoreState, roomId: number): RoomEntity => {
    return state.room.rooms[roomId];
  },
  getRoomUsersByRoomId: (state: StoreState, roomId: number): UserEntity[] => {
    const userIds = state.room.roomUsers[roomId];
    return userIds.map((id) => {
      return state.user.users[id];
    });
  },
};
