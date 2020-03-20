import { Query } from '../component/query';
import { Service, Context } from '../component/service';
import { IWechatSubscribeEntity, IWechatSubscribeDocument } from '../model/wxsubscribe'
export class WechatSubscribeQuery extends Query implements IWechatSubscribeEntity {
    openid: string;
    unionid: string;
    platform: string;
    subscribe: boolean;
    subscribe_at: Date;
    unsubscribe_at: Date;
    contact_at: Date;
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
}


export default class WechatSubscribeService extends Service<IWechatSubscribeDocument, IWechatSubscribeEntity> {

    constructor(ctx: Context) {
        super(ctx, ctx.model.Wxsubscribe)
    }

}