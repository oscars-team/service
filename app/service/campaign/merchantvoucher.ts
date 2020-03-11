import { Service, Context } from 'egg';
import { Query } from '../../component/query';
import { Model, Types } from 'mongoose';
import { IVoucherTemplateDocument } from '../../model/campaign/vouchertemplate'
import { IVoucherCampaignDocument } from '../../model/campaign/vouchercampaign'
const { ObjectId } = Types;

export class MerchantVoucherQuery extends Query {
    // campaign id
    id: string
    // campaign 中允许创建的优惠券的数量
    amount: number
    // 商户号
    merchant: string
    // 优惠券标题
    title: string
    // 优惠券简要描述
    desc: string
    // 优惠券类型
    // 1:折扣券 2:代金券 3:满减券
    type: number
    // 使用条件
    condition: object
    // 券价值
    value: number
    // campaign 中有效开始日期
    start_at: Date
    // campaign 中的截止日期
    expire_at: Date
    // 详细使用说明
    instruction: string
    // campaign 状态
    state: number

    /**
     * 导出查询语句
     */
    public toQuery(): any {
        let val: any = {};
        // this.title ? Object.assign(val, { title: { $regex: this.title } }) : void (0)
        // this.desc ? Object.assign(val, { desc: { $regex: this.title } }) : void (0)
        // this.type ? Object.assign(val, { type: this.type }) : void (0)
        // this.value ? Object.assign(val, { value: this.value }) : void (0)
        // this.instruction ? Object.assign(val, { instruction: { $regex: this.instruction } }) : void (0)
        // this.merchant ? Object.assign(val, { merchant: this.merchant }) : void (0)
        // this.state ? Object.assign(val, { state: this.state }) : void (0)
        // this.create_at ? Object.assign(val, { create_at: { $gt: this.create_at } }) : void (0)
        // this.update_at ? Object.assign(val, { update_at: { $gt: this.update_at } }) : void (0)
        // this.expire_at ? Object.assign(val, { expire_at: { $lt: this.expire_at } }) : void (0)
        // this.use_at ? Object.assign(val, { use_at: { $gt: this.use_at } }) : void (0)
        return val;
    }

    static extend(json: any): MerchantVoucherQuery {
        let q = new MerchantVoucherQuery();
        return Object.assign(q, json);
    }

}

/**
 * Merchant Voucher Service
 */
export default class MerchantVoucherService extends Service {

    VoucherCampaign: Model<IVoucherCampaignDocument>
    VoucherTemplate: Model<IVoucherTemplateDocument>

    constructor(ctx: Context) {
        super(ctx);
        this.VoucherCampaign = ctx.model.Campaign['Vouchercampaign']
        this.VoucherTemplate = ctx.model.Campaign["Vouchertemplate"]
    }

    /**
     * 为商户创建一个优惠券的Campaign
     */
    async insertOrUpdate(query: MerchantVoucherQuery) {
        try {
            const { VoucherCampaign, VoucherTemplate } = this;
            let { id, amount, merchant, start_at, expire_at, state, ...temp } = query;
            merchant = '5e53f10669a9603248d60bbd';
            let template, campaign;
            // 如果 query 中不包含 id 获取 id 为空, 说明是新的 campaign 
            if (!id) {
                this.logger.info('id is empty, begin to insert ' + JSON.stringify(query));
                // 1. 创建 template
                // 2. 创建 Campaign
                template = new VoucherTemplate();
                campaign = new VoucherCampaign();
                // 读取campaign 与 voucher tempalte 数据
                // 申请统一的voucher id
                const voucherId = new ObjectId();
                // 合并voucher 数据
                Object.assign(template, { _id: voucherId }, temp);
                // 合并campaign 数据
                Object.assign(campaign, {
                    voucher: voucherId,
                    amount,
                    merchant,
                    create_at: Date.now(),
                    start_at,
                    expire_at,
                    state: 1
                });
                this.logger.info(template, campaign);
                // 保存 voucher template
                await template.save();
                // 保存 campaign 
                await campaign.save();
                this.logger.info('insert successful');
                return;
            }

            this.logger.info(`id is "${id}", begin to update ${JSON.stringify(query)}`);
            // 处理更新逻辑
            campaign = VoucherCampaign.findById({ _id: id });
            if (!campaign) throw 'voucher campaign 无效';

            template = VoucherTemplate.findById({ _id: campaign.voucher });
            if (!template) throw 'voucher template 无效'

            Object.assign(template, temp);
            Object.assign(campaign, { amount, merchant, start_at, expire_at, state })
            await template.save();
            await campaign.save();
            this.logger.info('update successful');
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    /**
     * 列出 Voucher Campaigns
     * @param query 查询条件
     */
    async index(query: MerchantVoucherQuery) {
        const total = await this.VoucherCampaign.find(query.toQuery()).count();
        const list = await this.VoucherCampaign
            .find(query.toQuery())
            .sort(query.sortOf())
            .skip(query.skipTo())
            .limit(query.limitIn());

        return { list, pagi: query.toPagi(total) };
    }

    async get(id: string) {
        return await this.VoucherCampaign.findById(id);
    }

    // async insertOrUpdate(query: MerchantVoucherQuery) {
    //     // 没有编号视为新增
    //     if (!query._id) {
    //         if (!query.merchant) query.merchant = "5e53f10669a9603248d60bbd"
    //         if (!query.condition) query.condition = { price: 100 }
    //         // 如果券不止一张
    //         if (query.amount == 0) {
    //             query.isPublic = true;
    //             await this.model.create(new this.model(query));
    //         }
    //         else {
    //             for (var i = 0; i < query.amount; i++) {
    //                 // 添加 amount 张
    //                 query.isPublic = false;
    //                 await this.model.create(new this.model(query));
    //             }

    //         }
    //         return;
    //     }

    //     let one = await this.model.findById({ _id: query._id });
    //     Object.assign(one, query);
    //     await one.save();
    // }

    // async delete(query: MerchantVoucherQuery) {
    //     return await this.model.deleteOne({ _id: query._id });
    // }

}
