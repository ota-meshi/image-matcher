'use strict';
const path = require('path');
const webpack = require('webpack');
const rm = require('rimraf');
const PACKAGEJSON = require('./package.json');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const BANNER = `/*! image matcher v${PACKAGEJSON.version} | license ${PACKAGEJSON.license} */`;

rm.sync(path.join(path.resolve(__dirname, 'dist/'), '*'));

const devtoolModuleFilenameTemplate = ({resourcePath}) => {
	if (resourcePath.indexOf('node_modules') >= 0) {
		resourcePath = resourcePath.substr(resourcePath.indexOf('node_modules'));
	}
	return `image-matcher/${resourcePath}`;
};
module.exports = [{
	context: path.resolve(__dirname, 'src/js/'),
	entry: {
		'image-matcher': './index.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist/'),
		filename: '[name].js',
		library: 'imagematcher',
		libraryTarget: 'umd',
		devtoolModuleFilenameTemplate,
		devtoolFallbackModuleFilenameTemplate: devtoolModuleFilenameTemplate,
	},
	resolve: {
		extensions: ['.js'],
	},

	module: {
		loaders: [
			{
				enforce: 'pre',
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'eslint-loader',
				options: {
					fix: true,
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				},
			}
		]
	},
	plugins: [
		// new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.BannerPlugin({banner: BANNER, raw: true, entryOnly: true}),
		new LiveReloadPlugin(),
	],
	devtool: '#source-map',
}];
