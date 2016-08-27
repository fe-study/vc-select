var config = require('./webpack.config.js')
var name = require('./package.json').name.replace(/-(\w)/g, function (match) { return match.slice(1).toUpperCase() } )

config.entry = {
  'app': './examples/index.js',
}

config.output = {
  filename: './dist/example.js',
  library: name,
  libraryTarget: 'umd'
}

module.exports = config
