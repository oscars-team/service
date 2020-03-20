import { Application, MongooseSingleton } from 'egg';
import * as populate from 'mongoose-autopopulate'
import { Document, Schema, IEntity, ObjectId } from "../component/schema";
import { IEShopProductEntity } from './esproduct';
import { IUserEntity } from './user';

export interface IEShopProductCampaignEntity extends IEntity {
    product: string | IEShopProductEntity,
    amount: number,
    total: number,
    price: number,
    merchant: string | IUserEntity,
    how_to_get: string,
    start_at: Date,
    expire_at: Date
}


export interface IEShopProductCampaignDocument extends IEShopProductCampaignEntity, Document {

}

/**
 */
export default (app: Application) => {
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const schema = new Schema({
        product: { type: ObjectId, ref: 'EShopProduct', autopopulate: true },
        // 剩余数量
        amount: { type: Number, default: 0 },
        // - 0 表示不限数量
        total: { type: Number, required: true, min: 1 },
        // 促销价
        price: { type: Number, required: true, min: 0 },
        // 商户号, 表示属于哪个商户
        merchant: { type: ObjectId, ref: 'User', required: true },
        // 自己上门, 还是配送
        how_to_get: { type: String },
        // 有效开始日期, 如果没有表示之前一直有效
        start_at: { type: Date },
        // 失效日期
        expire_at: { type: Date },
    });

    schema.plugin(populate);
    return conn.model('EShopProductCampaign', schema);
}