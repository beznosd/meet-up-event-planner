/* eslint-disable */
const path = require('path');
const webpack = require('webpack');

module.exports = {
	devtool: 'inline-source-map',

	entry: path.join(__dirname, '/src/index.jsx'),
	output: {
		path: path.join(__dirname, '/public'),
		filename: 'bundle.js'
	},

	module: {
		loaders: [
			{
				include: path.join(__dirname, '/src'),
				loader: 'babel'
			},
			{
				test: /\.css$/,
				loaders: ['style', 'css']
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