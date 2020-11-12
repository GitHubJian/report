const root = process.cwd()
const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.config.base.js')

const devConfig = {
  entry: {
    areport: [
      'webpack-dev-server/client',
      path.resolve(__dirname, 'lib/index.js')
    ]
  },
  output: {
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  devServer: {
    host: 'local.sa.sogou.com',
    contentBase: root,
    compress: false,
    port: 8424,
    hot: true,
    inline: true,
    allowedHosts: ['*.sogou.com']
  }
}

module.exports = merge(baseConfig, devConfig)
