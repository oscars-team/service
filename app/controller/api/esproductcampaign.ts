import { IEShopProductCampaignDocument, IEShopProductCampaignEntity } from '../../../app/model/esproductcampaign'
import ApiController from "../../component/apicontroller";
import { Service, Context } from "../../component/service";
import { IEShopProductEntity } from '../../model/esproduct';
import { IContentCampaignEntity } from '../../model/contentcampaign';
import { IWechatPlatformEntity } from '../../model/wxplatform';

export default class EShopProductCampaignController extends ApiController<IEShopProductCampaignDocument, IEShopProductCampaignEntity, Service<IEShopProductCampaignDocument, IEShopProductCampaignEntity>> {

    constructor(ctx: Context) {
        super(ctx, ctx.service.esproductcampaign)
    }

    async clientGet() {
        const { ctx } = this;
        const { service, params, query } = ctx;
        //#region ==== 根据 query options 执行不同的操作
        const { platformOnly } = query
        const campaign = await service.esproductcampaign.get(params.id);
        if (platformOnly) {
            // 表示只筛选微信平台
            const platform = campaign.extra.contentCampaign?.platform as IWechatPlatformEntity;
            ctx.success(platform.id);
            return;
        }
        //#endregion
        ctx.success(campaign.toJSON({ virtuals: true }));
    }

    async

}
