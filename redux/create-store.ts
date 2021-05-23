import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { Store, combineReducers } from "redux";
import userSlice, { initialState as userState } from "./db/user/slice";

const rootReducer = combineReducers({ user: userSlice.reducer });

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const preloadedState = () => {
  return { user: userState };
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
