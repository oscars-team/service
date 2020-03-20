import { Application, MongooseSingleton } from 'egg';
import * as populate from 'mongoose-autopopulate'
import { Document, Schema, IEntity, ObjectId } from "../component/schema";

export interface IWechatOpenIdEntity extends IEntity {
    openid?: string
    unionid?: string
    platform?: any
    wxuser?: any
}


export interface IWechatOpenIdDocument extends IWechatOpenIdEntity, Document {

}

/**
 */
export default (app: Application) => {
    // const { mongoose } = app;
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const schema = new Schema({
        openid: { type: String },
        unionid: { type: String },
        platform: { type: String, required: true, ref: 'WechatPlatform', autopopulate: true },
        wxuser: { type: ObjectId, ref: "WechatUser", autopopulate: true }
    });

    schema.plugin(populate);
    return conn.model('WechatOpenId', schema);
}