const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { spawn } = require('child_process')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: isDev ? ['./build/entry.js', 'webpack-hot-middleware/client'] : './build/entry.js', // If webpack-hot-middleware isn't exist, HMR will not work.
  output: {
    path: path.resolve(__dirname, 'dist'),
    // publicPath: './',
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 0,
            },
          },
        ],
      },
    ],
  },
  ...(isDev && { devtool: 'source-map' }),
  target: 'web',
  plugins: [
    new CleanWebpackPlugin({ default: ['dist'] }),
    new HtmlWebpackPlugin({ template: 'public/index.html' }),
    new MiniCssExtractPlugin({
      finename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.ProvidePlugin({
      // isDev: [path.resolve(__dirname, 'providers/is-dev.js'), 'default'],
      // axios: 'axios'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin(),
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      // '~': path.resolve(__dirname, 'src'),
      // components: path.resolve(__dirname, 'src/components'),
      // helper: path.resolve(__dirname, 'src/helper'),
      // reducers: path.resolve(__dirname, 'src/reducers'),
    },
  },
  optimization: {
    minimize: !isDev,
    minimizer: isDev ? [] : [
      new TerserPlugin({
        terserOptions: {
          compress: {drop_console: true}, // removed comments also.
        }
      })
    ],
  },
}

