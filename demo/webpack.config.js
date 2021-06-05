const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const publicPath = '/';

const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');
const static = path.join(__dirname, 'static');

const bundles = [
  'index',
  'antd',
  'bootstrap',
  'reactstrap',
  'material-ui',
  'semantic-ui',
];

// Construct some things dynamically based on bundles array
const entry = bundles.reduce((prev, bundle) => {
  prev[bundle] = path.join(src, `${bundle}.tsx`);
  return prev;
}, {})

const plugins = [
  new MiniCssExtractPlugin({
    filename: isDev ? '[name].css' : '[name].[hash:8].css',
  }),
  ...bundles.map(b => (
    new HtmlWebpackPlugin({
      template: path.join(src, `${b}.html`),
      chunks: [b],
      filename: `${b}.html`,
      inject: true,
    })
  )),
  new CopyPlugin({
    patterns: [{
      from: static,
      to: dist,
    }],
  }),
];

// Loaders
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
            corejs: 3,
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
      options: {
        lessOptions: { javascriptEnabled: true },
      },
    },
  ],
};
const fileLoader = {
  test: /\.(png|woff|woff2|eot|ttf|svg)$/,
  use: [{
    loader: 'file-loader',
    options: {
      publicPath,
      name: '[folder]/[name].[ext]',
    },
  }],
};

// Full config
module.exports = {
  mode: isDev ? 'development' : 'production',
  name: 'main',
  target: 'web',
  devtool: isDev ? 'inline-cheap-module-source-map' : 'source-map',
  entry,
  plugins,
  output: {
    path: dist,
    publicPath,
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
  },
  module: {
    rules: [
      typescriptLoader,
      lessLoader,
      cssLoader,
      fileLoader,
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
  },
  devServer: {
    contentBase: dist,
    staticOptions: {
      extensions: ['html'],
    },
    hot: true,
    compress: true,
  },
};
