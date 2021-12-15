import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import { User } from "../../../codegen/api/fetch/models/User";
import { asyncFetchCurrentUser } from "./async-actions";

export type UserEntity = User;

export type UsersState = {
  users: { [key: number]: UserEntity };
  currentUser: number | null;
};

export const initialState: UsersState = {
  users: {},
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const newUsers = state.users;
      newUsers[action.payload.id].name = action.payload.name;
      return {
        ...state,
        users: newUsers,
      };
    },
    setNickname: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const newUsers = state.users;
      newUsers[action.payload.id].nickname = action.payload.name;
      return {
        ...state,
        users: newUsers,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncFetchCurrentUser.fulfilled, (state, action) => {
      const user = action.payload.user;
      state.currentUser = user.id;
      state.users[user.id] = user;
      return state;
    });
  },
});

export default userSlice;
