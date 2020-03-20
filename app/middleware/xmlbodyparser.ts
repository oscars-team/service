import { Context } from 'egg'
import { Readable } from 'stream';
import { xml2Json } from '../component/xmlandjson';

const readDataStream = (request: Readable) => {
    return new Promise<any>((resolve, reject) => {
        let buff = ''
        request.setEncoding('utf8');
        request.on('data', chunk => { buff += chunk; });
        request.on('end', () => { xml2Json(buff).then(res => { resolve(res) }).catch(err => { reject(err) }) });
    })
}


export interface IWechatMessage {
    ToUserName?: string[],
    FromUserName?: string[],
    CreateTime?: string[],
    //type: text image voice video file event
    MsgType?: string[],
    Event?: string[],
    EventKey?: string[],
    Title?: string[],
    Content?: string[],
    Description?: string[],
    FileKey?: string[],
    FileMd5?: string[],
    FileTotalLen?: string[],
    PicUrl?: string[],
    Format?: string[],
    MsgId?: string[],
    MediaId?: string[],
    Recognition?: string[],
}



export function XmlBodyParser() {
    return async (ctx: Context, next: any) => {
        const { logger } = ctx;
        logger.info(`${ctx.method}: ${ctx.url}`)
        if (ctx.method === 'POST' && ctx.is('text/xml')) {
            let res: { xml: IWechatMessage } = await readDataStream(ctx.req);
            ctx.request.body = res.xml
        }
        await next();
    }
}