import { RoyalPayServiceBase, IRoyalPayPathVars, IRoyalPayResult } from "./servicebase";
import { Context } from 'egg';

export interface IRoyalPayOrder {
    id: string
    price: number
    description: string,
    currency: 'AUD' | 'CNY',
    channel: 'Alipay' | 'Wechat',
    notify_url: string,
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

export default class OrderService extends RoyalPayServiceBase {

    constructor(ctx: Context) {
        super(ctx)
    }

    async createOrder(order: IRoyalPayOrder) {
        const { id, ...restProps } = order;
        return this.curl("https://mpay.royalpay.com.au/api/v1.0/jsapi_gateway/partners/{partner_code}/orders/{order_id}", { orderId: id }, {
            data: restProps
        })
    }
}