import { Controller } from 'egg';
import { ModuleQuery } from '../../service/module';

/**
 * 登录接口
 */
export default class ModuleController extends Controller {

    /**
     * GET /examples
     */
    async index() {
        let modules = await this.service.module.index();
        this.ctx.success(modules);
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
            const query = this.ctx.request.body as ModuleQuery;
            this.ctx.service.module.insertOrUpdate(query)
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
        await this.service.module.delete(key);
        this.ctx.success();
    }

}
