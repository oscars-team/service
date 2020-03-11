import { Controller } from 'egg';
import { PermissionQuery } from '../../service/permission';

/**
 * 登录接口
 */
export default class PermissionController extends Controller {

    /**
     * GET /examples
     */
    async index() {
        let perms = await this.service.permission.index(this.ctx.query);
        this.ctx.success(perms);
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
            const query = this.ctx.request.body as PermissionQuery;
            this.ctx.service.permission.insertOrUpdate(query)
            this.ctx.success();
        } catch (err) {
            this.ctx.error(err);
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
        await this.service.permission.delete(key);
        this.ctx.success();
    }

}
