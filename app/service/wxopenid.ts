import { Query } from '../component/query';
import { Service, Context } from '../component/service';
import { IWechatOpenIdEntity, IWechatOpenIdDocument } from '../model/wxopenid'

export class WechatOpenIdQuery extends Query implements IWechatOpenIdEntity {
    openid: string;
    platform: string;
    wxuser?: string | undefined;
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
    static extend(json: any): WechatOpenIdQuery {
        let q = new WechatOpenIdQuery();
        return Object.assign(q, json);
    }
}

export default class WechatOpenIdService extends Service<IWechatOpenIdDocument, IWechatOpenIdEntity> {
    constructor(ctx: Context) {
        super(ctx, ctx.model.Wxopenid)
    }

}