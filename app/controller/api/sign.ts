import { Controller } from 'egg';
import * as util from 'utility';
interface SignQuery {
    loginname: string,
    password: string,
    autologin: boolean
}
/**
 * 登录接口
 */
export default class SignController extends Controller {
    /**
     * 登录
     */

    async signin() {
        const { loginname, autologin = true, password }: SignQuery = this.ctx.request.body;
        console.log(loginname, autologin, password);
        const user = await this.ctx.model.User.findOne({ loginname });
        if (!user) {
            this.ctx.error('账号或者密码错误');
            return;
        }
        if (util.md5(util.md5(password) + user.salt) === user.password) {
            this.ctx.success({ status: 'ok', type: 'account', currentAuthority: 'admin' });

            return;
        }
        this.ctx.error('账号或者密码错误');

    }

    /**
     * 登出
     */
    async signout() {

    }

    async currentUser() {
        this.ctx.success({
            name: 'Serati Ma',
            avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            userid: '00000001',
            email: 'antdesign@alipay.com',
            signature: '海纳百川，有容乃大',
            title: '交互专家',
            group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
            tags: [
                {
                    key: '0',
                    label: '很有想法的',
                },
                {
                    key: '1',
                    label: '专注设计',
                },
                {
                    key: '2',
                    label: '辣~',
                },
                {
                    key: '3',
                    label: '大长腿',
                },
                {
                    key: '4',
                    label: '川妹子',
                },
                {
                    key: '5',
                    label: '海纳百川',
                },
            ],
            notifyCount: 12,
            unreadCount: 11,
            country: 'China',
            geographic: {
                province: {
                    label: '浙江省',
                    key: '330000',
                },
                city: {
                    label: '杭州市',
                    key: '330100',
                },
            },
            address: '西湖区工专路 77 号',
            phone: '0752-268888888',
        });
    }
}
