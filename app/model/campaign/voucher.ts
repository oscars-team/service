import { Application, MongooseSingleton } from 'egg';
/**
 * 系统模块模型，用于自定义菜单
 */
export default (app: Application) => {
    const { mongoose } = app;
    const { Schema } = mongoose;
    const { ObjectId } = mongoose.Types;
    const conn = (app.mongooseDB as MongooseSingleton).get('dbOscars');
    const voucherSchema = new Schema({
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
        // 该券是否是公开的
        //   公开的表示该券所有人可以使用
        //   不公开表示该券由用户认领, 属于用户私人财产
        isPublic: { type: Boolean, default: false },
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
        // 商户号, 表示属于哪个商户
        merchant: { type: ObjectId, required: true },
        // 创建日期
        create_at: { type: Date, default: Date.now() },
        // 更新时间
        update_at: Date,
        // 失效日期
        expire_at: { type: Date, required: true },
        // 被使用日期
        use_at: { type: Date },
        // 票券状态
        // - 1: 有效 0: 无效 -1:删除
        state: { type: Number, default: 1 }

    });

    /**
     * 使用方法
     */
    voucherSchema.methods.use = async function (this: any, price: number) {
        if (this.state != 1) throw '无效票券';
        if (price < this.condition.price) throw '不满足使用条件';
        let now = Date.now();
        if (now > this.expire_at) throw '票券已经过期'
        this.state == 0;
        this.use_at = now;
        await this.save()
    }
    // 保存预处理
    voucherSchema.pre('save', function (this: any, next) {
        let now = Date.now()
        // 如果已经过期, 报错
        if (now > this.expire_at)
            throw '票券已经过期'
        this.update_at = now;
        next();
    })

    return conn.model('Voucher', voucherSchema);
}