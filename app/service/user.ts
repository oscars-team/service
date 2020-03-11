import { Service } from 'egg';
import { Query } from '../component/query';
import { Types } from 'mongoose';
const { ObjectId } = Types;
export class UserQuery extends Query {

    name: string
    email: string
    phone: string
    country: string
    province: string
    city: string
    create_at: Date

    /**
     * 导出查询语句
     */
    public toQuery(): object {
        let val: any = {};
        if (this.name) {
            val['$or'] = [{
                loginname: { $regex: this.name }
            }, {
                displayname: { $regex: this.name }
            }]
        }

        if (this.email) {
            val.email = { $regex: this.email }
        }

        if (this.phone) {
            val.phone = { $regex: this.phone }
        }

        if (this.country) {
            val.country = { $regex: this.country }
        }

        if (this.city) {
            val.city = { $regex: this.city }
        }

        if (this.province) {
            val.province = { $regex: this.province }
        }

        return val;
    }

    /**
     * 将客户端脚本转换为对象
     * @param json 客户端传来的参数
     */
    public static extend(json: any): UserQuery {
        let q = new UserQuery();
        return Object.assign(q, json);
    }
}

/**
 * Test Service
 */
export default class User extends Service {

    /**
     * 
     * @param name - your name
     */
    async createUser({ loginname, displayname, password, email, phone, avatar, country, province, city }: any) {
        const { ctx } = this;
        let user = new ctx.model.User({ loginname, displayname, email, phone, avatar, country, province, city });
        user.enPassword(password);
        return await ctx.model.User.create(user);
    }

    /**
     * 从数据库中获取分页数据，没有经过处理
     * @param param0 
     */
    async getPagedData(query: UserQuery) {
        const { ctx } = this;
        const { current, pageSize } = query;
        const skip = (current - 1) * pageSize;
        const limit = pageSize * 1;
        const total = await ctx.model.User.find(query.toQuery()).count();
        const list = await ctx.model.User.find(query.toQuery()).skip(skip).limit(limit).sort(query.sortOf());
        return { total, list }
    }

    async getAdminList(query) {
        const { total, list } = await this.getPagedData(UserQuery.extend(query));
        const map = list.map(e => {
            return {
                _id: e._id,
                name: e.name,
                avatar_url: e.avatar_url,
                email: e.email,
                phone: e.phone,
                country: e.country,
                province: e.province,
                create_at: this.ctx.helper.format(e.create_at)
            }
        });

        return { total, map };
    }


    async delete(id: string) {
        await this.ctx.model.User.deleteOne({ _id: ObjectId(id) });
    }

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