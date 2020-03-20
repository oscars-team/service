import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,

  /**
   * javascriptwebtoken
   */
  jwt: {
    enable: true,
    package: 'egg-jwt'
  },

  cors: {
    enable: true,
    package: 'egg-cors'
  },

  mongoose: {
    enable: true,
    package: 'egg-mongoose'
  },

  io: {
    enable: true,
    package: 'egg-socket.io'
  },

  redis: {
    enable: true,
    package: 'egg-redis'
  },
};

export default plugin;
