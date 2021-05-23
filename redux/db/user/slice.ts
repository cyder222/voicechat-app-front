import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type UserState = {
  name: string;
  nickname: string;
  apiKey: string;
};

export const initialState: UserState = {
  name: "",
  nickname: "",
  apiKey: "",
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
    updateApiKey: (state, action: PayloadAction<string>) => {return {
        ...state,
        apiKey: action.payload,
      };},
  },
});

export default userSlice;
