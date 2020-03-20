import { Query } from '../component/query';
import { Service, Context } from '../component/service';
import { IEShopProductCampaignEntity, IEShopProductCampaignDocument } from '../model/esproductcampaign'
import contentcampaign, { IContentCampaignEntity } from '../model/contentcampaign';
import { IWechatPlatformEntity } from '../model/wxplatform';

export interface IPublishForm {
    price: number
    total: number
    start_at: Date,
    expire_at: Date,
    product: string,
    merchant: string,
    contentCampaign: IContentCampaignEntity
}

export interface IEShopProductCampaignExtra {
    contentCampaign: Partial<IContentCampaignEntity>
}

export class EShopProductCampaignQuery extends Query implements IEShopProductCampaignEntity {
    how_to_get: string;
    extra?: any;
    product: any;
    amount: number;
    total: number;
    price: number;
    merchant: any;
    start_at: Date;
    expire_at: Date;
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


export default class EShopProductCampaignService extends Service<IEShopProductCampaignDocument, IEShopProductCampaignEntity> {

    constructor(ctx: Context) {
        super(ctx, ctx.model.Esproductcampaign)
    }

    async insert(payload: IEShopProductCampaignEntity & { contentCampaign: IContentCampaignEntity }) {
        const { ctx } = this;
        const { service } = ctx;
        const { contentCampaign, ...productCampaign } = payload;
        let ccp = await service.contentcampaign.insert(contentCampaign)
        let ccpPlatform: IWechatPlatformEntity
        if (typeof ccp.platform === 'string') {
            ccpPlatform = await service.wxplatform.get(ccp.platform);
        } else {
            ccpPlatform = ccp.platform as IWechatPlatformEntity
        }
        return await super.insert({
            extra: {
                contentCampaign: {
                    id: ccp.id,
                    title: ccp.title,
                    platform: {
                        id: ccpPlatform.id,
                        title: ccpPlatform.title,
                        qrcode: ccpPlatform.qrcode,
                        
                    }
                }
            },
            ...productCampaign
        })
    }

}