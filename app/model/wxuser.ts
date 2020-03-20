import { Application, MongooseSingleton } from 'egg';
// import * as populate from 'mongoose-autopopulate'
import { Document, Schema, IEntity } from "../component/schema";

export interface IWechatUserEntity extends IEntity {
    nickname: string
    sex: number
    language: string
    city: string
    province: string
    country: string
    headimgurl: string
    remark: string
    groupid: string
    tagid_list: []
    unionid: string
    subscribe_scene: string
    qr_scene: string
    qr_scene_str: string
    privilege: []
}


export interface IWechatUserDocument extends IWechatUserEntity, Document {
}

/**
 */
export default (app: Application) => {
    // const { mongoose } = app;
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const schema = new Schema({
        nickname: { type: String, },
        sex: { type: Number },
        language: { type: String },
        city: { type: String },
        province: { type: String },
        country: { type: String },
        headimgurl: { type: String },
        remark: { type: String },
        groupid: { type: String },
        tagid_list: { type: Array },
        unionid: { type: String, unique: true },
        subscribe_scene: { type: String },
        qr_scene: { type: String },
        qr_scene_str: { type: String },
        // 用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
        // 来自网页授权
        privilege: { type: Array }
    });

    // schema.plugin(populate);
    return conn.model('WechatUser', schema);
}