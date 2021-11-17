const path = require('path'),
  glob = require('glob'),
  webpack = require('webpack'),
  package = require('./package.json'),
  UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  extractSass = new ExtractTextPlugin({ filename: 'kama-angularjs.min.css' }),
  buildMode = 'prod'; // 'dev' or 'prod'

module.exports = {
  entry: {
    'kama-angularjs': './src/kama-angularjs.module.js',
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: getPlugins(),
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            { loader: 'css-loader', options: { minimize: true } },
            { loader: 'sass-loader' },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: buildMode === 'prod' ? { minimize: true } : {},
          },
        ],
      },
    ],
    loaders: [{ test: /\.(png|eot|woff|ttf)$/, loader: 'file-loader' }],
  },
};

function getPlugins() {
  let plugins = [];

  plugins.push(extractSass);

  if (buildMode == 'prod') {
    plugins.push(new UglifyJSPlugin());
    plugins.push(
      new webpack.BannerPlugin(`${package.name} - version ${package.version}`)
    );
  }

  return plugins;
}
