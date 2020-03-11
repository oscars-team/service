import { Service as EService, Context as EContext } from 'egg';
import { IPaging, IQuery } from './query';
import { Document, IEntity, ObjectId } from './schema';
import { Model } from 'mongoose'

export interface IDocumentPaged {
    list: any[],
    pagi: IPaging
}

interface IService<D extends Document, E extends IEntity> {
    Model: Model<D>
    get: (id: string) => Promise<any>
    list: (query: IQuery) => Promise<IDocumentPaged>
    insert: (model: E, id?: string) => Promise<void>
    update: (model: E, id: string) => Promise<void>
    delete: (id: string) => Promise<void>
}

export interface Context extends EContext { }

export class Service<D extends Document, E extends IEntity> extends EService implements IService<D, E>  {

    Model: Model<D>
    constructor(ctx: Context, model: Model<D>) {
        super(ctx)
        this.Model = model;
    }

    async get(id: string) {
        const { Model } = this;
        if (!id || !ObjectId.isValid(id)) throw `invalid id: ${id}`
        let m = await Model.findById(id);
        if (m == null) throw `invalid id: ${id}`
        return m;
    }

    async list(query: IQuery) {
        const { Model } = this;
        const total = await Model.find(query.toQuery()).count();
        const list = await Model.find(query.toQuery())
            .sort(query.sortOf())
            .skip(query.skipTo())
            .limit(query.limitIn());
        let result: IDocumentPaged = {
            list: list,
            pagi: query.toPagi(total)
        }
        return result;
    }

    async insert(model: E, id?: string | undefined) {
        const { Model } = this;
        if (id) {
            await Model.create({ _id: id, ...model })
            return;
        }
        await Model.create(model);
    }

    async update(model: E, id: string) {
        const { Model } = this;
        if (!id || !ObjectId.isValid(id)) throw `invalid id ${id}`
        await Model.findOneAndUpdate({ _id: id }, { '$set': model });
    }

    async delete(id: string) {
        const { Model } = this;
        await Model.deleteOne({ _id: id });
    }
}

