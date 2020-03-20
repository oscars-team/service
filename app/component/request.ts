import { extend, RequestOptionsInit } from "umi-request";

const errorHandler = (error: { response: Response }): Response => {
    const { response } = error;
    return response;
}
const request = extend({
    errorHandler, // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
});

export interface ReqeustOptions extends RequestOptionsInit { }

export default request;
