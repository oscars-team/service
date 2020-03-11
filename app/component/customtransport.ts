import { Context } from 'egg'
import { FileTransport, FileTransportOptions } from 'egg-logger';
import * as moment from 'moment'

class CustomTransport extends FileTransport {
    ctx: Context;
    constructor(options: FileTransportOptions, ctx: Context) {
        super(options)
        this.ctx = ctx;
    }

    buildFormat(level: "ALL" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "NONE") {
        const timeStr = `[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}] ${level}\t`;
        const threadNameStr = ` [${process.pid}]`;
        const urlStr = ` [${this.ctx.request.url}]`
        return `${timeStr}${threadNameStr}${urlStr}`;
    }

    log(level, args, meta) {
        const prefixStr = this.buildFormat(level);
        for (let i in args) {
            if (args.hasOwnProperty(i)) {
                if (parseInt(i, 10) === 0) {
                    args[i] = `${prefixStr}${args[i]}`;
                }
                if (parseInt(i, 10) === args.length - 1) {
                    args[i] += '\n';
                }
            }
        }
        super.log(level, args, meta);
    }

    // setUserId(userId) {
    //     this.userId = userId;
    // }
}

export default CustomTransport;