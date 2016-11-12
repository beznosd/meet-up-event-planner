const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CssSourcemapPlugin = require('css-sourcemaps-webpack-plugin');

const ENV_PRODUCTION = process.env.NODE_ENV || false;

module.exports = {
	devtool: ENV_PRODUCTION ? 'source-map' : 'inline-source-map',

	entry: path.join(__dirname, '/src/index.jsx'),
	output: {
		path: path.join(__dirname, '/public'),
		filename: 'bundle.js'
	},

	module: {
		loaders: [
			{
				// exclude: /\/node_modules\//,
				include: path.join(__dirname, '/src'),
				loader: 'babel'
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css?minimize')
			},
			{ 
				test: /\.png$/, 
				loader: 'url?limit=100000' 
			},
			{ 
				test: /\.jpg$/, 
				loader: 'file' 
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
				loader: 'url?limit=10000&mimetype=application/font-woff'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
				loader: 'url?limit=10000&mimetype=application/octet-stream'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
				loader: 'file'
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
				loader: 'url?limit=10000&mimetype=image/svg+xml'
			}
		]
	},

	resolve: {
		modulesDirectories: ['node_modules'],
		extensions: ['', '.js', '.jsx'],
		alias: { picker: 'pickadate/lib/picker' }
	},
	resolveLoader: {
		modulesDirectories: ['node_modules'],
		moduleTemplate: ['*-loader', '*'],
		extensions: ['', '.js']
	},

	plugins: [
		new ExtractTextPlugin('style.css', { disable: !ENV_PRODUCTION }),
		new webpack.ProvidePlugin({
			$: 'jquery',
		})
	],

	watchOptions: {
		aggregateTimeout: 100
	},

	devServer: {
		contentBase: './public',
		colors: true,
		historyApiFallback: true,
		inline: true
	}
};

if (ENV_PRODUCTION) {
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: false,
				unsafe: false
			}
		}),
		new CssSourcemapPlugin()
	);
}