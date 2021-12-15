import { NextPageContext } from "next";
import { destroyCookie, parseCookies, setCookie } from "nookies";

export function setCookieByKeyValue(key: string, value: string, ctx?: NextPageContext): void {
  setCookie(ctx, key, value, { maxAge: 30 * 24 * 60 * 60 });
}

// ついでにcookie削除(動作確認してません)
export function destroyCookieByKey(key: string, ctx?: NextPageContext): void {
  destroyCookie(ctx, key);
}

export function getCookieByKey(key: string, ctx?: NextPageContext): string {
  const cookie = parseCookies(ctx);
  return cookie[key];
}
