// {app_root}/app/io/controller/nsp.js
const Controller = require('egg').Controller;

export default class NspController extends Controller {
  async exchange() {
    const { ctx, app } = this;
    const nsp = app.io.of('/feature');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;
    try {
      const { target, payload } = message;
      if (!target) return;
      const msg = ctx.helper.parseMsg('exchange', payload, { client, target });
      console.log(target, msg);
      nsp.emit(target, msg);
    } catch (error) {
      app.logger.error(error);
    }
  }
}

