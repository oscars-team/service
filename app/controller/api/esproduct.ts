import { IEShopProductDocument, IEShopProductEntity } from '../../../app/model/esproduct'
import ApiController from "../../component/apicontroller";
import { Service, Context } from "../../component/service";

export default class EShopProductController extends ApiController<IEShopProductDocument, IEShopProductEntity, Service<IEShopProductDocument, IEShopProductEntity>> {

    constructor(ctx: Context) {
        super(ctx, ctx.service.esproduct)
    }

}
