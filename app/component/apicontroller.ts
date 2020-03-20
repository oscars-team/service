// import { Controller, Context } from 'egg';
// import ContentCampaignService, { ContentCampaignQuery } from '../../service/ContentCampaign';


import { Controller } from 'egg'
import { Context, Service, IDocumentPaged } from "./service";
import { IEntity, Document } from './schema';
import { Query } from "./query";

// interface IApiController<S extends Service<D extends Document, E extends IEntity>> {

//     Service: S

// }

interface IApiController<D extends Document, E extends IEntity, S extends Service<D, E>> {
    Service: S
    mapper: (e: D) => any
    index: () => Promise<void>
    show: () => Promise<void>
    edit: () => Promise<void>
    create: () => Promise<void>
    update: () => Promise<void>
    destroy: () => Promise<void>
}

export default class ApiController<D extends Document, E extends IEntity, S extends Service<D, E>> extends Controller implements IApiController<D, E, S> {
    Service: S;
    constructor(ctx: Context, service: S) {
        super(ctx)
        this.Service = service;
    }

    mapper(e: D) {
        const { _id, ...rest } = e.toJSON({ virtuals: true });
        return rest;
    }

    async index() {
        const { Service, ctx, logger } = this;
        try {
            const query = Query.populate(ctx.query);
            const { list, pagi }: IDocumentPaged = await Service.list(query)
            let results = list.map(this.mapper);
            ctx.paging(results, pagi)
        } catch (err) {
            logger.error(err);
            err = (typeof err === 'string') ? err : JSON.stringify(err);
            ctx.error(err);
        }
    }

    async show() {
        const { Service, ctx, logger } = this;
        const { params } = ctx;
        try {
            let model = await Service.get(params.id);
            ctx.success(model.toJSON({ virtuals: true }));
        } catch (err) {
            logger.error(err);
            err = (typeof err === 'string') ? err : JSON.stringify(err);
            ctx.error(err);
        }

    }

    async edit() {

        this.ctx.success();

    }

    async create() {
        const { Service, ctx, logger } = this;
        const { request } = ctx;
        try {
            let res = await Service.insert(request.body as E)
            ctx.success(res.toJSON({ virtuals: true }));
        }
        catch (err) {
            logger.error(err);
            err = (typeof err === 'string') ? err : JSON.stringify(err);
            ctx.error(err);
        }
    }


    async update() {
        const { Service, ctx, logger } = this;
        const { params, request } = ctx;
        try {
            await Service.update(request.body as E, params.id);
            ctx.success();
        }
        catch (err) {
            logger.error(err);
            err = (typeof err === 'string') ? err : JSON.stringify(err);
            ctx.error(err);
        }
    }

    async destroy() {
        const { Service, ctx, logger } = this;
        const { params } = ctx;
        try {
            await Service.delete(params.id);
            ctx.success();
        } catch (err) {
            logger.error(err);
            err = (typeof err === 'string') ? err : JSON.stringify(err);
            ctx.error(err);
        }
    }

}
