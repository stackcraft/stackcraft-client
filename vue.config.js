const dotenv = require('dotenv')
const pick = require('lodash/pick')

dotenv.config()

module.exports = {
  runtimeCompiler: true,
  chainWebpack: config => {
    config.module
      .rule('graphql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()
  },
  css: {
    loaderOptions: {
      css: {
        localIdentName: '[local]--[hash:base64:6]',
        camelCase: false,
      },
    },
  },
  pluginOptions: {
    env: pick(process.env, ['SERVER_HOST', 'SERVER_PORT', 'I18N_LOCALE']),
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
    moment: {
      locales: ['en', 'ru'],
    },
  },
}
