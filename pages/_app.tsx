import { AppProps } from "next/app";
import Head from "next/head";
import React, { FC } from "react";
import { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";
import wrapper from "../redux/create-store";

const GlobalStyles = createGlobalStyle`
  button {
    cursor: pointer;
  }
`;

const MyApp  = ({ Component, pageProps }: AppProps): JSX.Element =>
 {
  return (
    <div>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="cross-origin" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Reset />
      <GlobalStyles />
      <Component {...pageProps} />;
    </div>
  );
};

export default wrapper.withRedux(MyApp);
