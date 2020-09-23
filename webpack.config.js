require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const babelConfig = require('./.babelrc');
const PreactRefreshPlugin = require('@prefresh/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = babelConfig.env;
const modernTerser = new TerserPlugin({
  cache: true,
  parallel: true,
  sourceMap: true,
  terserOptions: {
    compress: {
      keep_infinity: true,
      pure_getters: true,
      passes: 10,
    },
    output: {
      // By default, Terser wraps function arguments in extra parens to trigger eager parsing.
      wrap_func_args: false,
    },
    ecma: 8,
    safari10: true,
    toplevel: true,
  }
});

const makeConfig = (mode, localDev) => {
  const { NODE_ENV } = process.env;
  const isProduction = NODE_ENV === 'production';
  const isServer = mode === 'server';

  // Build plugins
  const plugins = [
    localDev && new HtmlWebpackPlugin({ inject: true, template: './index.html' }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:5].css'
    }),
  ].filter(Boolean);

  if (!isProduction) {
    plugins.push(new PreactRefreshPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  // Return configuration
  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      main: isServer ? './src/prerender.js' :'./src/index.js'
    },
    context: path.resolve(__dirname, './'),
    stats: 'normal',
    devtool: isProduction ? '' : 'eval-source-map',
		target: isServer ? 'node' : 'web',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      host: 'localhost',
      port: 3000,
      historyApiFallback: true,
      hot: true,
      inline: true,
      publicPath: '/',
      clientLogLevel: 'none',
      open: true,
      overlay: true,
    },
    output: {
      chunkFilename: isServer ? undefined : `[name]-[contenthash].js`,
      filename: isProduction ? isServer ? 'index.js' : `[name]-[contenthash].js` : `[name].js`,
      path: isServer ? path.resolve(__dirname, 'dist', 'server') : path.resolve(__dirname, 'dist'),
      publicPath: '/',
      libraryTarget: isServer ? 'commonjs2' : undefined
    },
    optimization: {
      minimize: !isServer,
      minimizer: [modernTerser],
    },
    plugins,
    resolve: {
      mainFields: ['module', 'main', 'browser'],
      extensions: [".mjs", ".js", ".jsx"],
      alias: {
        preact: path.resolve(__dirname, 'node_modules', 'preact'),
        url: 'native-url'
      },
    },
    module: {
      rules: [
        {
          // This is to support our `graphql` dependency, they expose a .mjs bundle instead of .js
          // Sneaky sneaky sir graphql.
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        {
          test: /\.(sa|sc|c)ss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								esModule: true,
								fallback: 'style-loader'
							}
						},
						{ loader: 'css-loader', options: { esModule: true } }
					]
				},
        {
          test: /\.(png|jpe?g|gif|woff)$/,
          use: [
            {
              loader: 'file-loader',
              options: {},
            },
          ],
        },
        {
          // Makes our babel-loader the lord and savior over our TypeScript
          test: /\.js$|\.jsx$/,
          include: [
            path.resolve(__dirname, "src"),
          ],
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            ...env[mode],
          }
        },
      ],
    },
  };
};

module.exports = process.env.NODE_ENV === 'production' ?
  [makeConfig('modern'), makeConfig('server')] :
  makeConfig('modern', true);
