import { IEShopOrderDocument, IEShopOrderEntity, EShopOrderStatus } from '../../../app/model/esorder'
import ApiController from "../../component/apicontroller";
import { Service, Context } from "../../component/service";
import { IEShopProductCampaignEntity } from '../../model/esproductcampaign';
import { IWechatUserEntity } from '../../model/wxuser';
import { IEShopProductEntity } from '../../model/esproduct';

interface IPurchasePayloadEntity {
    productCampaign: IEShopProductCampaignEntity
    profile: IWechatUserEntity
    passworrd: string,
    userName: string,
    prefix: string,
    mobile: string,
    vcode: string
    country: string,
    province: string,
    city: string,
    address: string,
    agreement: boolean,
    successUrl: string
}

export default class EShopOrderController extends ApiController<IEShopOrderDocument, IEShopOrderEntity, Service<IEShopOrderDocument, IEShopOrderEntity>> {


    constructor(ctx: Context) {
        super(ctx, ctx.service.esorder)
    }



    /**
     * 创建订单
     * 无需JWT
     */
    async pay() {
        const { ctx, service, app, logger } = this;
        try {
            const { order: orderId } = ctx.params;
            const payload: IPurchasePayloadEntity = ctx.request.body;
            const { productCampaign: campaign, profile: purchase, ...how_to_get } = payload;
            let order: IEShopOrderDocument
            if (!orderId) {
                const mobile = how_to_get.prefix + how_to_get.mobile;
                let validCode = await service.redis.get(`${mobile}-valid-code`);
                logger.info(`[VCODE]get ${mobile}-valid-code: ${validCode}`);
                console.log(validCode, how_to_get.vcode);
                if (validCode != how_to_get.vcode) throw '您的验证码不正确';
                order = await service.esorder.createOrder({
                    title: `${purchase.nickname} 购买 ${(campaign.product as IEShopProductEntity).name}[${purchase.unionid},${campaign.id}]`,
                    campaign,
                    merchant: campaign.merchant as string,
                    price: campaign.price,
                    purchase,
                    how_to_get: {
                        ...how_to_get,
                        name: how_to_get.userName,
                        pass: how_to_get.passworrd,
                        type: campaign.how_to_get === 'deliver' ? 'deliver' : 'self',
                    }
                })
            } else {
                order = await service.esorder.get(orderId);
                if (order.state != EShopOrderStatus.UnPaid) throw '订单已失效, 付款失败'
            }

            let res = await service.pay.order.createOrder({
                id: order.id,
                price: campaign.price,
                operator: purchase.nickname,
                description: `${purchase.nickname} 购买 ${(campaign.product as IEShopProductEntity).name}[${purchase.unionid},${campaign.id}]`,
                notify_url: `${app.config.siteInfo.host}/api/jsapi_gateway/pay/notify/${order.id}`
            });
            if (res.return_code === 'SUCCESS') {
                let redirect = service.pay.order.getPayUrl({
                    directpay: true,
                    redirect: payload.successUrl,
                    orderId: order.id
                });
                console.log(redirect);
                ctx.success({ pay_url: redirect });
                return;
            } else {
                ctx.error(res.result_code);
                return;
            }

        } catch (err) {
            logger.error(err);
            ctx.error(err);
        }

    }

    async notify() {
        const { ctx } = this;
        const { params, query, request } = ctx;
        console.log(`params: ${params}`);
        console.log(`query: ${query}`);
        console.log(`data: ${request.body}`);
        ctx.success();
    }

}
