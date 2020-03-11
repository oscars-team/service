import { Service, Context } from 'egg';
import { Query } from '../../component/query';
import { Model } from 'mongoose';
// const { ObjectId } = Types;

export class VoucherQuery extends Query {
    amount: number
    // 编号
    _id: string
    // 券标题
    title: string
    // 券描述
    desc: string
    // 券类型
    type: number
    // 券价值
    value: number
    // 是否是公开的票券(所有人都可以用)
    isPublic: boolean
    // 使用条件
    condition: any
    // 使用说明
    instruction: string
    // 商户号
    merchant: string
    // 创建日期
    create_at: Date
    // 更新日期
    update_at: Date
    // 失效日期
    expire_at: Date
    // 被使用日期
    use_at: Date
    // 票券状态
    state: number
    /**
     * 导出查询语句
     */
    public toQuery(): any {
        let val: any = {};
        this.title ? Object.assign(val, { title: { $regex: this.title } }) : void (0)
        this.desc ? Object.assign(val, { desc: { $regex: this.title } }) : void (0)
        this.type ? Object.assign(val, { type: this.type }) : void (0)
        this.value ? Object.assign(val, { value: this.value }) : void (0)
        this.instruction ? Object.assign(val, { instruction: { $regex: this.instruction } }) : void (0)
        this.merchant ? Object.assign(val, { merchant: this.merchant }) : void (0)
        this.state ? Object.assign(val, { state: this.state }) : void (0)
        this.create_at ? Object.assign(val, { create_at: { $gt: this.create_at } }) : void (0)
        this.update_at ? Object.assign(val, { update_at: { $gt: this.update_at } }) : void (0)
        this.expire_at ? Object.assign(val, { expire_at: { $lt: this.expire_at } }) : void (0)
        this.use_at ? Object.assign(val, { use_at: { $gt: this.use_at } }) : void (0)
        return val;
    }



    /**
     * 将客户端脚本转换为对象
     * @param json 客户端传来的参数
     */
    public static extend(json: any): VoucherQuery {
        let q = new VoucherQuery();
        return Object.assign(q, json);
    }
}

/**
 * Voucher Service
 */
export default class Voucher extends Service {

    model: Model<any>

    constructor(ctx: Context) {
        super(ctx);
        this.model = ctx.model.Campaign["Voucher"]
    }

    /**
     * 列出 Vouchers
     * @param query 查询条件
     */
    async index(query: VoucherQuery) {
        const total = await this.model.find(query.toQuery()).count();
        const list = await this.model
            .find(query.toQuery())
            .sort(query.sortOf())
            .skip(query.skipTo())
            .limit(query.limitIn());

        return { list, pagi: query.toPagi(total) };
    }

    async insertOrUpdate(query: VoucherQuery) {
        // 没有编号视为新增
        if (!query._id) {
            if (!query.merchant) query.merchant = "5e53f10669a9603248d60bbd"
            if (!query.condition) query.condition = { price: 100 }
            // 如果券不止一张
            if (query.amount == 0) {
                query.isPublic = true;
                await this.model.create(new this.model(query));
            }
            else {
                for (var i = 0; i < query.amount; i++) {
                    // 添加 amount 张
                    query.isPublic = false;
                    await this.model.create(new this.model(query));
                }

            }
            return;
        }

        let one = await this.model.findById({ _id: query._id });
        Object.assign(one, query);
        await one.save();
    }

    async delete(query: VoucherQuery) {
        return await this.model.deleteOne({ _id: query._id });
    }

}
