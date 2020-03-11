import { Controller, Context } from 'egg';
import MerchantVoucherService, { MerchantVoucherQuery } from '../../../service/campaign/merchantvoucher';

/**
 * 登录接口
 */
export default class VoucherController extends Controller {

    svc: MerchantVoucherService

    constructor(ctx: Context) {
        super(ctx)
        this.svc = this.service.campaign.merchantvoucher;
    }


    private mapper(e) {
        return {
            id: e.id,
            amount: e.amount,
            title: e.voucher.title,
            type: e.voucher.type,
            value: e.voucher.value,
            condition: e.voucher.condition,
            desc: e.voucher.desc,
            merchant: e.merchant,
            create_at: e.create_at,
            expire_at: e.expire_at,
            state: e.state
        }
    }

    /**
     * GET /examples
     */
    async index() {
        let query = MerchantVoucherQuery.extend(this.ctx.query);
        const { list, pagi } = await this.svc.index(query);
        let campaigns = list.map(e => this.mapper(e))
        this.ctx.paging(campaigns, pagi)
    }
    /**
     * GET /examples/:id
     */
    async show() {
        let { id } = this.ctx.params;
        let model = await this.svc.get(id);
        if (model != null) return this.ctx.success(this.mapper(model));
        return this.ctx.error('not found')
    }

    /**
     * GET /examples/:id/edit
     */
    async edit() { }

    /**
     * POST /examples
     */
    async create() {
        let query = MerchantVoucherQuery.extend(this.ctx.request.body);
        try {
            await this.svc.insertOrUpdate(query);
            this.ctx.success();
        } catch (err) {
            this.ctx.error('create error');
        }
    }

    /**
     * PUT /examples/:id
     */
    async update() {

    }

    /**
     * DELETE /examples/:id
     */
    async destroy() {
        // await this.svc.delete({ _id: this.ctx.params.id } as VoucherQuery);
        // this.ctx.success();
    }

}
