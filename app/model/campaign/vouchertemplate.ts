import { Application, MongooseSingleton } from 'egg';
import { Document } from 'mongoose'

export interface IVoucherTemplate {
    title: string
    // 描述(不带格式)
    desc: string
    // 类型: 1折扣券/2代金券/3满减券
    type: number
    // 价值
    //  - 折扣券 0-1 之间, 表示具体折扣
    //  - 代金券 0-999.. , 表示具体面额
    //  - 满减券 0-999.. , 表示减去面额
    value: number
    // 使用条件
    condition: object
    // 使用说明(带格式)
    instruction: string
}


export interface IVoucherTemplateDocument extends IVoucherTemplate, Document {
}

/**
 * 优惠券模板
 */

export default (app: Application) => {
    const { mongoose } = app;
    const { Schema } = mongoose;
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const voucherTemplateSchema = new Schema({
        // 券标题
        title: { required: true, type: String, min: 1, max: 100 },
        // 描述(不带格式)
        desc: { type: String, max: 200 },
        // 类型: 1折扣券/2代金券/3满减券
        type: { type: Number, default: 1 },
        // 价值
        //  - 折扣券 0-1 之间, 表示具体折扣
        //  - 代金券 0-999.. , 表示具体面额
        //  - 满减券 0-999.. , 表示减去面额
        value: { required: true, type: Number, min: 0, default: 0 },
        // 使用条件
        condition: {
            // 价格
            //  - 0: 0元即可用
            price: { type: Number, min: 0, default: 0 },
            // 使用数量
            //times: Number
        },
        // 使用说明(带格式)
        instruction: { type: String, max: 1000 },

    });

    return conn.model('VoucherTemplate', voucherTemplateSchema);
}