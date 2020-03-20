import { Controller } from 'egg';
import * as util from 'utility';
import ApiController from '../../component/apicontroller';
import { Service } from '../../component/service';
import { IUserEntity, IUserDocument } from '../../model/user';
import { IQuery } from '../../component/query';
interface SignQuery {
    name: string,
    password: string,
    autologin: boolean
}

export interface ISignInUser {
    name: string
    avatar: string
    userid: string
    email: string
    signature: string
    title: string
    group: string
    tags: []
    notifyCount: number
    unreadCount: number
    country: string
    geographic: any
    address: string
    phone: string
}
/**
 * 登录接口
 */
export default class SignController extends ApiController<any, any, Service<any, any>> {


    private map2SignInUser(u: IUserDocument) {
        return {
            name: u.name,
            avatar: u.avatar,
            userid: u.id,
            email: u.email,
            signature: '',
            address: '',
            geographic: {},
            group: '',
            notifyCount: 0,
            phone: u.mobile,
            tags: [],
            title: u.title,
            unreadCount: 0
        } as ISignInUser
    }
    /**
     * 登录
     */
    async signin() {
        const { ctx, service } = this;
        const payload: SignQuery = ctx.request.body || {};
        const user = await service.user.find({ name: payload.name })
        if (!user) { ctx.error('账号或者密码错误'); return; }
        if (util.md5(util.md5(payload.password) + user.salt) === user.password) {
            const signInUser = this.map2SignInUser(user);
            this.ctx.success({
                authority: 'admin',
                token: await this.service.token.apply(signInUser)
            });
            return;
        }
        ctx.error('账号或者密码错误');

    }

    /**
     * 登出
     */
    async signout() {

    }

    async currentUser() {

        const { ctx } = this;

        if (!ctx.state.user) {
            ctx.status = 401
            ctx.error('authority failed.');
            return;
        }

        ctx.success(ctx.state.user);
    }

    async index() {
        return this.ctx.error('invalid api');
    }

    async show() {
        return this.ctx.error('invalid api');
    }

    async edit() {
        return this.ctx.error('invalid api');
    }

    async create() {
        return this.ctx.error('invalid api');
    }

    async update() {
        return this.ctx.error('invalid api');
    }

    async destroy() {
        return this.ctx.error('invalid api');
    }
}
