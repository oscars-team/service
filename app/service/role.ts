import { Service } from 'egg';
import { Query } from '../component/query';
import { Types } from 'mongoose';
const { ObjectId } = Types;


export class RoleQuery extends Query {
    _id: string
    // 角色名称
    name: string
    // 角色权限
    permissions: []

    /**
     * 导出查询语句
     */
    public toQuery(): object {
        let val: any = {};
        return val;
    }

    /**
     * 将客户端脚本转换为对象
     * @param json 客户端传来的参数
     */
    public static extend(json: any): RoleQuery {
        let q = new RoleQuery();
        return Object.assign(q, json);
    }
}
export default class Role extends Service {

    /**
     * 列出所有的角色
     */
    async index() {
        return await this.ctx.model.Role.find();
    }

    /**
     * 添加或者更新角色, 当id不为null时, 添加角色,否则更新角色
     * @param name 角色名称
     * @param permissions 角色权限
     * @param id 角色编号
     */
    async insertOrUpdate({ name, permissions, _id }: RoleQuery) {

        let role: any;

        if (!_id) {
            // 在没有id的情况下，默认为添加
            await this.ctx.model.Role.create({ name, permissions });
            return;
        }

        role = await this.ctx.model.Role.findOne({ _id: ObjectId(_id) });
        Object.assign(role, { name, permissions });
        await role.save();
    }


}