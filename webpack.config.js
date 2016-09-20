var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: __dirname + "/app/App.js",
  output: {
    path: __dirname + "/build",
    filename: "bundle.js"
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: "json"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules!postcss')
      }
    ]
  },

  postcss: [
    require('autoprefixer')
  ],

  plugins: [
    new webpack.BannerPlugin("Copyright Sunny."),
    new HtmlWebpackPlugin({
      template: __dirname + "/app/index.tmpl.html"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("style.css")
  ],

  devServer: {
    contentBase: "./public",
    colors: true,
    historyApiFallback: true,
    inline: true,
    hot: true
  }
}
