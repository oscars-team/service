import { Application, MongooseSingleton } from 'egg';
// import * as populate from 'mongoose-autopopulate'
import { Document } from 'mongoose'
import { IEntity } from '../component/schema';

export interface IContentEntity extends IEntity {
    author: string,
    desc: string,
    content: string,
    thumb: string,
}


export interface IContentDocument extends IContentEntity, Document {
}

/**
 * 系统模块模型，用于自定义菜单
 */
export default (app: Application) => {
    const { mongoose } = app;
    const { Schema } = mongoose;
    // const { ObjectId } = mongoose.Types;
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const ContentSchema = new Schema({
        // 内容标题
        title: { type: String, required: true },
        // 内容作者
        author: String,
        // 内容描述
        desc: String,
        // 具体内容
        content: { type: String, required: true },
        // 缩略图
        thumb: String, // cover
        // Content状态
        // - 1: 有效的 0: 无效的 -1: 已存档
        state: { type: Number, default: 1 }
    });

    // // 保存预处理
    // ContentSchema.pre('save', function (this: any, next) {
    //     let now = Date.now()
    //     // 如果已经过期, 报错
    //     if (now > this.expire_at)
    //         throw '票券已经过期'
    //     this.update_at = now;
    //     next();
    // })
    //ContentSchema.plugin(populate);
    return conn.model('Content', ContentSchema);
}