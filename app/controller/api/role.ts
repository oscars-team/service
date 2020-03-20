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
