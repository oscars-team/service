// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
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
    content: AutoInstanceType<typeof ExportContent>;
    contentcampaign: AutoInstanceType<typeof ExportContentcampaign>;
    feature: AutoInstanceType<typeof ExportFeature>;
    module: AutoInstanceType<typeof ExportModule>;
    permission: AutoInstanceType<typeof ExportPermission>;
    role: AutoInstanceType<typeof ExportRole>;
    staticfile: AutoInstanceType<typeof ExportStaticfile>;
    test: AutoInstanceType<typeof ExportTest>;
    user: AutoInstanceType<typeof ExportUser>;
    wxplatform: AutoInstanceType<typeof ExportWxplatform>;
    campaign: {
      merchantvoucher: AutoInstanceType<typeof ExportCampaignMerchantvoucher>;
      voucher: AutoInstanceType<typeof ExportCampaignVoucher>;
    }
  }
}
