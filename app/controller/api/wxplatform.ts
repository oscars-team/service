import { IWechatPlatformDocument, IWechatPlatformEntity } from '../../../app/model/wxplatform'
import ApiController from "../../component/apicontroller";
import { Service, Context } from "../../component/service";

export default class WechatPlatformController extends ApiController<IWechatPlatformDocument, IWechatPlatformEntity, Service<IWechatPlatformDocument, IWechatPlatformEntity>> {

    constructor(ctx: Context) {
        super(ctx, ctx.service.wxplatform)
    }

    async receiveBase() {
        const { ctx } = this;
        const { code, state } = ctx.query;
        console.log(code, state);
        this.ctx.success()
    }

    async receiveInfo() {
        this.ctx.success()
    }

}
