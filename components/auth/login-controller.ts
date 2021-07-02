// いい実装がわからなかったので、APIKeyの保存については、reduxと別途行う。
// 将来的には、reduxのmiddleware側で行うなどした方がよいと思う 
export interface LoginControllerParameter {
    uid: string | null;
    authToken: string | null;
}
export class LoginController {
    public static setAuthToken(token: string): void{
        localStorage.setItem("LoginControllerAuthToken", token);
    }

    public static setRefreshToken(token: string): void
    {
        localStorage.setItem("LoginControllerRefreshToken", token);
    }

    public static setUid(uid: string): void{
        localStorage.setItem("LoginControllerUid", uid);
    }

    public static getInfomation(): LoginControllerParameter{
        return {
            uid: localStorage.getItem("LoginControllerUid"),
            authToken: localStorage.getItem("LoginControllerAuthToken"), 
        };
    }
}
  
export default LoginController;
  
