import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, jwt, io } = app;
  const iocontroller: any = io.controller;

  router.get('/', jwt as any, controller.home.index);

  router.post('/login', controller.home.login);

  router.post('/api/signin', controller.api.sign.signin);
  router.get('/api/currentUser', controller.api.sign.currentUser);
  router.get('/api/menus', controller.api.member.menus);
  router.resources('members', '/api/members', controller.api.member);
  router.resources('roles', '/api/roles', controller.api.role);
  router.resources('modules', '/api/modules', controller.api.module);
  router.resources('permissions', '/api/permissions', controller.api.permission);
  router.resources('vouchers', '/api/campaign/vouchers', controller.api.campaign.voucher)
  router.resources('mrchtvouchers', '/api/campaign/mrchtvouchers', controller.api.campaign.merchantvoucher)
  router.resources('contents', '/api/contents', controller.api.content)
  router.resources('contentcampaigns', '/api/contentcampaigns', controller.api.contentcampaign)
  router.resources('staticresources', '/api/static/resources', controller.api.resource.static)

  router.resources('wxplatforms', '/api/wxplatforms', controller.api.wxplatform)


  router.post('/api/feature/sign_:platformid', controller.api.feature.sign)
  // 处理base认证
  router.get('/api/connect/wechat/receive_base_:nsp_:socketid', controller.api.wxplatform.receiveBase)
  // 处理info认证
  router.get('/api/connect/wechat/receive_info_:nsp_:socketid', controller.api.wxplatform.receiveInfo)

  io.of('/feature').route('exchange', iocontroller.nsp.exchange);
};
