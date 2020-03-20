// {app_root}/app/io/controller/nsp.js
import { Controller } from 'egg'

export default class ClientController extends Controller {

    async sign() {
        const { ctx, service } = this;
        const { socket } = ctx;
        const { redis } = service;
        const message = ctx.args[0];
        const { unionid, platform, socketid } = message;
        if (!unionid || !platform) throw `socket client sign failed, invalid unionid:${unionid} or platform:${platform}`;
        if (socketid != socket.id) throw `socket client sign failed, id not matched: ${socketid} != ${socket.id}`
        redis.set(`${unionid}+${platform}`, socketid, 7200);
        console.log(`${socketid} registerd`);
    }
}