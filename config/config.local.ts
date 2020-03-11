import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.session = {
    maxAge: 20 * 1000,
  }


  // mongoose config
  config.mongoose = {
    clients: {
      dbMembership: {
        url: 'mongodb://localhost:27017/member',
        options: { useUnifiedTopology: true }
      },
      dbOscars: {
        url: 'mongodb://localhost:27017/oscars',
        options: { useUnifiedTopology: true }
      }
    }
  }

  config.static = {
    domain: 'http://127.0.0.1:7001'
  }


  return config;
};
