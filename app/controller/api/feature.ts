import { Controller } from 'egg';
export default class ContentController extends Controller {


    async sign() {

        const { ctx, service } = this;

        try {
            let baseUrl = await service.wxplatform.getSnsBaseUrl();
            let authState = await ctx.curl(baseUrl);
            const { location } = authState.headers;
            console.log(location);
            let redirectState = await ctx.curl(location);
            console.log(redirectState);
            ctx.success(baseUrl);
        } catch (err) {
            ctx.error(err);
        }

        // const { wxplatform } = this.service;
        // const signResult: IWechatSignResult | undefined = await wxplatform.wechatSign();
        // console.log(signResult)
        // this.ctx.success(signResult);
    }

}