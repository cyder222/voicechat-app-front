import { getCookieByKey, setCookieByKeyValue } from "../../util/cookie";

export interface LoginControllerParameter {
  uid: string | null;
  authToken: string | null;
}
export class LoginController {
  public static setAuthToken(token: string): void {
    setCookieByKeyValue("LoginControllerAuthToken", token);
  }

  public static setRefreshToken(token: string): void {
    setCookieByKeyValue("LoginControllerRefreshToken", token);
  }

  public static setUid(uid: string): void {
    setCookieByKeyValue("LoginControllerUid", uid);
  }

  public static getInfomation(): LoginControllerParameter {
    return {
      uid: getCookieByKey("LoginControllerUid"),
      authToken: getCookieByKey("LoginControllerAuthToken"),
    };
  }
}

export default LoginController;
