import { StoreState } from "../../../create-store";
import { RoomEntity } from "../../../db/room/slice";
import { UserEntity } from "../../../db/user/slice";

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
