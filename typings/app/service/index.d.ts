// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportContent from '../../../app/service/content';
import ExportContentcampaign from '../../../app/service/contentcampaign';
import ExportFeature from '../../../app/service/feature';
import ExportModule from '../../../app/service/module';
import ExportPermission from '../../../app/service/permission';
import ExportRole from '../../../app/service/role';
import ExportStaticfile from '../../../app/service/staticfile';
import ExportTest from '../../../app/service/test';
import ExportUser from '../../../app/service/user';
import ExportWxplatform from '../../../app/service/wxplatform';
import ExportCampaignMerchantvoucher from '../../../app/service/campaign/merchantvoucher';
import ExportCampaignVoucher from '../../../app/service/campaign/voucher';

declare module 'egg' {
  interface IService {
    content: ExportContent;
    contentcampaign: ExportContentcampaign;
    feature: ExportFeature;
    module: ExportModule;
    permission: ExportPermission;
    role: ExportRole;
    staticfile: ExportStaticfile;
    test: ExportTest;
    user: ExportUser;
    wxplatform: ExportWxplatform;
    campaign: {
      merchantvoucher: ExportCampaignMerchantvoucher;
      voucher: ExportCampaignVoucher;
    }
  }
}
