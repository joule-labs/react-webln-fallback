const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');

const typescriptLoader = {
  test: /\.tsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        plugins: [
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-proposal-class-properties',
        ],
        presets: [
          '@babel/react',
          ['@babel/env', {
            useBuiltIns: 'entry',
            corejs: 2,
          }],
        ],
      },
    },
    {
      loader: 'ts-loader',
      options: { transpileOnly: isDev },
    },
  ],
};
const cssLoader = {
  test: /\.css$/,
  use: [
    isDev && 'style-loader',
    !isDev && MiniCssExtractPlugin.loader,
    'css-loader',
  ].filter(Boolean),
};
const lessLoader = {
  test: /\.less$/,
  use: [
    ...cssLoader.use,
    {
      loader: 'less-loader',
      options: { javascriptEnabled: true },
    },
  ],
};

module.exports = {
  mode: isDev ? 'development' : 'production',
  name: 'main',
  target: 'web',
  devtool: 'cheap-module-inline-source-map',
  entry: {
    index: path.join(src, 'index.tsx'),
    antd: path.join(src, 'antd.tsx'),
  },
  output: {
    path: dist,
    publicPath: isDev ? '/' : '.',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
  },
  module: {
    rules: [
      typescriptLoader,
      lessLoader,
      cssLoader,
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
    modules: [path.join(__dirname, 'node_modules')],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[hash:8].css',
    }),
    new HtmlWebpackPlugin({
      template: `${src}/index.html`,
      chunks: ['index'],
      filename: 'index.html',
      inject: true,
    }),
    new HtmlWebpackPlugin({
      template: `${src}/antd.html`,
      chunks: ['antd'],
      filename: 'antd.html',
      inject: true,
    }),
  ],
};