import { StoreState } from "../../create-store";
import { UserEntity } from "./slice";

export const userSelector = {
  getById: (state: StoreState, userId: number): UserEntity => {
    return state.user.users[userId];
  },
  getCurrentUser: (state: StoreState): UserEntity | null => {
    if (state.user.currentUser == null) {
      return null;
    }
    return state.user.users[state.user.currentUser];
  },
};
