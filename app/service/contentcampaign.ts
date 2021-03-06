import { Query } from '../component/query';
import { Service, Context } from '../component/service';
import { IContentCampaignEntity, IContentCampaignDocument } from '../model/ContentCampaign'

export class ContentCampaignQuery extends Query implements IContentCampaignEntity {
    requireAuth: boolean;
    id?: any;
    content: string;
    description: string;
    depth: number;
    platform: string;
    isForce: boolean;
    isPartial: boolean;
    partialPages: number;
    canSkip: boolean;
    chance: number;
    browsers: string[];
    isDefault: boolean;
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
    static extend(json: any): ContentCampaignQuery {
        let q = new ContentCampaignQuery();
        return Object.assign(q, json);
    }
}

export default class ContentCampaignService extends Service<IContentCampaignDocument, IContentCampaignEntity> {
    constructor(ctx: Context) {
        super(ctx, ctx.model.Contentcampaign)
    }

}