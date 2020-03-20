import { Controller, Context } from 'egg';
import utility = require('utility');
export default class SMSController extends Controller {

    constructor(ctx: Context) {
        super(ctx)
    }

    async vcode() {
        const { ctx, service, logger } = this;
        try {
            const { m } = ctx.query

            if (!m) throw '无效的手机号码';
            const vcode = utility.randomString(6, '1234567890')
            logger.info(`[VCODE]set ${m}-valid-code: ${vcode}`);
            service.redis.set(`${m}-valid-code`, vcode, 1800);
            const res = service.sms.oversea.purchaseValidCode(m, vcode);
            return await ctx.success(res);
        } catch (err) {
            ctx.error(err);
        }
    }

}