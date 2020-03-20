import { Service as EService, Context as EContext } from 'egg';
import { IPaging, IQuery } from './query';
import { Document, IEntity, ObjectId } from './schema';
import { Model } from 'mongoose'

export interface IDocumentPaged {
    list: any[],
    pagi: IPaging
}

export interface QueryFindOneAndUpdateOptions {
    /** if true, return the modified document rather than the original. defaults to false (changed in 4.0) */
    new?: boolean;
    /** creates the object if it doesn't exist. defaults to false. */
    upsert?: boolean;
    /** if true, runs update validators on this command. Update validators validate the update operation against the model's schema. */
    runValidators?: boolean;
    /**
     * if this and upsert are true, mongoose will apply the defaults specified in the model's schema if a new document
     * is created. This option only works on MongoDB >= 2.4 because it relies on MongoDB's $setOnInsert operator.
     */
    setDefaultsOnInsert?: boolean;
    /**
     * if set to 'query' and runValidators is on, this will refer to the query in custom validator
     * functions that update validation runs. Does nothing if runValidators is false.
     */
    context?: string;
    /**
     *  by default, mongoose only returns the first error that occurred in casting the query.
     *  Turn on this option to aggregate all the cast errors.
     */
    multipleCastError?: boolean;
    /** Field selection. Equivalent to .select(fields).findOneAndUpdate() */
    fields?: any | string;
    /** If true, delete any properties whose value is undefined when casting an update. In other words,
    if this is set, Mongoose will delete baz from the update in Model.updateOne({}, { foo: 'bar', baz: undefined })
    before sending the update to the server.**/
    omitUndefined?: boolean;
}

interface IService<D extends Document, E extends IEntity> {
    Model: Model<D>
    get: (id: string) => Promise<any>
    list: (query: IQuery) => Promise<IDocumentPaged>
    insert: (model: E, id?: string) => Promise<D>
    update: (model: E, id: string) => Promise<D>
    findAndUpdate: (condition: Partial<E> | any, model: E, options: any) => Promise<D>
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
        let m = await Model.findById(id.toString());
        if (m == null) throw `invalid id: ${id}`
        return m;
    }

    async find(query: Partial<E> | IQuery | any) {
        const { Model } = this;
        return await Model.findOne(query);
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
            return await Model.create({ _id: id, ...model })
        }
        return await Model.create(model);
    }

    async update(model: E, id: string) {
        const { Model } = this;
        if (!id || !ObjectId.isValid(id)) throw `update failed: invalid id: ${id}`
        return (await Model.findByIdAndUpdate(id, model)) as D;
    }

    async findAndUpdate(condition: Partial<E> | any, model: E, option?: QueryFindOneAndUpdateOptions) {
        const { Model } = this;
        return await Model.findOneAndUpdate(condition, { '$set': model }, option || { new: true }) as D
    }

    async delete(id: string) {
        const { Model } = this;
        await Model.findByIdAndDelete(id);
    }
}

