import { IncomingMessage, ServerResponse } from "http";
import { ParsedUrlQuery } from "querystring";
import { EnhancedStore, current } from "@reduxjs/toolkit";
import { produceWithPatches } from "immer";
import { GetServerSideProps } from "next";
import { parseCookies, setCookie } from "nookies";
import { Dispatch } from "redux";
import { getVoiceChatApi } from "../../api-fetch/index";
import initializeStore from "../../redux/create-store";
import userSlice from "../../redux/db/user/slice";

export type GetServerSidePropsContext<Q extends ParsedUrlQuery = ParsedUrlQuery> = {
    req: IncomingMessage
    res: ServerResponse
    params?: Q
    query: ParsedUrlQuery
    preview?: boolean
    previewData?: any
    resolvedUrl: string
    locale?: string
    locales?: string[]
    defaultLocale?: string
    currentUser?: any
}

type InnerGetServerSideProps<P extends { [key: string]: unknown }> = (
    context: GetServerSidePropsContext, store?: EnhancedStore
  ) => Promise<{ props: P }>

export type prepareOptions = {
    forceAuth?: boolean;
    authReturnUrl?: string;
};
  
export const prepareSSP = <P extends { [key: string]: unknown }>(
    prepareOptions: prepareOptions={}, store?: EnhancedStore, inner?: InnerGetServerSideProps<P>,
  ): GetServerSideProps => {

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return async (ctx) => {
      const {
        req: { headers },
        res,
      } = ctx;
      // This allows you to set a custom default initialState
      const parsedCookie = parseCookies(ctx);
      const token = parsedCookie["LoginControllerAuthToken"];

      if(!token) {
        if(prepareOptions.forceAuth){
          const retUrl = prepareOptions.authReturnUrl || ctx.req.url || "/";
          res.setHeader("Location", `/loging/${encodeURIComponent(retUrl)}`);
          res.statusCode = 307;
        }
        return inner ? inner(ctx, store) : { props: {} };
      }

      const api = getVoiceChatApi(token);
      let currentUserResponse;
      try{
       currentUserResponse = await api.getUsersCurrentRaw();
      }catch(e){
        if(prepareOptions.forceAuth){
          const retUrl = prepareOptions.authReturnUrl || ctx.req.url || "/";
          res.setHeader("Location", `/loging/${encodeURIComponent(retUrl)}`);
          res.statusCode = 307;
        }
        return inner ? await inner(ctx, store) : { props: {} };
      }

      const currentUser = await currentUserResponse.value();
      currentUser.nickname = currentUser.nickname ? currentUser.nickname : "";
      store?.dispatch(userSlice.actions.setCurrentUser({ newUser: currentUser }));
      return inner ? await inner(ctx, store) : { props: { } };
    };
  };
