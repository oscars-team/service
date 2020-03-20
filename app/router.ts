import { Application } from 'egg';

import { XmlBodyParser } from "./middleware/xmlbodyparser";

export default (app: Application) => {
  const { controller, router, jwt, io } = app;
  // const { controller, router, io } = app;
  const iocontroller: any = io.controller;

  app.get('/MP_verify_1Vkw76MOIcwKdGuL.txt', (ctx) => {
    ctx.body = '1Vkw76MOIcwKdGuL'
  });

  app.get('/MP_verify_SaE8cnn2viPC5Owg.txt', (ctx) => {
    ctx.body = 'SaE8cnn2viPC5Owg'
  })

  // News 天天订阅号
  app.get('/MP_verify_E0aEekA5hcHTKNk9.txt', (ctx) => {
    ctx.body = 'E0aEekA5hcHTKNk9'
  })
  // 我屋88 订阅号
  app.get('/MP_verify_OG6HGA3r0bpxb0ut.txt', (ctx) => {
    ctx.body = 'OG6HGA3r0bpxb0ut'
  })


  router.get('/', controller.home.index);
  // router.post('/login', controller.home.login);


  router.post('/api/sign/in', controller.api.sign.signin); //登录
  router.get('/api/sign/current', jwt, controller.api.sign.currentUser); //当前
  router.get('/api/sign/out', jwt, controller.api.sign.signout); //登出

  router.get('/api/menus', jwt, controller.api.user.menus);
  router.resources('members', '/api/members', jwt, controller.api.user);
  router.resources('roles', '/api/roles', jwt, controller.api.role);
  router.resources('modules', '/api/modules', jwt, controller.api.module);
  router.resources('permissions', '/api/permissions', jwt, controller.api.permission);
  router.resources('vouchers', '/api/campaign/vouchers', jwt, controller.api.campaign.voucher)
  router.resources('mrchtvouchers', '/api/campaign/mrchtvouchers', jwt, controller.api.campaign.merchantvoucher)
  router.resources('contents', '/api/contents', jwt, controller.api.content)
  router.resources('contentcampaigns', '/api/contentcampaigns', controller.api.contentcampaign)
  router.resources('staticresources', '/api/static/resources', controller.api.resource.static)

  router.resources('wxplatforms', '/api/wxplatforms', jwt, controller.api.wxplatform)


  router.get('/api/feature/sign_:platformid', controller.api.feature.sign)

  router.get('/api/wechatservice', controller.api.wechatservice.signature)
  router.post('/api/wechatservice', XmlBodyParser(), controller.api.wechatservice.index)

  //#region ======= 电商模块 =========
  router.resources('eshop-product', '/api/shop/products', jwt, controller.api.esproduct);
  router.resources('eshop-productcampaign', '/api/shop/productcampaigns', jwt, controller.api.esproductcampaign);
  // 前台产品获取
  router.get('eshop-productcampaign', '/api/app/shop/productcampaigns/:id', controller.api.esproductcampaign.clientGet);

  //#endregion
  router.get('sms', '/api/app/sms/vcode', controller.api.sms.oversea.vcode)


  io.of('/feature').route('exchange', iocontroller.nsp.exchange);
  io.of('/feature').route('clientsign', iocontroller.client.sign)



  router.post('pay', '/api/jsapi_gateway/pay/:order?', controller.api.esorder.pay)
  router.post('pay', '/api/jsapi_gateway/pay/notify/:order', controller.api.esorder.notify)

};
