import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { asyncFetchCurrentUser } from "./async-actions";

export type UserState = {
  id: string;
  uid: string;
  name: string;
  nickname?: string;
};

export const initialState: UserState = {
  id: "",
  name: "",
  uid: "",
  nickname: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateName: (state, action: PayloadAction<string>) => {return {
      ...state,
      name: action.payload,
    };},
    updateNickname: (state, action: PayloadAction<string>) => {return {
      ...state,
      nickname: action.payload,
    };},
  },
  extraReducers: (builder) => {
    builder.addCase(asyncFetchCurrentUser.fulfilled, (state, action) => {
      const user = action.payload.user;
      user.name && (state.name = user.name);
      user.id && (state.id = user.id.toString());
      user.uid && (state.uid = user.uid);
    });
  },
});

export default userSlice;
