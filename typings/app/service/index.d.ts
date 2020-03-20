// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportContent from '../../../app/service/content';
import ExportContentcampaign from '../../../app/service/contentcampaign';
import ExportEsorder from '../../../app/service/esorder';
import ExportEsproduct from '../../../app/service/esproduct';
import ExportEsproductcampaign from '../../../app/service/esproductcampaign';
import ExportFeature from '../../../app/service/feature';
import ExportModule from '../../../app/service/module';
import ExportPermission from '../../../app/service/permission';
import ExportRedis from '../../../app/service/redis';
import ExportRole from '../../../app/service/role';
import ExportStaticfile from '../../../app/service/staticfile';
import ExportTest from '../../../app/service/test';
import ExportToken from '../../../app/service/token';
import ExportUser from '../../../app/service/user';
import ExportWxopenid from '../../../app/service/wxopenid';
import ExportWxplatform from '../../../app/service/wxplatform';
import ExportWxsubscribe from '../../../app/service/wxsubscribe';
import ExportWxuser from '../../../app/service/wxuser';
import ExportCampaignMerchantvoucher from '../../../app/service/campaign/merchantvoucher';
import ExportCampaignVoucher from '../../../app/service/campaign/voucher';
import ExportPayOrder from '../../../app/service/pay/order';
import ExportSmsOversea from '../../../app/service/sms/oversea';

declare module 'egg' {
  interface IService {
    content: AutoInstanceType<typeof ExportContent>;
    contentcampaign: AutoInstanceType<typeof ExportContentcampaign>;
    esorder: AutoInstanceType<typeof ExportEsorder>;
    esproduct: AutoInstanceType<typeof ExportEsproduct>;
    esproductcampaign: AutoInstanceType<typeof ExportEsproductcampaign>;
    feature: AutoInstanceType<typeof ExportFeature>;
    module: AutoInstanceType<typeof ExportModule>;
    permission: AutoInstanceType<typeof ExportPermission>;
    redis: AutoInstanceType<typeof ExportRedis>;
    role: AutoInstanceType<typeof ExportRole>;
    staticfile: AutoInstanceType<typeof ExportStaticfile>;
    test: AutoInstanceType<typeof ExportTest>;
    token: AutoInstanceType<typeof ExportToken>;
    user: AutoInstanceType<typeof ExportUser>;
    wxopenid: AutoInstanceType<typeof ExportWxopenid>;
    wxplatform: AutoInstanceType<typeof ExportWxplatform>;
    wxsubscribe: AutoInstanceType<typeof ExportWxsubscribe>;
    wxuser: AutoInstanceType<typeof ExportWxuser>;
    campaign: {
      merchantvoucher: AutoInstanceType<typeof ExportCampaignMerchantvoucher>;
      voucher: AutoInstanceType<typeof ExportCampaignVoucher>;
    }
    pay: {
      order: AutoInstanceType<typeof ExportPayOrder>;
    }
    sms: {
      oversea: AutoInstanceType<typeof ExportSmsOversea>;
    }
  }
}
