var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: __dirname + "/app/App.js",
  output: {
    path: __dirname + "/build",
    filename: "bundle.js"
  },

  module: {
    loaders: [
      {
        test: /\json$/, loader: "json"
      },
      {
        test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel'
      },
      {
        test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?modules!postcss')
      }
    ]
  },

  postcss: [
    require('autoprefixer')
  ],

  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/app/index.tmpl.html"
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin("style.css")
  ]
}
