const path = require('path');
const webpack = require('webpack');
const distDirectory = path.resolve(__dirname, './');

module.exports = {
  entry: {
    background: './src/background.ts',
    popup: './src/popup.ts'
  },
  output: {
    filename: '[name].js',
    path: distDirectory
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: "ts-loader"
    }, {
      test: /\.less$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader"
      }, {
        loader: "less-loader"
      }]
    }]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
};
