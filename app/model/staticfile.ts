import { Application, MongooseSingleton } from 'egg';
// import * as populate from 'mongoose-autopopulate'
import { Document } from 'mongoose'

export interface IStaticFile {
    uid: string
    name: string
    type: string
    size: number
    path: string
}


export interface IStaticFileDocument extends IStaticFile, Document {
}

/**
 * 系统静态资源
 */
export default (app: Application) => {
    const { mongoose } = app;
    const { Schema } = mongoose;
    // const { ObjectId } = mongoose.Types;
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const thisSchema = new Schema({
        uid: { type: String },
        // 文件名称 (如: thumb.jpg)
        name: { type: String, required: true },
        // 文件类型(如: image/jpeg )
        type: { type: String },
        // 文件大小
        size: { type: Number, default: 0 },
        // 文件物理地址
        path: { type: String },

        create_at: { type: Date },

        lastModifiedDate: { type: Date },
        // StaticFile状态
        //  1: 有效的 0: 无效的 -1: 已存档
        state: { type: Number, default: 1 }
    });

    //
    thisSchema.pre('create', function (this: any, next) {
        let now = Date.now()
        this.create_at = now;
        next();
    })

    // // 保存预处理
    thisSchema.pre('save', function (this: any, next) {
        let now = Date.now();
        if (!this.create_at) this.create_at = now;
        this.lastModifiedDate = now;
        next();
    })
    return conn.model('StaticFile', thisSchema);
}