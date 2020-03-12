import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.siteInfo = {
    domain: 'http://system.artibition.cn'
  };
  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1582033826768_4081';


  config.session = {
    key: 'OSS_M#*CXG(!@)',
    maxAge: 24 * 3600 * 1000,
    httpOnly: true,
    encrypt: true,
    renew: true
  }

  config.security = {
    csrf: {
      enable: false
    }
  }
  // add your egg config in here
  config.middleware = [];
  // 默认头像
  config.defaultAvatar = 'http://wxwu88.com/content/images/admin/avt_default.jpg';
  // jwt config 
  config.jwt = {
    secret: 'kTlzXDgPXjEBlLxD',
  }

  // mongoose config
  config.mongoose = {
    clients: {
      dbMembership: {
        url: 'mongodb://oscars_super:123@artibition.cn:22107/members',
        options: {
          useUnifiedTopology: true,
          auth: {
            user: 'oscars_super',
            password: '123'
          }
        }
      },
      dbOscars: {
        url: 'mongodb://oscars_super:123@artibition.cn:22107/oscars',
        options: {
          useUnifiedTopology: true,
          auth: {
            user: 'oscars_super',
            password: '123'
          }
        }
      }
    }
  }

  config.io = {
    init: {},
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: []
      },
      '/feature': {
        connectionMiddleware: ['auth'],
        packetMiddleware: [],
      },
    },
    redis: {
      // host: {},
      // port: {},
      // auth_pass: {},
      // db: 0
      host: '127.0.0.1',
      port: 6379,
    }
  }

  config.mongooseSchemaOption = {
    id: true,
    _id: false
  }

  config.multipart = {
    fileSize: '10mb',
    mode: 'stream',
    fileExtensions: ['.jpg', '.png'],
  }

  config.static = {
    domain: 'http://api.system.artibition.cn'
  }

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
