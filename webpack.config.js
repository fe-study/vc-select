var webpack = require('webpack')
var path = require('path')
var name = require('./package.json').name.replace(/-(\w)/g, function (match) { return match.slice(1).toUpperCase() } )

module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    publicPath: '/',
    filename: 'build.js',
    library: name,
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    root: path.resolve('./')
  },
  vue: {
    loaders: {
      css: 'style!css!less',
      js: 'babel'
    }
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/src|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel'
      },
      { test: /\.css$/, loader: "style-loader!css-loader?root=./docs/" },
      { test: /\.scss$/, loader: "style!css!sass" },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
    ]
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  devtool: 'source-map'
}

if (process.env.NODE_ENV === 'production') {
  delete module.exports.devtool
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
