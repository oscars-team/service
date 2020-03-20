// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportApiContent from '../../../app/controller/api/content';
import ExportApiContentcampaign from '../../../app/controller/api/contentcampaign';
import ExportApiEsorder from '../../../app/controller/api/esorder';
import ExportApiEsproduct from '../../../app/controller/api/esproduct';
import ExportApiEsproductcampaign from '../../../app/controller/api/esproductcampaign';
import ExportApiFeature from '../../../app/controller/api/feature';
import ExportApiModule from '../../../app/controller/api/module';
import ExportApiPermission from '../../../app/controller/api/permission';
import ExportApiRole from '../../../app/controller/api/role';
import ExportApiSign from '../../../app/controller/api/sign';
import ExportApiUser from '../../../app/controller/api/user';
import ExportApiWechatservice from '../../../app/controller/api/wechatservice';
import ExportApiWxplatform from '../../../app/controller/api/wxplatform';
import ExportApiCampaignMerchantvoucher from '../../../app/controller/api/campaign/merchantvoucher';
import ExportApiCampaignVoucher from '../../../app/controller/api/campaign/voucher';
import ExportApiPayRoyalpay from '../../../app/controller/api/pay/royalpay';
import ExportApiResourceStatic from '../../../app/controller/api/resource/static';
import ExportApiSmsOversea from '../../../app/controller/api/sms/oversea';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    api: {
      content: ExportApiContent;
      contentcampaign: ExportApiContentcampaign;
      esorder: ExportApiEsorder;
      esproduct: ExportApiEsproduct;
      esproductcampaign: ExportApiEsproductcampaign;
      feature: ExportApiFeature;
      module: ExportApiModule;
      permission: ExportApiPermission;
      role: ExportApiRole;
      sign: ExportApiSign;
      user: ExportApiUser;
      wechatservice: ExportApiWechatservice;
      wxplatform: ExportApiWxplatform;
      campaign: {
        merchantvoucher: ExportApiCampaignMerchantvoucher;
        voucher: ExportApiCampaignVoucher;
      }
      pay: {
        royalpay: ExportApiPayRoyalpay;
      }
      resource: {
        static: ExportApiResourceStatic;
      }
      sms: {
        oversea: ExportApiSmsOversea;
      }
    }
  }
}
