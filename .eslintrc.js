const config = require('@vue/cli-service/webpack.config')

module.exports = {
  extends: '@stackcraft/eslint-config/client',
  settings: {
    'import/resolver': {
      webpack: {
        config,
      },
    },
  },
}
