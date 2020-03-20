import { Service, Context } from "egg";
import request from "../request";
import utility = require('utility');
const debug = true;
export class SMSBase extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async curl(mobile: string, content: string) {
        const { app, logger } = this;
        const sms = app.config.sms;
        const api = 'http://api.smsbao.com/sms'
        logger.info(`[SMS]ready to send vcode : ${mobile}, ${content}, ${api}`);
        const result = await request(api, {
            method: 'get',
            params: {
                u: sms.username,
                p: utility.md5(sms.password),
                m: mobile,
                c: content
            }
        });
        logger.info(`[SMS]result: ${result}`);
    }

    async curlw(mobile: string, content: string) {
        const { app, logger } = this;
        const sms = app.config.sms;
        const api = 'http://api.smsbao.com/wsms'
        logger.info(`[SMS]ready to send vcode : ${mobile}, ${content}, ${api}`);
        const result = await request(api, {
            method: 'get',
            params: {
                u: sms.username,
                p: utility.md5(sms.password),
                m: mobile,
                c: content
            }
        });
        logger.info(`[SMS]result: ${result}`);
    }
}