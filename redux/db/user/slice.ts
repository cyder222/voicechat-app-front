import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
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
    setCurrentUser: (state, action: PayloadAction<{ newUser: UserEntity}>) => {
      const newUser = action.payload.newUser;
      state.users[action.payload.newUser.id] = newUser;
      state.currentUser = newUser.id;
    },
    addOrUpdateUser: (state, action: PayloadAction<{newUser: UserEntity}>) => {
      const newUser = action.payload.newUser;
      state.users[newUser.id] = newUser;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncFetchCurrentUser.fulfilled, (state, action) => {
      const user = action.payload.user;
      state.currentUser = user.id;
      state.users[user.id] = user;
      return state;
    });

    builder.addCase(HYDRATE, (state, action: any) => {
      return {
          ...state,
          ...action.payload.user,
      };
    });
  },
});

export default userSlice;
