import { Application, MongooseSingleton } from 'egg';
import * as populate from 'mongoose-autopopulate'
import { Document, Schema, IEntity } from "../component/schema";

export interface IWechatSubscribeEntity extends IEntity {
    openid: string
    // unionid 用户的unionid
    unionid: string
    // 平台id
    platform: string
    // 用户关注标志
    subscribe: boolean
    // 用户关注时间
    subscribe_at: Date
    // 用户取消关注时间
    unsubscribe_at: Date
    // 用户最近一次联系平台时间
    contact_at: Date

}


export interface IWechatSubscribeDocument extends IWechatSubscribeEntity, Document {
}

/**
 */
export default (app: Application) => {
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const schema = new Schema({
        // 用户的openid
        openid: { type: String },
        // unionid 用户的unionid
        unionid: { type: String, required: true },
        // 平台id
        platform: { type: String, required: true },
        // 用户关注标志
        subscribe: { type: Boolean },
        // 用户关注时间
        subscribe_at: { type: Date },
        // 用户取消关注时间
        unsubscribe_at: { type: Date },
        // 用户最近一次联系平台时间
        contact_at: { type: Date }
    });

    schema.plugin(populate);
    return conn.model('WechatSubscribe', schema);
}