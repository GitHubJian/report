const root = process.cwd()
const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base.js')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const StatsWebpackPlugin = require('stats-webpack-plugin')
const AssetsWebpackPlugin = require('assets-webpack-plugin')

const pathConfig = require('./path.config.js')

const prodConfig = {
  entry: {
    isv: path.resolve(root, 'src/js/isv/main.js')
  },
  output: {
    filename: 'js/[name].[hash].js',
    publicPath: '/static/'
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      verbose: false,
      cleanStaleWebpackAssets: true,
      protectWebpackAssets: true,
      cleanOnceBeforeBuildPatterns: ['**/*'],
      cleanAfterEveryBuildPatterns: [],
      dangerouslyAllowCleanPatternsOutsideProject: false
    }),
    new StatsWebpackPlugin('stats.json'),
    new AssetsWebpackPlugin({
      path: pathConfig.static,
      filename: 'assets.json',
      prettyPrint: true,
      processOutput(assets) {
        delete assets['']
        return JSON.stringify(assets, null, 4)
      }
    })
  ],
  optimization: {
    minimizer: [
      new ParallelUglifyPlugin({
        uglifyES: {
          compress: {
            warnings: false,
            drop_console: true
          }
        },
        exclude: ['vendor.js'],
        sourceMap: false
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g, // 正则表达式，用于匹配需要优化或者压缩的资源名
        cssProcessor: require('cssnano'), // CSS处理器压缩和优化
        cssProcessorPluginOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        },
        canPrint: true // 在 console 中打印信息
      })
    ],
    splitChunks: {
      name: 'global',
      minChunks: Infinity
    }
  },
  performance: {
    hints: false
  },
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false
  }
}

module.exports = merge(baseConfig, prodConfig)
