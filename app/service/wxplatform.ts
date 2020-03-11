import { Query } from '../component/query';
import { Service, Context } from '../component/service';
import { IWechatPlatformEntity, IWechatPlatformDocument } from '../model/wxplatform'
import { Wechat, MongoStore } from 'wechat-jssdk'
export class WechatPlatformQuery extends Query implements IWechatPlatformEntity {
    type: number;
    service: any;
    appId: string;
    appSecret: string;
    serverToken: string;
    encodingAESKey: string;
    originId: string;
    pname: string;
    title: string;
    order: number;
    create_at: Date;
    update_at: Date;
    state: number;

    /**
     * 导出查询语句
     */
    // toQuery(): any {
    //     let val: any = {};
    //     // this.state ? Object.assign(val, { state: this.state }) : void (0)
    //     // this.use_at ? Object.assign(val, { use_at: { $gt: this.use_at } }) : void (0)
    //     return val;
    // }
}

export interface IWechatSignResult {
    // 跳转地址, 如果有值说明需要跳转
    redirectUrl: boolean
}
/**
 * 微信平台核心服务
 *  apis:
 *      /api/platforms/sign_{platformid}/
 */
export default class WechatPlatformService extends Service<IWechatPlatformDocument, IWechatPlatformEntity> {
    constructor(ctx: Context) {
        super(ctx, ctx.model.Wxplatform)
    }

    // private getBrowser() {
    //     const { ctx } = this;
    //     let ua = ctx.request.headers['user-agent'].toLowerCase();
    //     return ua.match(/(iphone|ipod|ipad|android)/) ? 'mobile' : 'desktop';
    // }


    async getSnsBaseUrl() {
        const { ctx, logger } = this;
        // 微信认证参数
        const { params, request } = ctx;
        const { platformid } = params;
        const { sourceUrl } = request.body
        // const { socketId, socketNsp } = request.body;
        const dbUrl = this.config.mongoose?.clients ? this.config.mongoose.clients["dbOscars"].url : undefined
        const store = dbUrl ? new MongoStore({ dbAddress: dbUrl }) : undefined;
        try {
            let platform: IWechatPlatformEntity = (await this.get(platformid)).toJSON();
            let authPlatform: IWechatPlatformEntity = platform.type === 1 ? platform : platform.service ? platform.service : undefined;
            if (!authPlatform || authPlatform.type === 0) throw `platform error: ${authPlatform ? authPlatform.title + ' is not service platform' : 'no service platform found'}`;
            const wechat = new Wechat({ appId: authPlatform.appId, appSecret: authPlatform.appSecret, wechatToken: authPlatform.serverToken, store });
            return wechat.oauth.generateOAuthUrl(sourceUrl, 'snsapi_base', 'base');
        } catch (err) {
            logger.error(err);
        }

    }

}