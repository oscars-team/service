import { Service } from 'egg';
import { Query } from '../component/query';
import { Types } from 'mongoose';
const { ObjectId } = Types;


export class PermissionQuery extends Query {
    _id: string
    name: string
    moduleId: string
    value: number

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
    public static extend(json: any): PermissionQuery {
        let q = new PermissionQuery();
        return Object.assign(q, json);
    }
}
export default class ModuleService extends Service {

    /**
     * 列出所有的角色
     */
    async index(query: PermissionQuery) {
        return await this.ctx.model.Permission.find(query).sort({ value: 1 });
    }

    /**
     * 添加或者更新角色, 当id不为null时, 添加角色,否则更新角色
     * @param name 角色名称
     * @param permissions 角色权限
     * @param id 角色编号
     */
    async insertOrUpdate(permissionQuery: PermissionQuery) {
        const { name, moduleId } = permissionQuery
        let permission: any;

        // 在没有id的情况下，默认为添加
        permission = new this.ctx.model.Permission({ name, moduleId });
        let rest = await this.index({ moduleId } as PermissionQuery);
        rest.push(permission);
        for (let i in rest) {
            rest[i].value = Math.pow(2, parseInt(i));
            await rest[i].save();
        }
    }

    async delete(id: string) {
        await this.ctx.model.Permission.deleteOne({ _id: ObjectId(id) });
    }

}