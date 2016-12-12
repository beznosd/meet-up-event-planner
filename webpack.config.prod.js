/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  entry: path.join(__dirname, '/src/index.jsx'),
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        include: path.join(__dirname, '/src'),
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css?sourceMap')
      },
      {
        test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
        loader: 'file?name=[path][name].[ext]?[hash]'
      }
    ]
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx'],
    alias: { picker: 'pickadate/lib/picker' }
  },
  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplate: ['*-loader', '*'],
    extensions: ['', '.js']
  },

  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.ProvidePlugin({
      $: 'jquery',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false,
        unsafe: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': { 
        NODE_ENV: JSON.stringify('production') 
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin() // eliminates duplicate packages
  ]
};