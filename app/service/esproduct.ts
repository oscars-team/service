import { Query } from '../component/query';
import { Service, Context } from '../component/service';
import { IEShopProductEntity, IEShopProductDocument } from '../model/esproduct'
import { IContentEntity } from '../model/content';

export class EShopProductQuery extends Query implements IEShopProductEntity {
    name: string;
    subTitle: string;
    price: number;
    cover: string;
    content: any;
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
    static extend(json: any): EShopProductQuery {
        let q = new EShopProductQuery();
        return Object.assign(q, json);
    }
}

export default class EShopProductService extends Service<IEShopProductDocument, IEShopProductEntity> {
    constructor(ctx: Context) {
        super(ctx, ctx.model.Esproduct)
    }


    async insert(payload: IEShopProductEntity & IContentEntity) {
        const { ctx } = this;
        const { service } = ctx
        const { content, ...product } = payload;
        const c: IContentEntity = (await service.content.insert(content)).toJSON({ virtuals: true });
        return (await super.insert({
            content: c.id,
            ...product
        }));
    }

    async update(payload: IEShopProductEntity & IContentEntity, id: string) {
        const { ctx } = this;
        const { service } = ctx
        const { content, ...product } = payload;
        let ps = await service.esproduct.get(id);
        if (!ps) throw `not exists, id:${id}`;
        ps.depopulate('content');
        await service.content.findAndUpdate({ _id: ps.content }, { ...content });
        return await service.esproduct.findAndUpdate({ _id: id }, {
            ...payload,
            content: ps.content
        }, { new: true });
    }
}