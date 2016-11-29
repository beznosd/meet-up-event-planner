module.exports = {
	"extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "env": {
  	"jquery": true,
		"mocha": true
  },
	"rules": {
		"no-unused-vars": "warn",
		"no-undef": "warn",
		"no-console": "off",
		"no-param-reassign": "off",
		"no-case-declarations": "off",
		"comma-dangle": "off",
		"no-plusplus": "off",
		"arrow-parens": 'off',
		"no-tabs": "off",
		"func-names": "off",
		"max-len": "off",
		"no-multiple-empty-lines": "off",
		"no-useless-escape": "off",
		"consistent-return": "off",
		"indent": ["error", "tab"],
		"space-before-function-paren": ["error", "never"],
		"arrow-body-style": "off",
		"no-trailing-spaces": "off",
		"class-methods-use-this": "off",
		"eol-last": "off",
		"react/jsx-indent": [2, "tab"],
		// "react/jsx-indent": "off",
		"react/prefer-stateless-function": [0],
		"react/jsx-indent-props": [2, "tab"],
		"react/self-closing-comp": ["error", {
		  "component": true,
		  "html": false
		}],
		"react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
		"react/forbid-prop-types": [0],
		"jsx-a11y/no-static-element-interactions": [0]
	}
};