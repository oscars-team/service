import { Application, MongooseSingleton } from 'egg';

/**
 * 系统模块模型，用于自定义菜单
 */
export default (app: Application) => {
    const { mongoose } = app;
    const { Schema } = mongoose;
    const { ObjectId } = mongoose.Types;
    const conn = (app.mongooseDB as MongooseSingleton).get('dbMembership');
    const moduleSchema = new Schema({
        authority: { type: Object },
        parent: { type: ObjectId },
        hideChildrenInMenu: { type: Boolean },
        hideInMenu: { type: Boolean },
        icon: { type: String },
        locale: { type: String },
        name: { type: String },
        path: { type: String }
    });

    return conn.model('Module', moduleSchema);
}