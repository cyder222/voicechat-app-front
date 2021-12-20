import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { Store, combineReducers } from "redux";
import logger from "redux-logger";
import roomSlice, { initialState as RoomState } from "./db/room/slice";
import userSlice, { initialState as UserState } from "./db/user/slice";
import roomPagePeerSlice, { initialState as roomPagePeerState } from "./page/room/peers/slice";

export const rootReducer = combineReducers({
  user: userSlice.reducer,
  room: roomSlice.reducer,
  roomPagePeer: roomPagePeerSlice.reducer,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const defaultPreloadedState = () => {
  return { user: UserState, room: RoomState, roomPagePeer: roomPagePeerState };
};

export type StoreState = ReturnType<typeof defaultPreloadedState>;

export type ReduxStore = Store<StoreState>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
const createStore = (initialState = {}) => {
  const middlewareList = [...getDefaultMiddleware(), logger];
  const preloadedState = initialState === {} ? defaultPreloadedState : initialState;
  return configureStore({
    reducer: rootReducer,
    middleware: middlewareList,
    devTools: process.env.DEV_MODE !== "production",
    preloadedState: preloadedState,
    
  });
};

export default createStore;
