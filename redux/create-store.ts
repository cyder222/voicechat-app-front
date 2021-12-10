import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { Store, combineReducers } from "redux";
import roomSlice, { initialState as RoomState } from "./db/room/slice";
import userSlice, { initialState as UserState } from "./db/user/slice";

export const rootReducer = combineReducers({ user: userSlice.reducer, room: roomSlice.reducer });

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const preloadedState = () => {
  return { user: UserState, room: RoomState };
};

export type StoreState = ReturnType<typeof preloadedState>;

export type ReduxStore = Store<StoreState>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
const createStore = () => {
  const middlewareList = [...getDefaultMiddleware(), logger];

  return configureStore({
    reducer: rootReducer,
    middleware: middlewareList,
    devTools: process.env.DEV_MODE !== "production",
    preloadedState: preloadedState(),
  });
};

export default createStore;
