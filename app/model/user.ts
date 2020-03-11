import { Application, MongooseSingleton } from 'egg';
import * as populate from 'mongoose-autopopulate'
import * as util from 'utility'

interface IModuleData {
    _id: string,
    permission: number
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
 * 用户模型，该模型用户系统 Membership 管理，设计时需要考虑独立性
 */
export default (app: Application) => {
    const { mongoose, config } = app;
    const { Schema } = mongoose;
    const { ObjectId } = mongoose.Types;
    const conn = (app.mongooseDB as MongooseSingleton).get('dbMembership');
    const userSchema = new Schema({
        loginname: { type: String },
        displayname: { type: String },
        password: { type: String },
        salt: { type: String, default: util.randomString() },
        email: { type: String },
        phone: { type: String },
        avatar: { type: String },
        country: { type: String },
        province: { type: String },
        city: { type: String },
        // 用户角色
        role: { type: ObjectId, ref: 'Role', autopopulate: true },
        // 用户权限
        pers: { type: [] },
        create_at: { type: Date, default: Date.now },
        update_at: { type: Date, default: null }
    });
    // 用户显示的名称
    // 显示优先级 displayname > loginname > phone
    userSchema.virtual('name').get(function (this: any) {
        if (this.displayname) return this.displayname;
        if (this.loginname) return this.loginname;
        if (this.phone) return this.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
        return this._id;
    })
    // 用户头像
    // 头像显示优先级 avatar > gravatar(email) > defaultAvatar
    userSchema.virtual('avatar_url').get(function (this: any) {
        // let gravatar = '';
        // if (this.email) gravatar = `https://gravatar.com/avatar/${util.md5(this.email.toLowerCase())}?size=48`;
        let url = this.avatar || config.defaultAvatar;
        // 处理被墙的情况
        url = url.replace('www.gravatar.com', 'gravatar.com');
        if (url.indexOf('https:') === 0)
            url = url.slice(5);
        return url;
    });
    // 用户权限
    // 权限合并逻辑：
    //  - 拥有角色所赋予的权限
    //  - 拥有自己定义的权限
    //  - 自定义的权限将覆盖角色赋予的权限
    userSchema.virtual('permissions').get(function (this: any) {
        return combinePermissions(this.role?.permissions || [], this.pers);
    });
    userSchema.index({ loginname: 1 }, { unique: true });
    userSchema.index({ email: 1 }, { unique: true });
    userSchema.index({ phone: 1 }, { unique: true });

    // 密码加盐加密
    userSchema.methods.enPassword = function (this: any, pass: string) {
        this.password = util.md5(util.md5(pass) + this.salt);
    }

    userSchema.pre('save', function (this: any, next) {
        const now = new Date();
        this.update_at = now;
        next();
    })

    userSchema.plugin(populate);
    return conn.model('User', userSchema);
}