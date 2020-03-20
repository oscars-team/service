import { Query } from '../component/query';
import { Service, Context } from '../component/service';
import { IWechatPlatformEntity, IWechatPlatformDocument } from '../model/wxplatform'
import { Wechat, MongoStore } from 'wechat-jssdk'
import { IWechatUserEntity } from '../model/wxuser';
export class WechatPlatformQuery extends Query implements IWechatPlatformEntity {
    qrcode: string;
    businessCode: String;
    id?: any;
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

/**
 * 微信平台核心服务
 *  apis:
 *      /api/platforms/sign_{platformid}/
 */
export default class WechatPlatformService extends Service<IWechatPlatformDocument, IWechatPlatformEntity> {

    wxStore: MongoStore
    constructor(ctx: Context) {
        super(ctx, ctx.model.Wxplatform)
        this.wxStore = new MongoStore({ dbAddress: 'mongodb://oscars_super:123@39.98.204.220:22107/oscars' });

    }

    async getAuthPlatform(platformid: string) {
        try {
            let platform: IWechatPlatformEntity = (await this.get(platformid)).toJSON({ virtuals: true });
            let authPlatform: IWechatPlatformEntity = platform.type === 1 ? platform : platform.service ? platform.service : undefined;
            if (!authPlatform || authPlatform.type === 0) throw `platform error: ${authPlatform ? authPlatform.title + ' is not service platform' : 'no service platform found'}`;
            return authPlatform
        } catch (err) {
            throw err;
        }
    }

    getWechatApi(platform: IWechatPlatformEntity) {
        const { wxStore } = this;
        return new Wechat({ appId: platform.appId, appSecret: platform.appSecret, wechatToken: platform.serverToken, wxStore });
    }

    // private getBrowser() {
    //     const { ctx } = this;
    //     let ua = ctx.request.headers['user-agent'].toLowerCase();
    //     return ua.match(/(iphone|ipod|ipad|android)/) ? 'mobile' : 'desktop';
    // }


    async getSnsBaseUrl(authPlatform: IWechatPlatformEntity, { sourceUrl }) {
        const { logger } = this;
        try {
            return this.getWechatApi(authPlatform).oauth
                .generateOAuthUrl(sourceUrl, 'snsapi_base', 'base');
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getBaseProfile(authPlatform: IWechatPlatformEntity, code: string) {
        const { logger } = this;
        try {
            const api = this.getWechatApi(authPlatform);
            return await api.oauth.getUserBaseInfo(code);
        } catch (err) {
            logger.error(err)
            throw err;
        }
    }

    async getSnsInfoUrl(authPlatform: IWechatPlatformEntity, { sourceUrl }) {
        const { logger } = this;
        try {
            return this.getWechatApi(authPlatform).oauth
                .generateOAuthUrl(sourceUrl, 'snsapi_userinfo', 'info');
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getInfoProfile(authPlatform: IWechatPlatformEntity, code: string) {
        const { logger } = this;
        try {
            return this.getWechatApi(authPlatform).oauth
                .getUserInfo(code);
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async isUserSubscribedOn(user: IWechatUserEntity & { openid?: string }, platform: IWechatPlatformEntity) {
        const { service } = this;

        // 优先使用 unionid
        if (user.unionid && (await service.wxsubscribe.find({ unionid: user.unionid, platform: platform.id }))?.subscribe)
            return true;

        if (user.openid && (await service.wxsubscribe.find({ openid: user.openid, platform: platform.id }))?.subscribe)
            return true;

        return false;
    }

}