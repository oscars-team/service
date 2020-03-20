// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportContent from '../../../app/model/content';
import ExportContentcampaign from '../../../app/model/contentcampaign';
import ExportData from '../../../app/model/data';
import ExportEsorder from '../../../app/model/esorder';
import ExportEsproduct from '../../../app/model/esproduct';
import ExportEsproductcampaign from '../../../app/model/esproductcampaign';
import ExportModule from '../../../app/model/module';
import ExportPermission from '../../../app/model/permission';
import ExportRole from '../../../app/model/role';
import ExportStaticfile from '../../../app/model/staticfile';
import ExportUser from '../../../app/model/user';
import ExportWxopenid from '../../../app/model/wxopenid';
import ExportWxplatform from '../../../app/model/wxplatform';
import ExportWxsubscribe from '../../../app/model/wxsubscribe';
import ExportWxuser from '../../../app/model/wxuser';
import ExportCampaignVoucher from '../../../app/model/campaign/voucher';
import ExportCampaignVouchercampaign from '../../../app/model/campaign/vouchercampaign';
import ExportCampaignVouchertemplate from '../../../app/model/campaign/vouchertemplate';

declare module 'egg' {
  interface IModel {
    Content: ReturnType<typeof ExportContent>;
    Contentcampaign: ReturnType<typeof ExportContentcampaign>;
    Data: ReturnType<typeof ExportData>;
    Esorder: ReturnType<typeof ExportEsorder>;
    Esproduct: ReturnType<typeof ExportEsproduct>;
    Esproductcampaign: ReturnType<typeof ExportEsproductcampaign>;
    Module: ReturnType<typeof ExportModule>;
    Permission: ReturnType<typeof ExportPermission>;
    Role: ReturnType<typeof ExportRole>;
    Staticfile: ReturnType<typeof ExportStaticfile>;
    User: ReturnType<typeof ExportUser>;
    Wxopenid: ReturnType<typeof ExportWxopenid>;
    Wxplatform: ReturnType<typeof ExportWxplatform>;
    Wxsubscribe: ReturnType<typeof ExportWxsubscribe>;
    Wxuser: ReturnType<typeof ExportWxuser>;
    Campaign: {
      Voucher: ReturnType<typeof ExportCampaignVoucher>;
      Vouchercampaign: ReturnType<typeof ExportCampaignVouchercampaign>;
      Vouchertemplate: ReturnType<typeof ExportCampaignVouchertemplate>;
    }
  }
}
