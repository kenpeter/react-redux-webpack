// catch more error, good to have
'use strict';

// used in entry, output for physical file
var path = require('path');
// allow webpack.plugin
var webpack = require('webpack');
// you can define a template, then webpack will copy to dist
var HtmlWebpackPlugin = require('html-webpack-plugin');

// module exports es5
module.exports = {
  // good for debug
  devtool: 'eval-source-map',

  // what is saying is that, we load at port 3000, don't reload entire app, react hot reload with patch verison
  // don't forget the source code version
  entry: [
    // webpack server is express server
    // webpack-dev-server/client, I think dev server cannot access webpack.config.js
    // so need to manually pass host and port
    'webpack-dev-server/client?http://localhost:3000',
    // only-dev-server, it doesn't reload the app. Good for react state
    // dev-server, it reload everything.....
    'webpack/hot/only-dev-server',
    // react hot reload, with patch version
    'react-hot-loader/patch',
    // we need to path.join for diff os
    // for path.join, we don't need separator
    // __dirname/app/index.js
    path.join(__dirname, 'app/index.js')
  ],

  // output
  output: {
    // path: __dirname/dist/
    path: path.join(__dirname, '/dist/'),
    // __dirname/dist/client.js
    // __dirname/dist/only-dev-server.js
    // __dirname/dist/patch.js
    // __dirname/app/index.js
    filename: '[name].js',
    // service all js and css
    publicPath: '/'
  },

  plugins: [
    // use html plugin, so we don't need to include script myself
    new HtmlWebpackPlugin({
      // we copy the template
      template: 'app/index.tpl.html',
      // inject into body of app/index.tpl.html
      inject: 'body',
      // ./dist/index.html
      filename: 'index.html'
    }),

    // because we can divide all javascirpts into diff size chunks.
    // too many chunks causes too many https request.
    // too little will result large file
    //
    // most often used chunks, get smaller ids, allow webpack to laod easily
    new webpack.optimize.OccurenceOrderPlugin(),
    // if we change npm module, then hot reload
    new webpack.HotModuleReplacementPlugin(),
    // SkipEmittingAssetsOnErrorsPlugin,
    // confused name
    new webpack.NoErrorsPlugin(),
    // we can pass var from webpack to js
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],

  module: {
    // module is with loader
    loaders: [
      // we load js with babel loader
      {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel'
      },
      // we load json with json loader
      {
          test: /\.json?$/,
          loader: 'json'
      },
      // scss
      // sass, css, style
      // css-loader?modules&localIdentName=[name]-[local] => .ComponentName-className
      // modules is for local or global css class
      // localIdentName is for class and hash
      {
          test: /\.scss$/,
          loader: 'style!css!sass?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      },
      // font
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      // file
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    }
};
