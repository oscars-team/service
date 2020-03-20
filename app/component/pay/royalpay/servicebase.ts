import { Service, Context } from "egg";
import { createHash } from "crypto";
import { stringify } from "qs";
import request, { ReqeustOptions } from "../../request";
import utility = require('utility');
const debug = true;
export interface IRoyalPayPathVars {
    orderId?: string
    refundId?: string
}

export interface IRoyalPayResult {
    return_code: string
    result_code: string
}

export interface IRoyalPayErrorResult {
    return_code: string,
    return_msg: string
}

export class RoyalPayServiceBase extends Service {
    constructor(ctx: Context, ) {
        super(ctx);
    }

    getSign(time: number) {
        const { app } = this;
        const config = app.config.pay.royalPay;
        const validString = config.partner + '&' + time + '&' + config.nonce + '&' + config.credential;
        if (debug) this.logger.info('royal pay VALD: ' + validString);
        return utility.sha256(validString);
    }

    async curl<T>(api: string, pathVars: IRoyalPayPathVars, options?: ReqeustOptions): Promise<T> {
        const { app } = this;
        const config = app.config.pay.royalPay;
        const time = Date.now();
        const sign = this.getSign(time);
        return await request(this.formatUrl(api, pathVars), {
            ...options,
            params: {
                ...options?.params,
                time,
                nonce_str: config.nonce,
                sign
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }

    formatUrl(api: string, pathVars: IRoyalPayPathVars, query?: any) {
        const { app } = this;
        const config = app.config.pay.royalPay;
        try {
            const { orderId, refundId } = pathVars;
            if (!api) throw 'invalid royal pay api'
            if (api.includes('{partner_code}')) api = api.replace('{partner_code}', config.partner)
            if (api.includes('{order_id}')) api = api.replace('{order_id}', `${orderId}`)
            if (api.includes('{refund_id}')) api = api.replace('{refund_id}', `${refundId}`)

            if (query) {
                api = `${api}?${stringify(query)}`
            }

            return api;
        } catch (err) {
            throw err;
        }
    }

}