import { Service } from 'egg';
import { Query } from '../component/query';
import { Types } from 'mongoose';
const { ObjectId } = Types;


export class ModuleQuery extends Query {
    _id: string
    authority?: string[] | string;
    parent?: string
    hideChildrenInMenu?: boolean
    hideInMenu?: boolean
    icon?: string
    locale?: string
    name?: string
    path: string

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
    public static extend(json: any): ModuleQuery {
        let q = new ModuleQuery();
        return Object.assign(q, json);
    }
}
export default class ModuleService extends Service {

    /**
     * 列出所有的角色
     */
    async index() {
        return await this.ctx.model.Module.find();
    }

    /**
     * 添加或者更新角色, 当id不为null时, 添加角色,否则更新角色
     * @param name 角色名称
     * @param permissions 角色权限
     * @param id 角色编号
     */
    async insertOrUpdate(moduleQuery: ModuleQuery) {
        const { name, _id } = moduleQuery
        let module: any;

        if (!_id) {
            // 在没有id的情况下，默认为添加
            await this.ctx.model.Module.create({ name });
            return;
        }

        module = await this.ctx.model.Module.findOne({ _id: ObjectId(_id) });
        Object.assign(module, moduleQuery);
        await module.save();
    }

    async delete(id: string) {
        await this.ctx.model.Module.deleteOne({ _id: ObjectId(id) });
    }
}