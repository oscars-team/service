import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },

  /**
   * javascriptwebtoken
   */
  jwt: {
    enable: true,
    package: 'egg-jwt'
  },

  mongoose: {
    enable: true,
    package: 'egg-mongoose'
  },

  io: {
    enable: true,
    package: 'egg-socket.io'
  }

};

export default plugin;
