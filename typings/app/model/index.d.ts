// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportContent from '../../../app/model/content';
import ExportContentcampaign from '../../../app/model/contentcampaign';
import ExportData from '../../../app/model/data';
import ExportModule from '../../../app/model/module';
import ExportPermission from '../../../app/model/permission';
import ExportRole from '../../../app/model/role';
import ExportStaticfile from '../../../app/model/staticfile';
import ExportUser from '../../../app/model/user';
import ExportWxplatform from '../../../app/model/wxplatform';
import ExportCampaignVoucher from '../../../app/model/campaign/voucher';
import ExportCampaignVouchercampaign from '../../../app/model/campaign/vouchercampaign';
import ExportCampaignVouchertemplate from '../../../app/model/campaign/vouchertemplate';

declare module 'egg' {
  interface IModel {
    Content: ReturnType<typeof ExportContent>;
    Contentcampaign: ReturnType<typeof ExportContentcampaign>;
    Data: ReturnType<typeof ExportData>;
    Module: ReturnType<typeof ExportModule>;
    Permission: ReturnType<typeof ExportPermission>;
    Role: ReturnType<typeof ExportRole>;
    Staticfile: ReturnType<typeof ExportStaticfile>;
    User: ReturnType<typeof ExportUser>;
    Wxplatform: ReturnType<typeof ExportWxplatform>;
    Campaign: {
      Voucher: ReturnType<typeof ExportCampaignVoucher>;
      Vouchercampaign: ReturnType<typeof ExportCampaignVouchercampaign>;
      Vouchertemplate: ReturnType<typeof ExportCampaignVouchertemplate>;
    }
  }
}
