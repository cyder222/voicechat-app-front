import reduxWebsocket from "@giantmachines/redux-websocket";
import { EnhancedStore, ThunkAction, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { Context, createWrapper } from "next-redux-wrapper";
import { Action, Store, combineReducers } from "redux";
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

const reduxWebsocketMiddleware = reduxWebsocket();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createStore = (context: Context):EnhancedStore => {
  const middlewareList = [...getDefaultMiddleware({ serializableCheck: false }), reduxWebsocketMiddleware];

  if(process.env.DEV_MODE !== "production") {
    middlewareList.push(logger);
  }
  return configureStore({
    reducer: rootReducer,
    middleware: middlewareList,
    devTools: process.env.DEV_MODE !== "production",
  });
};

const makeStore = (context: Context): EnhancedStore => {return createStore(context);};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

const wrapper = createWrapper(makeStore, { debug: process.env.NODE_ENV === "development" });

export default wrapper;
