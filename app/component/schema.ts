import {
    Schema as MSchema,
    SchemaDefinition, SchemaOptions,
    Document as MDocument,
    Types
} from "mongoose";

import * as moment from 'moment'

export interface IEntity {
    title: string,
    order: number,
    create_at: Date,
    update_at: Date,
    state: number
}


export const ObjectId = Types.ObjectId;

export interface Document extends IEntity, MDocument {

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
            // // 创建日期
            // create_at: { type: Date, default: new Date() },
            // // 更新日期
            // update_at: { type: Date },
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