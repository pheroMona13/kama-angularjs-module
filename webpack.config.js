const path = require('path'),
  glob = require('glob'),
  webpack = require('webpack'),
  package = require('./package.json'),
  TerserPlugin = require('terser-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  extractSass = new MiniCssExtractPlugin({
    filename: '[name].min.css',
    chunkFilename: '[id].css',
  }),
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
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
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
      {
        test: /\.(png|eot|woff|ttf)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};

function getPlugins() {
  let plugins = [];

  plugins.push(extractSass);

  if (buildMode == 'prod') {
    plugins.push(
      new webpack.BannerPlugin(`${package.name} - version ${package.version}`)
    );
  }

  return plugins;
}
