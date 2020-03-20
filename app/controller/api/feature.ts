import { Controller } from 'egg'
import { IWechatUserEntity } from '../../model/wxuser';
import { IWechatPlatformEntity } from '../../model/wxplatform';
import { IWechatSubscribeEntity } from '../../model/wxsubscribe';

interface ISignProfile extends IWechatUserEntity {
    openid: string
}

export interface ISignResult {
    redirect?: boolean,
    url?: string,
    openid?: string
    uid?: string
    profile?: ISignProfile
    subscribed?: boolean
}
const debug = false;
export default class FeatureController extends Controller {


    async sign() {
        const { ctx, service, logger } = this;
        const { redis } = service;
        const { params, query } = ctx;
        const { platformid } = params;
        const { sourceUrl, code, state } = query;
        const isFirstQuery = () => !code;
        const printTitle = (title: string) => {
            if (debug) {
                console.log(`=========== ${title} ===========`);
                logger.info(`=========== ${title} ===========`);
            }
        }
        const printObject = (obj: any) => {
            if (debug) {
                console.log(JSON.stringify(obj));
                logger.info(JSON.stringify(obj));
            }
        }
        const printString = (str: string | number) => {
            if (debug) {
                console.log(str);
                logger.info(str);
            }
        }

        try {

            let signResult: ISignResult
            const platform: IWechatPlatformEntity = (await service.wxplatform.get(platformid)).toJSON({ virtuals: true });
            const publicPlatform: IWechatPlatformEntity = platform.type == 1 ? platform : platform.service as IWechatPlatformEntity;
            if (!publicPlatform) throw 'no service wechat platform specified';
            // 第一次获取Sign, 没有Code 与 Statae
            // 目的就是为了获取 Code , 用来获取用户资料
            if (isFirstQuery()) {
                printTitle("第一次获取授权地址");
                let baseUrl = await service.wxplatform.getSnsBaseUrl(publicPlatform, {
                    sourceUrl
                });
                printString(baseUrl);
                signResult = { redirect: true, url: baseUrl } as ISignResult;
                printObject(signResult);
                ctx.success(signResult);
                return;
            }

            // 之后就不是第一次进入了
            // 参数的 Code 必定会有值

            // 如果缓存中已经存在了Profile
            // 直接返回
            signResult = await redis.getObject(code);
            printTitle("读取缓存中的 Sign Result");
            printObject(signResult);
            if (signResult && signResult.profile) {
                printString("缓存中有用户资料Profile, 直接返回 signResult");
                printObject(signResult.profile)
                printTitle(`查询${signResult.profile.nickname}的关注状态`)
                if (await service.wxplatform.isUserSubscribedOn(signResult.profile, platform)) {
                    printString("已关注")
                    signResult.subscribed = true;
                } else
                    printString("未关注")
                ctx.success(signResult);
                return;
            }

            // 用户允许获取详细信息
            if (state === 'info') {
                printTitle("获取用户详细信息");
                let profile = await service.wxplatform.getInfoProfile(publicPlatform, code);
                if (!profile) throw 'wx get info profile error';
                printString("详细信息获取成功");
                printObject(profile);
                printTitle("将用户写入数据库");
                // 更新用户的Profile, 根据unionid
                // 如果没有会自动添加
                let wu = await service.wxuser.findAndUpdate({ unionid: profile.unionid }, profile, { new: true, upsert: true });
                // 这里需要保存两次openid
                // 第一次是从跳板平台获取的openid, unionid与跳板平台id, 此时可以记录这个人使用过跳板平台
                //let uo = await service.wxopenid.Model.findOneAndUpdate({ openid: profile.openid }, { '$set': { wxuser: wu._id, unionid: profile.unionid, platform: publicPlatform.id } });
                let suo = await service.wxopenid.find({ openid: profile.openid });
                if (suo) { Object.assign(suo, { wxuser: wu._id, unionid: profile.unionid, platform: publicPlatform.id }); await suo.save(); }
                else suo = await service.wxopenid.findAndUpdate({ unionid: profile.unionid, platform: publicPlatform.id }, { wxuser: wu._id, unionid: profile.unionid, platform: publicPlatform.id, openid: profile.openid }, { new: true, upsert: true }); // 保存与跳板平台关系, 没有则添加
                printTitle("保存用户与跳板平台之间的关系");
                printObject(publicPlatform);
                printObject(suo);
                // 第二次是仅仅保存unionid与要关注的平台id, 此时还不知道这个用户在关注平台上的openid
                // 但是没关系, 用户关注之后可以在平台服务上根据unionid取得,交由平台服务程序保存
                if (platform.id != publicPlatform.id) {
                    let fuo = await service.wxopenid.findAndUpdate({ unionid: profile.unionid, platform: platform.id }, { wxuser: wu._id, unionid: profile.unionid, platform: platform.id }, { new: true, upsert: true }); //保存与关注平台关系, 没有则添加
                    printTitle("保存用户与关注平台之间的关系");
                    printObject(platform);
                    printObject(fuo);
                }
                signResult = {
                    ...signResult,
                    profile: profile,
                };
                redis.set(code, signResult, 3600);
                printTitle("将用户写入缓存");
                printObject(signResult);
                ctx.success(signResult);
                return;
            }

            // base 情况
            // 当参数中包含了code 
            printTitle("参数中包含code, 获取用户基本信息");
            let wxRes = await service.wxplatform.getBaseProfile(publicPlatform, code);
            if (!wxRes) throw 'wx get base profile error';
            printObject(wxRes);
            signResult = { openid: wxRes.openid };
            printObject(signResult);
            // // 从这里判断用户是否关注是不准确的, 故而去掉
            // // 因为这个openid是跳板公众号的openid, 只能判断用户是否关注了跳板公众平台, 而不是关注平台
            // let subs = await service.wxsubscribe.find({ openid: signResult.openid });
            // printTitle(`查询${wxRes.openid}的关注状态`)
            // if (subs?.subscribe) {
            //     printString("已关注")
            //     signResult.subscribe = true;
            //     let sp = await service.wxopenid.find({ openid: subs.openid });
            //     if (sp) {
            //         signResult.profile = sp.wxuser;
            //         printString("直接返回最终结果!!!!!")
            //         return ctx.success(signResult);
            //     }

            // } else
            //     printString("未关注")
            // // 正确的做法是, 通过openid 查找用户的 详细信息, 通过详细信息中的unionid 与 关注平台的id, 来判断用户是否关注
            printTitle(`搜索 ${signResult.openid}, 看是否在数据库中有记录`);
            let uOpenid = (await service.wxopenid.find({ openid: signResult.openid }))?.toJSON({ virtuals: true });
            printObject(uOpenid);
            // 系统里没有这个人
            // 二话不说先直接加进去
            if (!uOpenid) {
                printTitle("系统里没有这个openid, 立即添加");
                uOpenid = await service.wxopenid.insert({ openid: signResult.openid, platform: publicPlatform.id });
                printObject(uOpenid);
            }
            // 系统里有这个人
            // 但是没有Profile
            // 返回授权请求以及地址
            printTitle("系统里有这个人: " + uOpenid.openid);
            if (!(uOpenid?.wxuser)) {
                printTitle("系统里没有这个人的详细信息");
                const infoUrl = await service.wxplatform.getSnsInfoUrl(publicPlatform, { sourceUrl });
                printString("返回获取详细信息的微信接口, " + infoUrl);
                signResult = { redirect: false, url: infoUrl, openid: signResult.openid };
                redis.set(code, signResult, 3600)
                printObject(signResult);
                ctx.success(signResult);
                return;
            }

            printTitle("系统里有这个人的详细信息");
            // 一旦查找到这个人的详细信息, 检查是否关注
            // 如果关注,直接返回已关注
            // 如果没有关注, 返回用户信息
            const ou: IWechatUserEntity = uOpenid.wxuser;
            let isSubscribe = (await service.wxsubscribe.find({ unionid: ou.unionid, platform: platform.id } as IWechatSubscribeEntity))?.subscribe;
            printString(isSubscribe ? '这个人已经关注, 返回结果' : '这个人没有关注, 写入缓存, 等待前台页面做下一步处理');
            signResult = {
                ...signResult,
                profile: uOpenid.wxuser,
                subscribed: isSubscribe
            };
            redis.set(code, signResult, 3600)
            printObject(signResult);
            ctx.success(signResult);
            return;
        } catch (err) {
            logger.error(err);
            ctx.error(err);
        }
    }
}