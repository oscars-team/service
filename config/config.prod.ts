import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  // mongoose config
  config.mongoose = {
    clients: {
      dbMembership: {
        url: 'mongodb://artibition.cn/member',
        options: { useUnifiedTopology: true }
      },
      dbOscars: {
        url: 'mongodb://artibition.cn/oscars',
        options: { useUnifiedTopology: true }
      }
    }
  }


  // config.static = {
  //   domain: 'http://127.0.0.1:7001'
  // }

  return config;
};
