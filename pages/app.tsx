import { AppProps } from "next/app";
import { Provider } from "react-redux";
import React from "react";
import createStore from "../redux/create-store";

function MyApp({ Component, pageProps }: AppProps):JSX.Element {
  return  <Provider store={createStore()}>
       <Component {...pageProps} />;
  </Provider>;
}

export default MyApp;
