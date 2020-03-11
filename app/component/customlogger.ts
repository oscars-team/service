import { Context } from 'egg'
import { Logger } from 'egg-logger'
import CustomTransport from './customtransport'

export default function (ctx: Context) {
    const logger = new Logger({});
    logger.set('file', new CustomTransport({
        level: 'INFO',
        file: 'app.log'
    }, ctx));
    return logger;
}