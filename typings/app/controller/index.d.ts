// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportApiContent from '../../../app/controller/api/content';
import ExportApiContentcampaign from '../../../app/controller/api/contentcampaign';
import ExportApiFeature from '../../../app/controller/api/feature';
import ExportApiMember from '../../../app/controller/api/member';
import ExportApiModule from '../../../app/controller/api/module';
import ExportApiPermission from '../../../app/controller/api/permission';
import ExportApiRole from '../../../app/controller/api/role';
import ExportApiSign from '../../../app/controller/api/sign';
import ExportApiWxplatform from '../../../app/controller/api/wxplatform';
import ExportApiCampaignMerchantvoucher from '../../../app/controller/api/campaign/merchantvoucher';
import ExportApiCampaignVoucher from '../../../app/controller/api/campaign/voucher';
import ExportApiResourceStatic from '../../../app/controller/api/resource/static';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    api: {
      content: ExportApiContent;
      contentcampaign: ExportApiContentcampaign;
      feature: ExportApiFeature;
      member: ExportApiMember;
      module: ExportApiModule;
      permission: ExportApiPermission;
      role: ExportApiRole;
      sign: ExportApiSign;
      wxplatform: ExportApiWxplatform;
      campaign: {
        merchantvoucher: ExportApiCampaignMerchantvoucher;
        voucher: ExportApiCampaignVoucher;
      }
      resource: {
        static: ExportApiResourceStatic;
      }
    }
  }
}
