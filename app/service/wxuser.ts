import { Query } from '../component/query';
import { Service, Context } from '../component/service';
import { IWechatUserEntity, IWechatUserDocument } from '../model/wxuser'

export class WechatUserQuery extends Query implements IWechatUserEntity {
    nickname: string;
    sex: number;
    language: string;
    city: string;
    province: string;
    country: string;
    headimgurl: string;
    remark: string;
    groupid: string;
    tagid_list;
    unionid: string;
    subscribe_scene: string;
    qr_scene: string;
    qr_scene_str: string;
    privilege;
    title: string;
    order: number;
    create_at: Date;
    update_at: Date;
    state: number;

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
    static extend(json: any): WechatUserQuery {
        let q = new WechatUserQuery();
        return Object.assign(q, json);
    }
}

export default class WechatUserService extends Service<IWechatUserDocument, IWechatUserEntity> {
    constructor(ctx: Context) {
        super(ctx, ctx.model.Wxuser)
    }

}