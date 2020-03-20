import { Service, Context, FileStream } from 'egg';
import { Model, Types } from 'mongoose';
import * as moment from 'moment';
import * as fs from 'fs'
import * as path from 'path'
import * as sendToWormhole from "stream-wormhole";
import { IStaticFileDocument, IStaticFile } from '../model/staticfile';
import { Writable } from "stream";
const { ObjectId } = Types;
moment.locale('zh-cn');

const mkdirsSync = (dirname) => {
    if (fs.existsSync(dirname)) return true;
    if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
    }
}

//#region ============== 异步写入Stream ================
const writeStreamAsync = (stream: Writable) => {
    return new Promise((resolve, reject) => {
        const success = () => {
            clean();
            resolve();
        }
        const fail = () => {
            clean();
            reject();
        }
        const clean = () => {
            stream.removeListener('error', fail)
            stream.removeListener('finish', success)
        }
        stream.once('finish', success)
        stream.once('error', fail)
    });
}
//#endregion


export default class StaticFileService extends Service {

    StaticFile: Model<IStaticFileDocument>
    constructor(ctx: Context) {
        super(ctx);
        this.StaticFile = ctx.model.Staticfile;

    }

    /**
     * 上传文件
     * @param file 文件模型
     * @param stream 数据流
     */
    async upload<T extends IStaticFile>(file: T, stream: FileStream) {

        const { StaticFile } = this;
        const uploadBasePath = 'app/public/upload';
        const dirname = moment().format('YYYY-MM-DD');
        const objId = new ObjectId();
        const filename = `${objId.toString()}${path.extname(stream.filename)}`;
        mkdirsSync(path.join(uploadBasePath, dirname));
        const target = path.join(uploadBasePath, dirname, filename)
        const writeStream = fs.createWriteStream(target);
        try {
            await writeStreamAsync(stream.pipe(writeStream));
            file.path = `${this.config.siteInfo.host}/public/upload/${dirname}/${filename}`
            return await StaticFile.create({
                _id: objId,
                ...file
            });
        } catch (err) {
            await sendToWormhole(stream);
            throw err;
        }
    }

}