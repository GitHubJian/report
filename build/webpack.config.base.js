const NODE_ENV = process.env.NODE_ENV || 'development'
const isDevelopment = NODE_ENV == 'development'

const root = process.cwd()
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const pathConfig = {
  root: root,
  static: path.resolve(root, 'static'),
  templatePath: path.resolve(__dirname, 'template.html')
}

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  target: 'web',
  output: {
    filename: isDevelopment ? 'js/[name].js' : 'js/[name].[hash].js',
    path: pathConfig.static,
    publicPath: '/'
  },
  resolve: {
    alias: {},
    extensions: ['.js'],
    mainFiles: ['index', 'main']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    // modules: false,
                    targets: {
                      browsers: ['Android >= 4.0', 'ios >= 6']
                    },
                    debug: false,
                    include: [],
                    corejs: 3,
                    useBuiltIns: 'usage'
                  }
                ]
              ],
              plugins: [
                [
                  '@babel/plugin-transform-runtime',
                  {
                    corejs: false,
                    helpers: true,
                    regenerator: true,
                    useESModules: false
                  }
                ],
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-transform-modules-commonjs'
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.buildTime': JSON.stringify(Date.now())
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: isDevelopment ? 'development' : 'production'
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment
        ? 'css/[name].css'
        : 'css/[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: pathConfig.templatePath,
      chunks: ['areport'],
      title: 'A Report',
      inject: 'head',
      minify: true
    })
  ]
}
