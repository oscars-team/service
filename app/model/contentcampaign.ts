import { Application, MongooseSingleton } from 'egg';
import * as populate from 'mongoose-autopopulate'
import { Document, Schema, IEntity } from "../component/schema";

export interface IContentCampaignEntity extends IEntity {
    content: string
    // 策略描述
    description: string,
    // 转发深度
    depth: number,
    // 引导关注的微信平台
    platform: string
    // 以下属性为规则
    // 是否强制关注
    isForce: boolean,
    // 是否显示一部分
    isPartial: boolean,
    // 部分显示页数
    partialPages: number,
    // 能否跳过
    canSkip: boolean,
    // 强制关注几率
    chance: number,
    // 浏览器限制, [ 'desktop', 'mobile' ]
    browsers: string[]
    // 是否为默认策略
    isDefault: boolean
}


export interface IContentCampaignDocument extends IContentCampaignEntity, Document {
}

/**
 */
export default (app: Application) => {
    const { mongoose } = app;
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const schema = new Schema({
        //文章编号
        content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', autopopulate: true },
        // 策略描述
        description: String,
        // 转发深度
        depth: Number,
        // 引导关注的微信平台
        platform: { type: mongoose.Schema.Types.ObjectId, }, // ref: 'WxPlatform', autopopulate: true
        // 以下属性为规则
        // 是否强制关注
        isForce: Boolean,
        // 是否显示一部分
        isPartial: Boolean,
        // 部分显示页数
        partialPages: Number,
        // 能否跳过
        canSkip: Boolean,
        // 强制关注几率
        chance: Number,
        // 虚拟文章配置参数
        dummy: {
            title: String,
            thumb: String,
            desc: String
        },
        // 浏览器限制, [ 'desktop', 'mobile' ]
        browsers: { type: Array, default: ['mobile'] },
        // 是否为默认策略
        isDefault: { type: Boolean, default: false },
    });

    schema.plugin(populate);
    return conn.model('ContentCampaign', schema);
}