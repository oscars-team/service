import { RoyalPayServiceBase, IRoyalPayPathVars, IRoyalPayResult } from "../../component/pay/royalpay/servicebase";
import { Context } from 'egg';

export interface IRoyalPayCreateOrder {
    /**
     * 订单编号
     */
    id: string
    /**
     * 订单价格
     */
    price: number
    /**
     * 订单描述
     */
    description: string,
    /**
     * 货币, 默认 AUD
     */
    currency?: 'AUD' | 'CNY',
    /**
     * 支付通道, 默认 Wechat
     */
    channel?: 'Alipay' | 'Wechat',
    /**
     * 通知地址
     */
    notify_url: string,
    /**
     * 操作人
     */
    operator: string
}


export interface IRoyalPayCreateOrderResult extends IRoyalPayResult {
    //商户编码
    partner_code: string
    // 支付渠道
    channel: string
    // 	商户注册全名
    full_name: string
    // 商户名称
    partner_name: string
    //RoyalPay订单ID，同时也是支付渠道订单ID，最终支付成功的订单ID可能不同
    order_id: string
    //商户订单ID
    partner_order_id: string
    //跳转URL
    pay_url: string
}

export interface IRoyalPayRedirectToPay {
    orderId: string
    redirect: string
    directpay: boolean
}

export default class OrderService extends RoyalPayServiceBase {

    constructor(ctx: Context) {
        super(ctx)
    }

    async createOrder(order: IRoyalPayCreateOrder): Promise<IRoyalPayCreateOrderResult> {
        const { id, ...restProps } = order;
        return this.curl<IRoyalPayCreateOrderResult>("https://mpay.royalpay.com.au/api/v1.0/jsapi_gateway/partners/{partner_code}/orders/{order_id}", { orderId: id }, {
            method: 'put',
            data: { currency: 'AUD', channel: 'Wechat', ...restProps }
        })
    }

    getPayUrl(redirectArgs: IRoyalPayRedirectToPay) {
        const { app } = this;
        const { orderId, ...restProps } = redirectArgs;
        const config = app.config.pay.royalPay;
        const time = Date.now();
        const sign = this.getSign(time);
        return `${this.formatUrl('https://mpay.royalpay.com.au/api/v1.0/wechat_jsapi_gateway/partners/{partner_code}_order_{order_id}', { orderId }, {
            ...restProps,
            time,
            nonce_str: config.nonce,
            sign
        })}`
    }
}