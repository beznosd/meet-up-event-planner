const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CssSourcemapPlugin = require('css-sourcemaps-webpack-plugin');

module.exports = {
	devtool: 'source-map',

	entry: path.join(__dirname, '/src/index.jsx'),
	output: {
		path: path.join(__dirname, '/public'),
		filename: 'bundle.js'
	},

	module: {
		loaders: [
			{
				exclude: '/node_modules/',
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css?minimize')
			},
			{ 
				test: /\.png$/, 
				loader: 'url-loader?limit=100000' 
			},
			{ 
				test: /\.jpg$/, 
				loader: 'file-loader' 
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
		extensions: ['', '.js', '.jsx'],
		alias: { picker: 'pickadate/lib/picker' }
	},

	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new CssSourcemapPlugin(),
		new ExtractTextPlugin('style.css'),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
	],

	devServer: {
		contentBase: './public',
		colors: true,
		historyApiFallback: true,
		inline: true
	}
};