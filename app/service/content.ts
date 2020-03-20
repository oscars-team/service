import { Query } from '../component/query';
import { Service, Context } from '../component/service';
import { IContentEntity, IContentDocument } from '../model/content'

export class ContentQuery extends Query implements IContentEntity {
    author: string;
    desc: string;
    content: string;
    thumb: string;
    id?: any;
    title?: string | undefined;
    order?: number | undefined;
    create_at?: Date | undefined;
    update_at?: Date | undefined;
    state?: number | undefined;

    /**
     * 导出查询语句
     */
    // toQuery(): any {
    //     let val: any = {};
    //     // this.state ? Object.assign(val, { state: this.state }) : void (0)
    //     // this.use_at ? Object.assign(val, { use_at: { $gt: this.use_at } }) : void (0)
    //     return val;
    // }

    /**
     * 将客户端脚本转换为对象
     * @param json 客户端传来的参数
     */
    static extend(json: any): ContentQuery {
        let q = new ContentQuery();
        return Object.assign(q, json);
    }
}

export default class ContentService extends Service<IContentDocument, IContentEntity> {
    constructor(ctx: Context) {
        super(ctx, ctx.model.Content)
    }

}

// import { Service, Context } from 'egg';
// import { Query } from '../component/query';
// import { Model, Types } from 'mongoose';
// import { IContentEntity, IContentDocument } from '../model/content'
// const { ObjectId } = Types;

// export class ContentQuery extends Query implements IContentEntity {
//     id: string
//     title: string;
//     author: string;
//     desc: string;
//     content: string;
//     thumb: string;
//     state: number;

//     /**
//      * 导出查询语句
//      */
//     public toQuery(): object {
//         let val: any = {};
//         // this.state ? Object.assign(val, { state: this.state }) : void (0)
//         // this.use_at ? Object.assign(val, { use_at: { $gt: this.use_at } }) : void (0)
//         return val;
//     }

//     /**
//      * 将客户端脚本转换为对象
//      * @param json 客户端传来的参数
//      */
//     public static extend(json: any): ContentQuery {
//         let q = new ContentQuery();
//         return Object.assign(q, json);
//     }
// }
// export default class ContentService extends Service {

//     Content: Model<IContentDocument>

//     constructor(ctx: Context) {
//         super(ctx);
//         this.Content = ctx.model.Content;
//     }

//     async get(keyword: string) {
//         const { Content } = this;
//         if (!keyword || !ObjectId.isValid(keyword)) throw 'get failed, invalid keywords';
//         let model = await Content.findById(keyword);
//         if (model == null) throw 'get failed, invalid keywords';
//         return model;
//     }

//     async list(query: ContentQuery) {
//         const { Content } = this;
//         const total = await Content.find(query.toQuery()).count();
//         const list = await Content
//             .find(query.toQuery())
//             .sort(query.sortOf())
//             .skip(query.skipTo())
//             .limit(query.limitIn())

//         return { list, pagi: query.toPagi(total) };
//     }

//     async insert(query: ContentQuery) {
//         const { Content } = this;
//         let model = new Content();
//         // 剔除 id
//         const { id, ...rest } = query;
//         Object.assign(model, { ...rest });
//         await Content.create(model);
//     }

//     async update(keyword: string, query: ContentQuery) {
//         const { Content } = this;
//         if (!keyword || !ObjectId.isValid(keyword)) throw 'update failed, invalid keywords';
//         let model = await Content.findById(keyword);
//         if (model == null) throw 'update failed, invalid keywords';
//         const { id, ...rest } = query;
//         Object.assign(model, { ...rest });
//         await model.save();
//     }

//     async delete(keyword: string) {
//         const { Content } = this;
//         await Content.deleteOne({ _id: keyword });
//     }
// }