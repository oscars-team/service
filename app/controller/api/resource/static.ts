import { Controller, Context, FileStream } from 'egg';
import StaticFileService from "../../../service/staticfile";
import { IStaticFile } from '../../../model/staticfile';


export class StaticFile implements IStaticFile {
    uid: string; name: string;
    type: string; size: number;
    path: string;
}


export default class StaticResourceController extends Controller {
    svc: StaticFileService
    constructor(ctx: Context) {
        super(ctx);
        this.svc = ctx.service.staticfile
    }

    async create() {
        const { svc } = this;
        try {
            let stream: FileStream = await this.ctx.getFileStream();
            let size = parseInt(this.ctx.headers["content-length"]);
            let file: StaticFile = {
                name: stream.filename,
                uid: stream.fields?.uid,
                type: stream.mimeType,
                size,
                path: ''
            }
            let archived = await svc.upload(file, stream);
            this.ctx.success({
                url: archived.path
            })
        } catch (err) {
            this.ctx.error(err);
        }
    }
}