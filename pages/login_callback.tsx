import { parseCookies, setCookie } from "nookies";
import wrapper from "../redux/create-store";

export const getServerSideProps = wrapper.getServerSideProps(()=> {return async (ctx): Promise<any> =>{
    const nextUrl = ctx.query.next_url as string;
    if(ctx.query.auth_token && ctx.query.uid){
        setCookie(ctx, "LoginControllerAuthToken", ctx.query.auth_token as string);
        setCookie(ctx, "LoginControllerUid", ctx.query.uid as string);
        ctx.res.setHeader("Location", `${nextUrl}`);
        ctx.res.statusCode = 307;
        ctx.res.end();
    }
};},
);

export default function LoginCallback():JSX.Element {
    return (<div></div>);
}
