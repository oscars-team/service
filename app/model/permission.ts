import { Application, MongooseSingleton } from 'egg';

/**
 * 系统模块模型，用于自定义菜单
 */
export default (app: Application) => {
    const { mongoose } = app;
    const { Schema } = mongoose;
    const { ObjectId } = mongoose.Types;
    const conn = (app.mongooseDB as MongooseSingleton).get('dbMembership');
    const permissionSchema = new Schema({
        // 权限名称，表示权限的具体说明
        // 例如：页面显示，添加
        name: { type: String },
        // 模块编号， 表示该项权限属于哪个模块/页面
        moduleId: { type: ObjectId },
        // 权限值，表示该项权限的值，
        // 权限树使用二进制累加计算，这里的值必须为2的整数次幂
        // 例如：1,2,4,8,16...
        value: { type: Number }
    });

    return conn.model('Permission', permissionSchema);
}