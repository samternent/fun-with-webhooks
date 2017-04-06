var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname + '/src',
  entry: {
    javascript: "./app.js"
  },
  devServer: {
    port: 7001
  },
  output: {
    filename: "app.js",
    path: __dirname + "/app/src/",
    publicPath: '/'
  },
  resolve: {
      extensions: ['', '.js', '.scss'],
  },
  module: {
      loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ["react-hot", "babel-loader"]
          },
          {
            test: /\.scss$/,
            loader: 'style!css!sass'
          }
        ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ]
};
