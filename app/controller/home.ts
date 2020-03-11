import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');
  }

  public async login() {
    const { ctx, app } = this;

    const token = app.jwt.sign({
      username: 'leo',
    }, app.config.jwt.secret);

    ctx.body = token;
  }
}
