
import { Query } from '../component/query';
import { Service, Context } from '../component/service';
import { IUserEntity, IUserDocument } from '../model/user'

export class UserQuery extends Query implements IUserEntity {
    name: string;
    real_name?: string | undefined;
    password: string;
    salt: string;
    email: string;
    mobile: string;
    avatar: string;
    unionid: string;
    role: any;
    pers: any[];
    id?: any;
    title?: string | undefined;
    order?: number | undefined;
    extra?: any;
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
    static extend(json: any): UserQuery {
        let q = new UserQuery();
        return Object.assign(q, json);
    }
}

export default class UserService extends Service<IUserDocument, IUserEntity> {
    constructor(ctx: Context) {
        super(ctx, ctx.model.User)
    }

    /**
     * 获取用户的菜单
     * @param id 用户ID
     */
    async getMenus(id: string) {
        let user = await this.ctx.model.User.findById(id);
        let userModules = user.permissions.map(m => m.moduleId);
        let models = await this.ctx.model.Module.find();//{ _id: { $in: userModules } }
        let modules = models.map(p => {
            if (!userModules.includes(p._id.toString())) return;
            let m = {
                id: p._id.toString(),
                path: p.path,
                name: p.locale,
                icon: p.icon,
            };
            if (p.parent) m['parent'] = p.parent.toString();
            return m;
        });
        return this.ctx.helper.treeSet(modules.filter(p => p != undefined), 'id', 'parent');
    }

}

export interface MenuData {
    id: string,
    path: string
    name: string
    icon: string
    children: MenuData[]
}



