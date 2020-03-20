import { Application, MongooseSingleton } from 'egg';
import { Document, Schema, IEntity, ObjectId } from "../component/schema";
import { IUserEntity } from './user';
import { IEShopProductCampaignEntity } from './esproductcampaign';

export const EShopOrderStatus = {
    UnPaid: 1,
    UnDeliver: 2,
    UnSigned: 4,
    UnCommit: 8,
    Dealed: 16,
    Archived: -1
}


export interface IEShopOrderHowToGetEntity {
    type: 'self' | 'deliver'
    name: string
    pass: string
    prefix: string
    mobile: string

    country: string
    province: string
    city: string
}

export interface IEShopOrderEntity extends IEntity {
    price: number,
    merchant: string | IUserEntity,
    campaign: string | IEShopProductCampaignEntity,
    purchase: string | IUserEntity,
}


export interface IEShopOrderDocument extends IEShopOrderEntity, Document {
}

/**
 */
export default (app: Application) => {
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const schema = new Schema({
        // 订单价格 (当时)
        price: { type: Number, required: true },
        // 商户
        merchant: { type: String, required: true, ref: 'User' },
        // 商品 (实时)
        campaign: { type: String, required: true, ref: 'EShopProductCampaign' },
        // 买方信息(实时)
        purchase: { type: String, required: true, ref: 'User' }
        // 1:  未支付订单
        // 2:  未发货订单
        // 4:  未签收订单
        // 8:  未评价订单
        // 16: 已结束订单
        //state
        // 当时
        //extra: {
        //  purchase: 买方信息
        //  campaign: 商品
        //  how_to_get: 方式
        //}
    });

    return conn.model('EShopOrder', schema);
}