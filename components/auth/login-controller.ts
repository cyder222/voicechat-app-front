// nextjsではcookieが良さそうなので、cookieに保存するようにした
import cookieCutter from "cookie-cutter";

export interface LoginControllerParameter {
    uid: string | null;
    authToken: string | null;
}
export class LoginController {
    public static setAuthToken(token: string): void{
        cookieCutter.set("LoginControllerAuthToken", token);
    }

    public static setRefreshToken(token: string): void
    {
        cookieCutter.set("LoginControllerRefreshToken", token);
    }

    public static setUid(uid: string): void{
        cookieCutter.set("LoginControllerUid", uid);
    }

    public static getInfomation(): LoginControllerParameter{
        return {
            uid: cookieCutter.get("LoginControllerUid"),
            authToken: cookieCutter.get("LoginControllerAuthToken"),
        };
    }
}
  
export default LoginController;
  
