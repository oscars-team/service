import { Query } from '../component/query';
import { Service, Context } from '../component/service';
import { IEShopOrderEntity, IEShopOrderDocument, IEShopOrderHowToGetEntity } from '../model/esorder'
import { IEShopProductCampaignEntity } from '../model/esproductcampaign';
import { IWechatUserEntity } from '../model/wxuser';
import { IUserEntity } from '../model/user';
import { ObjectId } from '../component/schema';
import * as util from 'utility'
export interface ICreateOrderPayload {
    title: string
    price: number
    merchant: string
    campaign: IEShopProductCampaignEntity
    purchase: IWechatUserEntity
    how_to_get: Partial<IEShopOrderHowToGetEntity>
}


export class EShopOrderQuery extends Query implements IEShopOrderEntity {
    price: number;
    merchant: string | import("../model/user").IUserEntity;
    campaign: string | import("../model/esproductcampaign").IEShopProductCampaignEntity;
    purchase: string | import("../model/user").IUserEntity;
    id?: any;
    title?: string | undefined;
    order?: number | undefined;
    extra?: any;
    create_at?: Date | undefined;
    update_at?: Date | undefined;
    state?: number | undefined;


    /**
     * 导出查询语句
     */
    // toQuery(): any {
    //     let val: any = {};
    //     // this.state ? Object.assign(val, { state: this.state }) : void (0)
    //     // this.use_at ? Object.assign(val, { use_at: { $gt: this.use_at } }) : void (0)
    //     return val;
    // }

    /**
     * 将客户端脚本转换为对象
     * @param json 客户端传来的参数
     */
    static extend(json: any): EShopOrderQuery {
        let q = new EShopOrderQuery();
        return Object.assign(q, json);
    }
}

export default class EShopOrderService extends Service<IEShopOrderDocument, IEShopOrderEntity> {
    constructor(ctx: Context) {
        super(ctx, ctx.model.Esorder)
    }


    async createOrder(payload: ICreateOrderPayload) {
        const { Model, service, logger, app } = this;
        const { Model: User } = service.user;
        try {
            const { id: campaignId, ...restCampaign } = payload.campaign;
            const { purchase: pu } = payload

            if (!campaignId) throw 'invalid campaign id';
            if (!payload.price) throw 'invalid price'
            if (!payload.merchant) throw 'invalid merchant id'

            const mobile = payload.how_to_get.mobile;
            if (!mobile) throw 'invalid mobile'
            // 如果系统中没有该用户
            // 自动帮用户注册账号
            // 1. 添加或更新微信用户信息
            let purchase = await service.wxuser.findAndUpdate({ unionid: pu.unionid }, pu, { new: true, upsert: true, })
            // 2. 添加或更新系统用户信息
            let user = await service.user.find({ '$or': [{ unionid: pu.unionid }, { mobile }] });
            // 如果系统中不存在这个用户
            // 自动帮他注册
            if (!user) {
                const objectId = new ObjectId().toString();
                const salt = util.randomString()
                const password = util.md5(util.md5(new ObjectId().toString()) + salt);
                user = new User({
                    avatar: pu.headimgurl,
                    unionid: pu.unionid,
                    email: `${objectId}@${app.config.siteInfo.emailSubfix}`,
                    mobile,
                    name: objectId,
                    salt,
                    password,
                    extra: {
                        mobiles: [mobile]
                    }
                } as IUserEntity);
                await user.save();
            } else {
                // 如果系统中存在这个用户
                let existMobiles = user.extra?.mobiles || []
                if (!existMobiles.includes(mobile)) {
                    existMobiles.push(mobile);
                    user.extra = {
                        ...user.extra,
                        mobiles: existMobiles
                    };
                }
                if (user.mobile === mobile && !user.unionid)
                    user.unionid = pu.unionid

                await user.save();

            }
            // 保存用户

            // 添加订单信息
            const order = new Model({
                title: payload.title,
                campaign: campaignId,
                merchant: payload.merchant,
                price: payload.price,
                purchase: user.id,
                extra: {
                    purchase: purchase.toJSON({ virtuals: true }),
                    campaign: restCampaign,
                    how_to_get: payload.how_to_get
                },
                state: 1
            } as IEShopOrderEntity);
            return await order.save();
        } catch (err) {
            logger.error(err)
            throw err;
        }
    }

}