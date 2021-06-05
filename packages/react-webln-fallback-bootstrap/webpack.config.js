const path = require('path');
const webpack = require('webpack');
const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDev ? 'development' : 'production',
  name: 'react-webln-fallback',
  target: 'web',
  entry: path.join(__dirname, 'src/umd.tsx'),
  output: {
    library: 'ReactWebLNFallback',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'umd'),
    filename: `react-webln-fallback${isDev ? '' : '.min'}.js`,
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [{
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            declaration: false,
          },
        },
      }],
    }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
    }),
  ],
};
