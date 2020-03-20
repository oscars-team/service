import { Application, MongooseSingleton } from 'egg';
import * as populate from 'mongoose-autopopulate'
import { Document, Schema, IEntity, ObjectId, Mixed } from "../component/schema";
import * as util from 'utility'
export interface IUserEntity extends IEntity {
    name: string
    real_name?: string
    password: string
    salt: string
    email: string
    mobile: string
    avatar: string
    unionid: string
    role: any
    pers: any[]
}

interface IModuleData {
    _id: string,
    permission: number
}

export interface IUserDocument extends IUserEntity, Document {
}

const combinePermissions = (source: IModuleData[], target: IModuleData[]): IModuleData[] => {
    if (source.length === 0) return [];
    let copy: IModuleData[] = [];
    // copy all element from source
    source.forEach((e: IModuleData) => {
        copy.push(e);
    });
    if (target.length === 0) return copy;
    target.forEach((e: IModuleData) => {
        let index = copy.findIndex((s: any) => s._id === e._id);
        if (index >= 0) {
            let se: IModuleData = copy[index];
            se.permission |= e.permission;
        } else {
            copy.push(e);
        }
    });

    return copy;
}
/**
 */
export default (app: Application) => {
    const conn = (app.mongooseDB as MongooseSingleton).get('dbMembership');
    const schema = new Schema({
        name: { type: String, index: true, unique: true },
        real_name: { type: String },
        password: { type: String },
        salt: { type: String, default: util.randomString() },
        email: { type: String, index: true, unique: true },
        mobile: { type: String, index: true, unique: true },
        avatar: { type: String, default: app.config.siteInfo.defaultAvatar },
        // 用户的微信号
        unionid: { type: String },
        // 用户角色
        role: { type: ObjectId, ref: 'Role', autopopulate: true },
        // 用户权限
        pers: { type: [] },
    });

    schema.virtual('permissions').get(function (this: IUserDocument) {
        return combinePermissions(this.role?.permissions || [], this.pers);
    });

    schema.methods.enPassword = function (this: IUserDocument, pass: string) {
        this.password = util.md5(util.md5(pass) + this.salt);
    }

    schema.plugin(populate);
    return conn.model('User', schema);
}
