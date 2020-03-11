import { Controller, Context } from 'egg';
import VoucherService, { VoucherQuery } from '../../../service/campaign/voucher';

/**
 * 登录接口
 */
export default class VoucherController extends Controller {

    svc: VoucherService

    constructor(ctx: Context) {
        super(ctx)
        this.svc = this.service.campaign.voucher;
    }

    /**
     * GET /examples
     */
    async index() {
        let query = VoucherQuery.extend(this.ctx.query);
        const { list, pagi } = await this.svc.index(query);
        this.ctx.paging(list, pagi)
    }
    /**
     * GET /examples/:id
     */
    async show() { }

    /**
     * GET /examples/:id/edit
     */
    async edit() { }

    /**
     * POST /examples
     */
    async create() {
        const query = this.ctx.request.body as VoucherQuery;
        await this.svc.insertOrUpdate(query);
        this.ctx.success();
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
        await this.svc.delete({ _id: this.ctx.params.id } as VoucherQuery);
        this.ctx.success();
    }

}
