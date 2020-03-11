import { Controller } from 'egg';

/**
 * 登录接口
 */
export default class MemberController extends Controller {

    /**
     * GET /examples
     */
    async index() {
        const { query } = this.ctx;
        const { current, pageSize } = query;
        const { total, map } = await this.service.user.getAdminList(query);
        this.ctx.paging(map, { current, pageSize, total })
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
        const { ctx, service } = this;
        const { request } = ctx;
        const {
            body: model
        } = request;

        try {
            await service.user.createUser(model);
            ctx.success();
        } catch (err) {
            // 索引重复
            if (err.code === 11000) {
                ctx.error(`duplicate loginname/displayname`)
            }
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
        const key = this.ctx.params.id;
        await this.service.user.delete(key);
        this.ctx.success();
    }


    async menus() {
        const { query } = this.ctx;
        let pers = await this.service.user.getMenus(query.id);
        this.ctx.success(pers);
    }

}
