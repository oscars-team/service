import { Controller } from 'egg';
import { RoleQuery } from '../../service/role';

/**
 * 登录接口
 */
export default class RoleController extends Controller {

    /**
     * GET /examples
     */
    async index() {
        let roles = await this.service.role.index();
        this.ctx.success(roles);
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
        try {
            const query = this.ctx.request.body as RoleQuery;
            this.ctx.service.role.insertOrUpdate(query)
            this.ctx.success();
        } catch (err) {
            this.ctx.error(err);
        }

        // const { ctx, service } = this;
        // const { request } = ctx;
        // const {
        //     body: model
        // } = request;

        // try {
        //     await service.user.createUser(model);
        //     ctx.success();
        // } catch (err) {
        //     // 索引重复
        //     if (err.code === 11000) {
        //         ctx.error(`duplicate loginname/displayname`)
        //     }
        // }
    }

    /**
     * PUT /examples/:id
     */
    async update() {
        const body = this.ctx.request.body;
        this.ctx.service.role.insertOrUpdate(body);
        this.ctx.success();
    }

    /**
     * DELETE /examples/:id
     */
    async destroy() {
        // const key = this.ctx.params.id;
        // await this.service.user.delete(key);
        // this.ctx.success();
    }

}
