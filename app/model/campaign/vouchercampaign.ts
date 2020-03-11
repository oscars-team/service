import { Application, MongooseSingleton } from 'egg';
import * as populate from 'mongoose-autopopulate'
import { Document } from 'mongoose'

export interface IVoucherCampaign {
    voucher: any
    // 票券数量
    // - 0 表示不限数量
    amount: number
    // 商户号, 表示属于哪个商户
    merchant: string
    // 创建日期
    create_at: Date
    // 更新时间
    update_at: Date,
    // 有效开始日期, 如果没有表示之前一直有效
    start_at: Date
    // 失效日期
    expire_at: Date
    // Campaign状态
    // - 1: 有效的 0: 无效的 -1: 已存档
    state: number
}


export interface IVoucherCampaignDocument extends IVoucherCampaign, Document {
}

/**
 * 系统模块模型，用于自定义菜单
 */
export default (app: Application) => {
    const { mongoose } = app;
    const { Schema } = mongoose;
    const { ObjectId } = mongoose.Types;
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const voucherCampaignSchema = new Schema({
        // 票券模板
        voucher: { type: ObjectId, required: true, ref: 'VoucherTemplate', autopopulate: true },
        // 票券数量
        // - 0 表示不限数量
        amount: { type: Number, default: 0 },
        // 商户号, 表示属于哪个商户
        merchant: { type: ObjectId, required: true },
        // 创建日期
        create_at: { type: Date, default: Date.now() },
        // 更新时间
        update_at: Date,
        // 有效开始日期, 如果没有表示之前一直有效
        start_at: { type: Date },
        // 失效日期
        expire_at: { type: Date },
        // Campaign状态
        // - 1: 有效的 0: 无效的 -1: 已存档
        state: { type: Number, default: 1 }

    });

    // /**
    //  * 使用方法
    //  */
    // voucherSchema.methods.use = async function (this: any, price: number) {
    //     if (this.state != 1) throw '无效票券';
    //     if (price < this.condition.price) throw '不满足使用条件';
    //     let now = Date.now();
    //     if (now > this.expire_at) throw '票券已经过期'
    //     this.state == 0;
    //     this.use_at = now;
    //     await this.save()
    // }
    // // 保存预处理
    // voucherSchema.pre('save', function (this: any, next) {
    //     let now = Date.now()
    //     // 如果已经过期, 报错
    //     if (now > this.expire_at)
    //         throw '票券已经过期'
    //     this.update_at = now;
    //     next();
    // })
    voucherCampaignSchema.plugin(populate);
    return conn.model('VoucherCampaign', voucherCampaignSchema);
}