import { SMSBase } from '../../component/sms';
import { Context } from 'egg';

export default class SMSService extends SMSBase {

    constructor(ctx: Context) {
        super(ctx)
    }

    async purchaseValidCode(mobile: string, code: string) {
        if (!mobile.startsWith('+')) mobile = '+86' + mobile;
        let content = "";
        const isOversea = !mobile.startsWith('+86');
        if (isOversea) {
            content = `【Oscars Tech】You are about to purchase on artibition with verification code ${code} (valid for 30 minutes)`
            return await this.curlw(mobile, content);
        }
        else {
            content = `【澳斯卡科技】您的的验证码是${code}，30分钟内有效。`
            mobile = mobile.substring(3);
            return await this.curl(mobile, content);
        }
    }

}