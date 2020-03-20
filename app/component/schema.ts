import {
    Schema as MSchema,
    SchemaDefinition, SchemaOptions,
    Document as MDocument,
    Types
} from "mongoose";

import * as moment from 'moment'

export interface IEntity {
    id?: any
    title?: string
    order?: number
    extra?: any
    create_at?: Date
    update_at?: Date
    state?: number
}


export const ObjectId = Types.ObjectId;
export const Mixed = MSchema.Types.Mixed
export interface Document extends IEntity, MDocument {

}

interface DocumentToObjectOptions {
    /** apply all getters (path and virtual getters) */
    getters?: boolean;
    /** apply virtual getters (can override getters option) */
    virtuals?: boolean;
    /** remove empty objects (defaults to true) */
    minimize?: boolean;
    /**
     * A transform function to apply to the resulting document before returning
     * @param doc The mongoose document which is being converted
     * @param ret The plain object representation which has been converted
     * @param options The options in use (either schema options or the options passed inline)
     */
    transform?: (doc: any, ret: any, options: any) => any;
    /** depopulate any populated paths, replacing them with their original refs (defaults to false) */
    depopulate?: boolean;
    /** whether to include the version key (defaults to true) */
    versionKey?: boolean;
    /** whether to convert Maps to POJOs. (defaults to false) */
    flattenMaps?: boolean;
}

export class Schema extends MSchema {

    constructor(definition?: SchemaDefinition | undefined, options?: SchemaOptions | undefined) {
        super(definition, {
            ...options,
            id: true,
            versionKey: false,
            timestamps: {
                createdAt: 'create_at',
                updatedAt: 'update_at'
            }
        });


        this.add({
            // 标题
            title: { type: String, trim: true },
            // 排序
            order: { type: Number },
            // 额外信息
            extra: { type: Mixed },
            // 状态
            // - 1: 有效的 0: 无效的 -1: 已存档(删除表示)
            state: { type: Number, defualt: 1 }
        })

        this.virtual('updateAt')
            .get(function (this: Document) {
                return this.update_at ? moment(this.update_at).valueOf() : this.update_at
            })

        this.virtual('createAt')
            .get(function (this: Document) {
                return this.create_at ? moment(this.update_at).valueOf() : this.create_at
            })
    }

}