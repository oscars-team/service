import { Application, MongooseSingleton } from 'egg';
import * as populate from 'mongoose-autopopulate'
import { Document, Schema, IEntity, ObjectId } from "../component/schema";
import { IContentEntity } from './content';

export interface IEShopProductEntity extends IEntity {
    name: string
    // 子标题
    subTitle: string
    // 价格
    price: number
    // 封面图
    cover: string
    // 内容
    content: any | IContentEntity
}


export interface IEShopProductDocument extends IEShopProductEntity, Document {
}

/**
 */
export default (app: Application) => {
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const schema = new Schema({
        name: { type: String, required: true },
        subTitle: { type: String },
        price: { type: Number, default: 0 },
        cover: { type: String },
        content: { type: ObjectId, ref: 'Content', autopopulate: true }

    });

    schema.plugin(populate);
    return conn.model('EShopProduct', schema);
}