import { IUserDocument, IUserEntity } from '../../../app/model/user'
import ApiController from "../../component/apicontroller";
import { Service, Context } from "../../component/service";

export default class UserController extends ApiController<IUserDocument, IUserEntity, Service<IUserDocument, IUserEntity>> {

    constructor(ctx: Context) {
        super(ctx, ctx.service.user)
    }


    async menus() {
        const { query } = this.ctx;
        let pers = await this.service.user.getMenus(query.id);
        this.ctx.success(pers);
    }

}



