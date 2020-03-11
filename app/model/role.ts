import { Application, MongooseSingleton } from 'egg';

/**
 * 系统模块模型，用于自定义菜单
 */
export default (app: Application) => {
    const { mongoose } = app;
    const { Schema } = mongoose;
    // const { ObjectId } = mongoose.Types;
    const conn = (app.mongooseDB as MongooseSingleton).get('dbMembership');
    const roleSchema = new Schema({
        // 角色名称
        name: { type: String },
        // 角色权限
        permissions: { type: [] }   // {moduleId:string, value:7}

    });

    roleSchema.index({ name: 1 }, { unique: true });

    return conn.model('Role', roleSchema);
}
