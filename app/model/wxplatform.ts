import { Application, MongooseSingleton } from 'egg';
import * as populate from 'mongoose-autopopulate'
import { Document, Schema, IEntity, ObjectId } from "../component/schema";

export interface IWechatPlatformEntity extends IEntity {
    //公众号类型
    // 0 订阅号, 1 服务号
    type: number
    // 服务号
    //  针对订阅号来说, 需要一个服务号用来获取用户资料
    service: any
    // 公众号的 appId
    appId: string
    // 公众阿訇的 appSecret
    appSecret: string
    // 服务器配置中的 令牌 Token
    serverToken: string
    // 服务器配置中的 消息加解密秘钥
    encodingAESKey: string
    // 公众号的原始ID
    originId: string
    // 平台微信号
    pname: string
}


export interface IWechatPlatformDocument extends IWechatPlatformEntity, Document {
}

/**
 */
export default (app: Application) => {
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const schema = new Schema({
        //公众号类型
        // 0 订阅号, 1 服务号
        type: { type: Number, default: 1, required: true },
        // 服务号
        //  针对订阅号来说, 需要一个服务号用来获取用户资料
        service: { type: ObjectId, ref: 'WechatPlatform', autopopulate: true },
        // 公众号的 appId
        appId: { type: String, required: true, index: true, unique: true },
        // 公众阿訇的 appSecret
        appSecret: { type: String, required: true },
        // 服务器配置中的 令牌 Token
        serverToken: { type: String },
        // 服务器配置中的 消息加解密秘钥
        encodingAESKey: { type: String },
        // 公众号的原始ID
        originId: { type: String },
        // 平台微信号
        pname: { type: String }
    });

    schema.plugin(populate);
    return conn.model('WechatPlatform', schema);
}