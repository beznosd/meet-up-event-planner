/* eslint-disable */
module.exports = {
	paths: {
		watched: ['src']
	},

	files: {
		javascripts: {
			joinTo: {
        'bundle.js': /^src/,
        'vendor.js': /^node_modules/,
      }
    },
		stylesheets: {
			joinTo: 'app.css'
		}
	},

	plugins: {
    babel: {
    	presets: ['es2015', 'react', 'stage-0']
    }
  },

  npm: {
  	globals: { 
			'$': 'jquery'
  	},
  	javascripts: {
  		'materialize-css': ['dist/js/materialize.min']
  	},
  	styles: {
			'pickadate': ['lib/themes/default.date.css', 'lib/themes/default.css'],
			'materialize-css': ['dist/css/materialize.css']
  	}
  }
};