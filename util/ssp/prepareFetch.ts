import { IncomingMessage, ServerResponse } from "http";
import { ParsedUrlQuery } from "querystring";
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
    context: GetServerSidePropsContext
  ) => Promise<{ props: P }>

  
export const prepareSSP = <P extends { [key: string]: unknown }>(
    forceAuth = false, inner?: InnerGetServerSideProps<P>,
  ): GetServerSideProps => {

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return async (ctx) => {
      const {
        req: { headers },
        res,
        query,
      } = ctx;
      // This allows you to set a custom default initialState
      const reduxStore = initializeStore({});
      let token;
      if(query.auth_token && query.uid){
        setCookie(ctx, "LoginControllerAuthToken", query.auth_token as string);
        setCookie(ctx, "LoginControllerUid", query.uid as string);
        token = query.auth_token;
      }else{
        const parsedCookie = parseCookies(ctx);
        token = parsedCookie["LoginControllerAuthToken"];
      }
      if(!token) {
        console.log("tokenがない");
        if(forceAuth){
          res.setHeader("Location", "/loging");
          res.statusCode = 307;
        }
        return inner ? inner(ctx) : { props: {} };
      }

      const api = getVoiceChatApi(token);
      let currentUserResponse;
      try{
       currentUserResponse = await api.getUsersCurrentRaw();
      }catch(e){
        if(forceAuth){
          res.setHeader("Location", "/loging");
          res.statusCode = 307;
        }
        return inner ? inner(ctx) : { props: {} };
      }

      const currentUser = await currentUserResponse.value();
      currentUser.nickname = "";
      reduxStore.dispatch(userSlice.actions.setCurrentUser({ newUser: currentUser }));
      return inner ? inner(ctx) : { props: { currentUser: currentUser } };
    };
  };
