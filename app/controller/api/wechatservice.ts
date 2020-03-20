import { Service, Context } from 'egg';
import { IWechatMessage } from '../../middleware/xmlbodyparser';
import { IWechatPlatformEntity } from '../../model/wxplatform';
import * as WechatAPi from 'wechat-api'
import { IWechatUserEntity } from '../../model/wxuser';
import { IWechatSubscribeEntity } from '../../model/wxsubscribe';
import { IWechatOpenIdEntity } from '../../model/wxopenid';
const getUser = (openid: string, platform: IWechatPlatformEntity): Promise<IWechatUserEntity> => {
    const api = new WechatAPi(platform.appId, platform.appSecret);
    return new Promise((resolve, reject) => {
        api.getUser(openid, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
}



export default class WechatService extends Service {

    Platform: IWechatPlatformEntity;
    Openid: string
    constructor(ctx: Context) {
        super(ctx);

    }



    async signature() {
        const { ctx, service } = this;
        if (ctx.method != 'GET') return
        const { app: appId } = ctx.query;
        if (!appId) return

        let platform = await service.wxplatform.find({ appId });
        if (!platform) return

        const wechat = await service.wxplatform.getWechatApi(platform);
        if (wechat.jssdk.verifySignature(ctx.query)) {
            ctx.body = ctx.query.echostr;
            return
        }
        ctx.status = 200;
        return;
    }


    async index() {
        const { ctx } = this;
        const xml: IWechatMessage = ctx.request.body;
        const { app: appId, openid } = ctx.query;
        this.Openid = openid;
        let _pfm = await this.service.wxplatform.find({ appId });
        if (!_pfm) throw 'err: platform id invalid';

        this.Platform = _pfm;
        if (xml.MsgType && xml.MsgType[0] == 'text') {
            return await this.messageHandler();
        }

        if (xml.MsgType && xml.MsgType[0] == 'event')
            return await this.eventHandler();


        ctx.replyText("", xml.ToUserName, xml.FromUserName)
        return;
    }

    async messageHandler() {
        const { ctx, Openid, service } = this;
        const xml: IWechatMessage = ctx.request.body;
        const { FromUserName, ToUserName } = xml;
        const [text] = xml.Content || [];
        await service.wxsubscribe.findAndUpdate({ openid: Openid }, { contact_at: new Date() } as IWechatSubscribeEntity)
        ctx.replyText(text, ToUserName, FromUserName);
    }

    async eventHandler() {
        const xml: IWechatMessage = this.ctx.request.body;
        const [event] = xml.Event || [];

        if (event && event === 'subscribe') {
            return this.handleSubscribe();
        }

        if (event && event === 'unsubscribe') {
            return this.handleUnsubscribe();
        }

        if (event && event.toLowerCase() === 'scan') {
            return this.handleScan();
        }

        return;
    }

    private async handleSubscribe() {
        try {
            const { Openid, Platform, service } = this;
            // 拿到最新的用户资料
            const userProfile = await getUser(Openid, Platform)
            // 更新用户资料
            let userDoc = await service.wxuser.findAndUpdate({ unionid: userProfile.unionid }, userProfile, { new: true, upsert: true });
            // 更新openid档案
            await service.wxopenid.findAndUpdate({ unionid: userProfile.unionid, platform: Platform.id }, {
                openid: Openid,
                unionid: userProfile.unionid,
                platform: Platform.id,
                wxuser: userDoc._id
            } as IWechatOpenIdEntity, { new: true, upsert: true });
            // 更新关注档案
            await service.wxsubscribe.findAndUpdate({ unionid: userProfile.unionid, platform: Platform.id }, {
                openid: Openid,
                contact_at: new Date(),
                platform: Platform.id,
                subscribe: true,
                subscribe_at: new Date(),
                unionid: userProfile.unionid,
            } as IWechatSubscribeEntity, { new: true, upsert: true });

            const { app } = this.ctx;
            const { redis } = service;
            let socketid = await redis.get(`${userProfile.unionid}+${Platform.id}`);
            if (!socketid) { this.logger.error(`socket ${userProfile.unionid}+${Platform.id} is not registed`); return }
            const nsp = app.io.of('/feature');
            nsp.sockets[socketid].emit('subscribed', { status: true });

        } catch (err) {
            throw err;
        }
    }
    private async handleUnsubscribe() {
        try {
            const { Openid, service, Platform } = this;
            await service.wxsubscribe.findAndUpdate({ openid: Openid }, {
                subscribe: false,
                platform: Platform.id,
                unsubscribe_at: new Date()
            } as IWechatSubscribeEntity)
        } catch (err) {
            throw err;
        }
    }
    private async handleScan() {

    }

}