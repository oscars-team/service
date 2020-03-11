import { Controller, Context } from 'egg';
import ContentService, { ContentQuery } from '../../service/content';

/**
 * 登录接口
 */
export default class ContentController extends Controller {

    svc: ContentService

    constructor(ctx: Context) {
        super(ctx)
        this.svc = this.service.content;
    }


    private mapper(e) {
        return e.toObject({ virtual: true });
    }

    /**
     * GET /examples
     */
    async index() {
        let query = ContentQuery.extend(this.ctx.query);
        const { list, pagi } = await this.svc.list(query);
        let results = list.map(e => this.mapper(e))
        this.ctx.paging(results, pagi)
    }
    /**
     * GET /examples/:id
     */
    async show() {
        let { id } = this.ctx.params;
        try {
            let one = await this.svc.get(id);
            this.ctx.success(one);
        } catch (err) {
            err = (typeof err === 'string') ? err : JSON.stringify(err);
            this.ctx.error(err);
        }
    }

    /**
     * GET /examples/:id/edit
     */
    async edit() {

    }

    /**
     * POST /examples
     */
    async create() {
        let query = ContentQuery.extend(this.ctx.request.body);
        try {
            await this.svc.insert(query);
            this.ctx.success();
        } catch (err) {
            err = (typeof err === 'string') ? err : JSON.stringify(err);
            this.ctx.error('create error');
        }
    }

    /**
     * PUT /examples/:id
     */
    async update() {
        const id = this.ctx.params.id;
        const params = this.ctx.request.body;
        const query = ContentQuery.extend(params);

        try {
            await this.svc.update(id, query);
            this.ctx.success();
        } catch (err) {
            err = (typeof err === 'string') ? err : JSON.stringify(err);
            this.ctx.error(err);
        }

    }

    /**
     * DELETE /examples/:id
     */
    async destroy() {
        const id = this.ctx.params.id;
        try {
            await this.svc.delete(id);
            this.ctx.success();
        } catch (err) {
            err = (typeof err === 'string') ? err : JSON.stringify(err);
            this.ctx.error(err);
        }
    }

}
