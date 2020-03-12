import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.render('App.jsx', {
      context: {
        user: ctx.sess
      }
    })
  }
}
