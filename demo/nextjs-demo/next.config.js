module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.node = {
        console: false,
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
      };
      return config
    },
  }