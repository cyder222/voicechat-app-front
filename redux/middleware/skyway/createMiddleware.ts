import { Middleware, MiddlewareAPI } from "redux";


export interface Options {
    roomMode: string;
}

const defaultOptions: Options = { roomMode: "mesh" };


export default (newOptions: Options): Middleware => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const options = { ...defaultOptions, ...newOptions };

    return (store: MiddlewareAPI)=>{return (next)=>{return (action): any=>{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dispatch } = store;
        return next(action);
    };};};
};
