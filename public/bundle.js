(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("src/actions/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.deleteEvent = exports.fetchEvent = exports.fetchEvents = exports.addEvent = undefined;

var _types = require('./types');

var addEvent = exports.addEvent = function addEvent(event) {
	return {
		type: _types.ADD_EVENT,
		payload: event
	};
};

var fetchEvents = exports.fetchEvents = function fetchEvents() {
	var eventsList = getEventsList();

	return {
		type: _types.FETCH_EVENTS,
		payload: eventsList
	};
};

var fetchEvent = exports.fetchEvent = function fetchEvent(eventId) {
	var eventsList = getEventsList();

	var event = null;
	for (var i = 0; i < eventsList.length; i++) {
		if (eventsList[i].id === +eventId) {
			event = eventsList[i];
			break;
		}
	}

	return {
		type: _types.FETCH_EVENT,
		payload: event
	};
};

var deleteEvent = exports.deleteEvent = function deleteEvent(eventIndex) {
	return {
		type: _types.DELETE_EVENT,
		payload: eventIndex
	};
};

// helper function
var getEventsList = function getEventsList() {
	var currentUser = localStorage.currentUser;
	var events = [];
	if (localStorage.events) {
		events = JSON.parse(localStorage.events);
	}

	var eventsList = [];
	for (var i = 0; i < events.length; i++) {
		if ({}.hasOwnProperty.call(events[i], currentUser)) {
			eventsList = events[i][currentUser].reverse();
			break;
		}
	}

	return eventsList;
};
});

require.register("src/actions/types.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ADD_EVENT = exports.ADD_EVENT = 'ADD_EVENT';
var FETCH_EVENTS = exports.FETCH_EVENTS = 'FETCH_EVENTS';
var FETCH_EVENT = exports.FETCH_EVENT = 'FETCH_EVENT';
var DELETE_EVENT = exports.DELETE_EVENT = 'DELETE_EVENT';
});

require.register("src/components/App.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
	_inherits(App, _Component);

	function App() {
		_classCallCheck(this, App);

		return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
	}

	_createClass(App, [{
		key: 'logout',
		value: function logout() {
			localStorage.currentUser = '';
			_reactRouter.browserHistory.push('/login');
		}
	}, {
		key: 'render',
		value: function render() {
			var location = this.props.location.pathname;
			var rout404 = this.props.routes[1].path === '*';

			// if not authorized, redirect to signup
			if (location !== '/login' && location !== '/signup' && location !== '/' && !rout404) {
				if (!localStorage.currentUser) {
					_reactRouter.browserHistory.push('/signup');
				}
			}

			var backIcon = _react2.default.createElement(
				'i',
				{ onClick: function onClick() {
						return _reactRouter.browserHistory.goBack();
					}, className: 'material-icons back-icon small' },
				'arrow_back'
			);
			var logoutIcon = _react2.default.createElement(
				'i',
				{ onClick: this.logout, className: 'material-icons logout-icon small' },
				'exit_to_app'
			);

			if (location === '/login' || location === '/signup' || location === '/' || rout404) {
				logoutIcon = '';
				backIcon = '';
			}

			if (location === '/events') {
				backIcon = '';
			}

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'h2',
					{ className: 'center-align' },
					'Meet Up Event Planner'
				),
				logoutIcon,
				backIcon,
				this.props.children
			);
		}
	}]);

	return App;
}(_react.Component);

exports.default = App;


App.propTypes = {
	routes: _react.PropTypes.array,
	children: _react.PropTypes.object,
	location: _react.PropTypes.object
};
});

require.register("src/components/CreateEvent.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _actions = require('./../actions');

var _CreateEventForm = require('./create-event/CreateEventForm');

var _CreateEventForm2 = _interopRequireDefault(_CreateEventForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreateEvent = function (_Component) {
	_inherits(CreateEvent, _Component);

	function CreateEvent(props) {
		_classCallCheck(this, CreateEvent);

		var _this = _possibleConstructorReturn(this, (CreateEvent.__proto__ || Object.getPrototypeOf(CreateEvent)).call(this, props));

		_this.createEvent = _this.createEvent.bind(_this);
		return _this;
	}

	_createClass(CreateEvent, [{
		key: 'createEvent',
		value: function createEvent(newEvent) {
			this.props.addEvent(newEvent);
			_reactRouter.browserHistory.push('/events');
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(_CreateEventForm2.default, { createEvent: this.createEvent });
		}
	}]);

	return CreateEvent;
}(_react.Component);

CreateEvent.propTypes = {
	addEvent: _react.PropTypes.func
};

exports.default = (0, _reactRedux.connect)(null, { addEvent: _actions.addEvent })(CreateEvent);
});

require.register("src/components/Event.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('./../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Event = function (_Component) {
	_inherits(Event, _Component);

	function Event(props) {
		_classCallCheck(this, Event);

		var _this = _possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).call(this, props));

		_this.props.fetchEvent(_this.props.routeParams.eventId);
		return _this;
	}

	_createClass(Event, [{
		key: 'render',
		value: function render() {
			var event = this.props.event;

			if (Object.keys(event).length === 0) {
				return _react2.default.createElement(
					'div',
					{ className: 'center-align' },
					'Loading ...'
				);
			}

			return _react2.default.createElement(
				'div',
				{ className: 'app-content event-content' },
				_react2.default.createElement(
					'h4',
					{ className: 'center-align' },
					'\u2022 ',
					event.name,
					' \u2022'
				),
				_react2.default.createElement(
					'p',
					null,
					_react2.default.createElement(
						'b',
						null,
						'Host:'
					),
					' ',
					event.host
				),
				_react2.default.createElement(
					'p',
					null,
					_react2.default.createElement(
						'b',
						null,
						'Event type:'
					),
					' ',
					event.type
				),
				_react2.default.createElement(
					'p',
					null,
					_react2.default.createElement(
						'b',
						null,
						'List of guests:'
					)
				),
				_react2.default.createElement(
					'div',
					null,
					event.guests.map(function (guest, i) {
						return _react2.default.createElement(
							'div',
							{ key: i },
							guest
						);
					})
				),
				_react2.default.createElement(
					'p',
					null,
					_react2.default.createElement(
						'b',
						null,
						'Starts:'
					),
					' ',
					event.startDate,
					' at ',
					event.startTime
				),
				_react2.default.createElement(
					'p',
					null,
					_react2.default.createElement(
						'b',
						null,
						'Ends:'
					),
					' ',
					event.endDate,
					' at ',
					event.endTime
				),
				_react2.default.createElement(
					'p',
					null,
					_react2.default.createElement(
						'b',
						null,
						'Location:'
					),
					' ',
					event.location
				),
				_react2.default.createElement(
					'p',
					null,
					_react2.default.createElement(
						'b',
						null,
						'Additional Information:'
					),
					' ',
					event.message ? event.message : 'no aditional info for this event'
				)
			);
		}
	}]);

	return Event;
}(_react.Component);

Event.propTypes = {
	routeParams: _react.PropTypes.object,
	fetchEvent: _react.PropTypes.func,
	event: _react.PropTypes.object
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		event: state.event
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, { fetchEvent: _actions.fetchEvent })(Event);
});

require.register("src/components/EventsList.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _actions = require('./../actions');

var _EventsListItem = require('./EventsListItem');

var _EventsListItem2 = _interopRequireDefault(_EventsListItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventsList = function (_Component) {
	_inherits(EventsList, _Component);

	function EventsList(props) {
		_classCallCheck(this, EventsList);

		var _this = _possibleConstructorReturn(this, (EventsList.__proto__ || Object.getPrototypeOf(EventsList)).call(this, props));

		_this.props.fetchEvents();

		_this.removeEvent = _this.removeEvent.bind(_this);
		return _this;
	}

	_createClass(EventsList, [{
		key: 'removeEvent',
		value: function removeEvent(eventId) {
			var eventsList = this.props.events;

			var eventIndex = null;
			for (var i = 0; i < eventsList.length; i++) {
				if (eventsList[i].id === eventId) {
					eventIndex = i;
					break;
				}
			}

			// update state, fire action creator

			this.props.deleteEvent(eventIndex);

			// update localStorage

			eventsList.splice(eventIndex, 1);

			var events = JSON.parse(localStorage.events);
			var currentUser = localStorage.currentUser;

			var userIndex = null;
			for (var _i = 0; _i < events.length; _i++) {
				if ({}.hasOwnProperty.call(events[_i], currentUser)) {
					userIndex = _i;
					break;
				}
			}

			events[userIndex][currentUser] = eventsList;
			localStorage.setItem('events', JSON.stringify(events));
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					_react2.default.createElement(
						'div',
						{ className: 'col s12 m6 l4 push-s0 push-m3 push-l4' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/create-event', className: 'btn btn-fluid' },
							'Create new event'
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'app-content' },
					_react2.default.createElement(
						'h4',
						{ className: 'left-align' },
						'Your events list'
					),
					_react2.default.createElement(
						'div',
						{ className: 'event-list' },
						this.props.events.length ? this.props.events.map(function (event) {
							return _react2.default.createElement(_EventsListItem2.default, _extends({ key: event.id, removeEvent: function removeEvent() {
									return _this2.removeEvent(event.id);
								} }, event));
						}) : 'You have not created any event yet.'
					)
				)
			);
		}
	}]);

	return EventsList;
}(_react.Component);

EventsList.propTypes = {
	events: _react.PropTypes.array,
	fetchEvents: _react.PropTypes.func,
	deleteEvent: _react.PropTypes.func
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		events: state.events
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, { fetchEvents: _actions.fetchEvents, deleteEvent: _actions.deleteEvent })(EventsList);
});

require.register("src/components/EventsListItem.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventsListItem = function EventsListItem(props) {
	return _react2.default.createElement(
		'div',
		{ className: 'row' },
		_react2.default.createElement(
			'div',
			{ className: 'card blue-grey darken-1' },
			_react2.default.createElement(
				'div',
				{ className: 'card-content white-text' },
				_react2.default.createElement(
					'span',
					{ className: 'card-title' },
					props.name
				),
				_react2.default.createElement(
					'p',
					null,
					'Starts: ',
					props.startDate,
					' at ',
					props.startTime
				),
				_react2.default.createElement(
					'p',
					null,
					'Ends: ',
					props.endDate,
					' at ',
					props.endTime
				),
				_react2.default.createElement(
					'p',
					null,
					'Location: ',
					props.location
				)
			),
			_react2.default.createElement(
				'div',
				{ className: 'card-action right-align' },
				_react2.default.createElement(
					'i',
					{ onClick: props.removeEvent, className: 'material-icons delete-event-icon' },
					'delete'
				),
				_react2.default.createElement(
					_reactRouter.Link,
					{ to: '/events/' + props.id, className: 'event-item-link' },
					'More details'
				)
			)
		)
	);
};

EventsListItem.propTypes = {
	name: _react.PropTypes.string,
	startDate: _react.PropTypes.string,
	startTime: _react.PropTypes.string,
	endDate: _react.PropTypes.string,
	endTime: _react.PropTypes.string,
	location: _react.PropTypes.string,
	removeEvent: _react.PropTypes.func,
	id: _react.PropTypes.number
};

exports.default = EventsListItem;
});

require.register("src/components/Login.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Login = function (_Component) {
	_inherits(Login, _Component);

	function Login(props) {
		_classCallCheck(this, Login);

		var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props));

		_this.login = _this.login.bind(_this);
		return _this;
	}

	_createClass(Login, [{
		key: 'login',
		value: function login(evt) {
			evt.preventDefault();

			var email = this.emailInput.value.trim();
			var pass = this.passInput.value.trim();

			if (!email || !pass) {
				return false;
			}

			if (!localStorage.users) {
				localStorage.users = JSON.stringify([]);
			}

			var users = JSON.parse(localStorage.users);

			var success = false;
			for (var i = 0; i < users.length; i++) {
				if (users[i].email === email && users[i].pass === pass) {
					success = true;
					break;
				}
			}

			if (!success) {
				this.formError.textContent = 'Invalid password or email';
				return false;
			}

			localStorage.currentUser = email;
			_reactRouter.browserHistory.push('/events');
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			return _react2.default.createElement(
				'div',
				{ className: 'row' },
				_react2.default.createElement(
					'form',
					{ onSubmit: this.login, className: 'col s12' },
					_react2.default.createElement(
						'h4',
						{ className: 'cols s3 center-align auth-header' },
						'Login'
					),
					_react2.default.createElement(
						'div',
						{ className: 'row' },
						_react2.default.createElement(
							'div',
							{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
							_react2.default.createElement('input', { onBlur: this.checkEmail, ref: function ref(emailInput) {
									_this2.emailInput = emailInput;
								}, placeholder: 'Type email here', id: 'email', type: 'email', autoFocus: true, autoComplete: true, required: true }),
							_react2.default.createElement(
								'label',
								{ htmlFor: 'email', className: 'active' },
								'Email'
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'row' },
						_react2.default.createElement(
							'div',
							{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
							_react2.default.createElement('input', { onBlur: this.checkPass, ref: function ref(passInput) {
									_this2.passInput = passInput;
								}, placeholder: 'Type password here', id: 'password', type: 'password', required: true }),
							_react2.default.createElement(
								'label',
								{ htmlFor: 'password', className: 'active' },
								'Password'
							)
						)
					),
					_react2.default.createElement('div', { ref: function ref(formError) {
							_this2.formError = formError;
						}, className: 'center-align error-msg' }),
					_react2.default.createElement(
						'div',
						{ className: 'row' },
						_react2.default.createElement(
							'div',
							{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
							_react2.default.createElement(
								'button',
								{ className: 'btn btn-fluid' },
								'Log in'
							)
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'center-align' },
					'or ',
					_react2.default.createElement(
						_reactRouter.Link,
						{ to: '/signup' },
						'sign up'
					),
					' if you are already have an account'
				)
			);
		}
	}]);

	return Login;
}(_react.Component);

exports.default = Login;
});

;require.register("src/components/NotFound.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotFound = function NotFound() {
	return _react2.default.createElement(
		'div',
		{ className: 'center-align' },
		_react2.default.createElement(
			'h4',
			null,
			'404 Such page does not exists'
		),
		_react2.default.createElement(
			'h5',
			null,
			_react2.default.createElement(
				_reactRouter.Link,
				{ to: '/signup' },
				'Sign up'
			),
			' or',
			_react2.default.createElement(
				_reactRouter.Link,
				{ to: '/login' },
				' log in'
			),
			' to app.'
		)
	);
};

exports.default = NotFound;
});

require.register("src/components/SignUp.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SignUp = function (_Component) {
	_inherits(SignUp, _Component);

	function SignUp(props) {
		_classCallCheck(this, SignUp);

		var _this = _possibleConstructorReturn(this, (SignUp.__proto__ || Object.getPrototypeOf(SignUp)).call(this, props));

		_this.state = {
			showAditional: false
		};

		_this.signup = _this.signup.bind(_this);
		_this.checkEmail = _this.checkEmail.bind(_this);
		_this.checkPass = _this.checkPass.bind(_this);
		_this.checkName = _this.checkName.bind(_this);
		_this.checkRepeatPass = _this.checkRepeatPass.bind(_this);
		_this.switchAditionalInputs = _this.switchAditionalInputs.bind(_this);
		_this.showPassRules = _this.showPassRules.bind(_this);
		return _this;
	}

	_createClass(SignUp, [{
		key: 'checkName',
		value: function checkName() {
			var name = this.nameInput.value.trim();

			if (name && name.length < 2) {
				this.showInputError('name', 'Name should be at least from 2 symbols');
			} else {
				this.hideInputError('name');
			}
		}
	}, {
		key: 'checkEmail',
		value: function checkEmail() {
			if (!localStorage.users) {
				localStorage.users = JSON.stringify([]);
			}

			var email = this.emailInput.value.trim();
			var users = JSON.parse(localStorage.users);

			if (email && !this.isValidEmail(email)) {
				this.showInputError('email', 'Email is not valid');
			} else if (email && this.isEmailExists(email, users)) {
				this.showInputError('email', 'User with such email is already exists');
			} else {
				this.hideInputError('email');
			}
		}
	}, {
		key: 'checkPass',
		value: function checkPass() {
			var pass = this.passInput.value.trim();

			// check password length
			if (pass.length >= 8) {
				this.passRuleLength.classList.add('hide');
			} else {
				this.passRuleLength.classList.remove('hide');
			}
			// check uppercase letter in password
			if (/^(?=.*[A-Z]).+$/.test(pass)) {
				this.passRuleUppercase.classList.add('hide');
			} else {
				this.passRuleUppercase.classList.remove('hide');
			}
			// check special character in password
			if (/^(?=.*[0-9_\W]).+$/.test(pass)) {
				this.passRuleSpecial.classList.add('hide');
			} else {
				this.passRuleSpecial.classList.remove('hide');
			}

			this.hideInputError('pass');
		}
	}, {
		key: 'checkRepeatPass',
		value: function checkRepeatPass() {
			var repeatpass = this.repeatPassInput.value.trim();
			var pass = this.passInput.value.trim();

			if (repeatpass && repeatpass !== pass) {
				this.showInputError('repeatPass', 'Passwords do not match');
			} else {
				this.hideInputError('repeatPass');
			}
		}
	}, {
		key: 'showInputError',
		value: function showInputError(inputType) {
			var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

			this[inputType + 'Error'].textContent = message;
			this[inputType + 'Input'].classList.add('invalid');
		}
	}, {
		key: 'hideInputError',
		value: function hideInputError(inputType) {
			this[inputType + 'Error'].textContent = '';
			this[inputType + 'Input'].classList.remove('invalid');
		}
	}, {
		key: 'showPassRules',
		value: function showPassRules() {
			this.passRules.classList.remove('hide');
		}
	}, {
		key: 'switchAditionalInputs',
		value: function switchAditionalInputs() {
			if (!this.state.showAditional) {
				$('.aditional-info').slideDown(200);
			} else {
				$('.aditional-info').slideUp(200);
			}
			this.setState({ showAditional: !this.state.showAditional });
		}
	}, {
		key: 'signup',
		value: function signup(evt) {
			evt.preventDefault();

			// required
			var name = this.nameInput.value.trim();
			var email = this.emailInput.value.trim();
			var pass = this.passInput.value.trim();
			var repeatpass = this.repeatPassInput.value.trim();
			// optional
			var job = this.jobInput.value.trim();
			var age = this.ageInput.value.trim();
			var isMarried = this.marriedInput.checked;
			var isChildren = this.childrenInput.checked;
			var isPets = this.petsInput.checked;

			var isError = false;

			if (name.length < 2) {
				this.showInputError('name', 'Name should be at least from 2 symbols');
				isError = true;
			}

			if (!this.isValidEmail(email)) {
				this.showInputError('email', 'Email is not valid');
				isError = true;
			}

			if (!pass) {
				this.showPassRules();
				isError = true;
			}

			if (pass !== repeatpass) {
				this.showInputError('repeatPass', 'Passwords do not match');
				isError = true;
			}

			if (isError) {
				return false;
			}

			// check for user existance

			if (!localStorage.users) {
				localStorage.users = JSON.stringify([]);
			}

			var users = JSON.parse(localStorage.users);

			if (!this.isEmailExists(email, users)) {
				users.push({ name: name, email: email, pass: pass, job: job, age: age, isMarried: isMarried, isChildren: isChildren, isPets: isPets });
				localStorage.users = JSON.stringify(users);
				localStorage.currentUser = email;
				_reactRouter.browserHistory.push('/events');
			} else {
				this.showInputError('email', 'User with such email is already exists');
			}
		}
	}, {
		key: 'isEmailExists',
		value: function isEmailExists(email, users) {
			var userExists = false;
			users.forEach(function (user) {
				if (user.email === email) {
					userExists = true;
				}
			});
			return userExists;
		}
	}, {
		key: 'isValidEmail',
		value: function isValidEmail(email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			return _react2.default.createElement(
				'div',
				{ className: 'row' },
				_react2.default.createElement(
					'form',
					{ onSubmit: this.signup, className: 'col s12' },
					_react2.default.createElement(
						'h4',
						{ className: 'cols s3 center-align auth-header' },
						'Signup'
					),
					_react2.default.createElement(
						'div',
						{ className: 'row' },
						_react2.default.createElement(
							'div',
							{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
							_react2.default.createElement('input', { onBlur: this.checkName, ref: function ref(nameInput) {
									_this2.nameInput = nameInput;
								}, placeholder: 'Type name here', id: 'name', type: 'text', autoFocus: true, autoComplete: true }),
							_react2.default.createElement(
								'label',
								{ htmlFor: 'name', className: 'active' },
								'Name'
							),
							_react2.default.createElement('div', { ref: function ref(nameError) {
									_this2.nameError = nameError;
								}, className: 'error-msg' })
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'row' },
						_react2.default.createElement(
							'div',
							{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
							_react2.default.createElement('input', { onBlur: this.checkEmail, ref: function ref(emailInput) {
									_this2.emailInput = emailInput;
								}, placeholder: 'Type email here', id: 'email', type: 'email', autoComplete: true }),
							_react2.default.createElement(
								'label',
								{ htmlFor: 'email', className: 'active' },
								'Email'
							),
							_react2.default.createElement('div', { ref: function ref(emailError) {
									_this2.emailError = emailError;
								}, className: 'error-msg' })
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'row' },
						_react2.default.createElement(
							'div',
							{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
							_react2.default.createElement('input', { onFocus: this.showPassRules, onInput: this.checkPass, ref: function ref(passInput) {
									_this2.passInput = passInput;
								}, placeholder: 'Type password here', id: 'password', type: 'password' }),
							_react2.default.createElement(
								'label',
								{ htmlFor: 'password', className: 'active' },
								'Password'
							),
							_react2.default.createElement(
								'div',
								{ ref: function ref(passRules) {
										_this2.passRules = passRules;
									}, className: 'password-rules hide error-msg' },
								_react2.default.createElement(
									'div',
									{ ref: function ref(passRuleLength) {
											_this2.passRuleLength = passRuleLength;
										} },
									'Password should be at least from 8 symbols'
								),
								_react2.default.createElement(
									'div',
									{ ref: function ref(passRuleUppercase) {
											_this2.passRuleUppercase = passRuleUppercase;
										} },
									'Password should contain uppercase letter'
								),
								_react2.default.createElement(
									'div',
									{ ref: function ref(passRuleSpecial) {
											_this2.passRuleSpecial = passRuleSpecial;
										} },
									'Password should contain number or special character'
								)
							),
							_react2.default.createElement('div', { ref: function ref(passError) {
									_this2.passError = passError;
								}, className: 'error-msg' })
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'row' },
						_react2.default.createElement(
							'div',
							{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
							_react2.default.createElement('input', { onBlur: this.checkRepeatPass, ref: function ref(repeatPassInput) {
									_this2.repeatPassInput = repeatPassInput;
								}, placeholder: 'Repeat your password', id: 'repeat-passwrod', type: 'password' }),
							_react2.default.createElement(
								'label',
								{ htmlFor: 'repeat-password', className: 'active' },
								'Repeat Password'
							),
							_react2.default.createElement('div', { ref: function ref(repeatPassError) {
									_this2.repeatPassError = repeatPassError;
								}, className: 'error-msg' })
						)
					),
					_react2.default.createElement('div', { ref: function ref(formError) {
							_this2.formError = formError;
						}, className: 'center-align error-msg' }),
					_react2.default.createElement(
						'div',
						{ className: 'row no-margin-row' },
						_react2.default.createElement(
							'div',
							{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4 center-align no-margin-col' },
							_react2.default.createElement(
								'span',
								{ onClick: this.switchAditionalInputs, className: 'add-info-signup-link' },
								'Fill aditional information'
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'aditional-info hidden' },
						_react2.default.createElement(
							'div',
							{ className: 'row no-margin-row' },
							_react2.default.createElement(
								'div',
								{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
								_react2.default.createElement('input', { onBlur: this.checkJob, ref: function ref(jobInput) {
										_this2.jobInput = jobInput;
									}, placeholder: 'Type your job here', id: 'job', type: 'text', autoComplete: true }),
								_react2.default.createElement(
									'label',
									{ htmlFor: 'job', className: 'active' },
									'What is your job or occupation?'
								),
								_react2.default.createElement(
									'div',
									{ ref: function ref(jobError) {
											_this2.jobError = jobError;
										}, className: 'error-msg hide' },
									'Job should be at least from 2 symbols'
								)
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'row no-margin-row' },
							_react2.default.createElement(
								'div',
								{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
								_react2.default.createElement('input', { onBlur: this.checkAge, ref: function ref(ageInput) {
										_this2.ageInput = ageInput;
									}, placeholder: 'Type your age here', id: 'age', min: '1', max: '150', type: 'number' }),
								_react2.default.createElement(
									'label',
									{ htmlFor: 'age', className: 'active' },
									'How old are you?'
								),
								_react2.default.createElement(
									'div',
									{ ref: function ref(ageError) {
											_this2.ageError = ageError;
										}, className: 'error-msg hide' },
									'How old are you?'
								)
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'row' },
							_react2.default.createElement(
								'div',
								{ className: 'input-field col s6 m3 l2 push-s0 push-m3 push-l4 no-margin-col' },
								_react2.default.createElement('input', { ref: function ref(marriedInput) {
										_this2.marriedInput = marriedInput;
									}, type: 'checkbox', id: 'married' }),
								_react2.default.createElement(
									'label',
									{ htmlFor: 'married' },
									'Married'
								)
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'row' },
							_react2.default.createElement(
								'div',
								{ className: 'input-field col s6 m3 l2 push-s0 push-m3 push-l4 no-margin-col' },
								_react2.default.createElement('input', { ref: function ref(childrenInput) {
										_this2.childrenInput = childrenInput;
									}, type: 'checkbox', id: 'children' }),
								_react2.default.createElement(
									'label',
									{ htmlFor: 'children' },
									'Have Children'
								)
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'row' },
							_react2.default.createElement(
								'div',
								{ className: 'input-field col s6 m3 l2 push-s0 push-m3 push-l4 no-margin-col' },
								_react2.default.createElement('input', { ref: function ref(petsInput) {
										_this2.petsInput = petsInput;
									}, type: 'checkbox', id: 'pets' }),
								_react2.default.createElement(
									'label',
									{ htmlFor: 'pets' },
									'Have pets'
								)
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'row' },
						_react2.default.createElement(
							'div',
							{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
							_react2.default.createElement(
								'button',
								{ className: 'btn btn-fluid' },
								'Sign up'
							)
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'center-align' },
					'or ',
					_react2.default.createElement(
						_reactRouter.Link,
						{ to: '/login' },
						'log in'
					),
					' if you are already have an account'
				)
			);
		}
	}]);

	return SignUp;
}(_react.Component);

exports.default = SignUp;
});

;require.register("src/components/create-event/CreateEventForm.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _TextField = require('./TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _GuestsField = require('./GuestsField');

var _GuestsField2 = _interopRequireDefault(_GuestsField);

var _DateTimeFields = require('./DateTimeFields');

var _DateTimeFields2 = _interopRequireDefault(_DateTimeFields);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreateEventForm = function (_Component) {
	_inherits(CreateEventForm, _Component);

	function CreateEventForm(props) {
		_classCallCheck(this, CreateEventForm);

		var _this = _possibleConstructorReturn(this, (CreateEventForm.__proto__ || Object.getPrototypeOf(CreateEventForm)).call(this, props));

		_this.state = {
			event: {
				name: '',
				host: '',
				location: '',
				type: '',
				startDate: '',
				startTime: '',
				endDate: '',
				endTime: '',
				guests: []
			},
			errors: [],
			focusGuests: false,
			progressWidth: 0
		};

		_this.progressStep = 10;

		_this.onSubmitForm = _this.onSubmitForm.bind(_this);
		_this.onFocusGuests = _this.onFocusGuests.bind(_this);
		_this.onBlurGuests = _this.onBlurGuests.bind(_this);
		_this.onFormKeyPress = _this.onFormKeyPress.bind(_this);
		_this.onChangeTextField = _this.onChangeTextField.bind(_this);
		_this.onChangeDateField = _this.onChangeDateField.bind(_this);
		_this.onChangeGuestField = _this.onChangeGuestField.bind(_this);
		return _this;
	}

	_createClass(CreateEventForm, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			// Initialization of top progress
			var progress = document.querySelector('.progress');
			window.scrollTo(0, 0);
			window.onscroll = function () {
				progress.style.top = window.pageYOffset + 'px';
			};

			// initialization of google address autocomplete
			new google.maps.places.Autocomplete(document.querySelector('input[id="location"]'));
		}
	}, {
		key: 'onFormKeyPress',
		value: function onFormKeyPress(evt) {
			if (evt.key === 'Enter' && this.state.focusGuests) {
				evt.preventDefault();
			}
		}
	}, {
		key: 'onFocusGuests',
		value: function onFocusGuests() {
			this.setState({ focusGuests: true });
		}
	}, {
		key: 'onBlurGuests',
		value: function onBlurGuests(evt) {
			this.setState({ focusGuests: false });
		}
	}, {
		key: 'onSubmitForm',
		value: function onSubmitForm(evt) {
			evt.preventDefault();

			var name = this.state.event.name;
			var type = this.state.event.type;
			var host = this.state.event.host;
			var startDate = this.state.event.startDate;
			var startTime = this.state.event.startTime;
			var endDate = this.state.event.endDate;
			var endTime = this.state.event.endTime;
			var guests = this.state.event.guests;
			var location = document.getElementById('location').value;
			var message = this.messageInput.value.trim();

			var errors = [];

			// collect errors
			if (!name) errors.push({ type: 'name', msg: 'Please provide event name' });
			if (!type) errors.push({ type: 'type', msg: 'Please provide event type' });
			if (!host) errors.push({ type: 'host', msg: 'Please provide event host' });
			if (!startDate) errors.push({ type: 'startDate', msg: 'Please choose start date of event' });
			if (!startTime) errors.push({ type: 'startTime', msg: 'Please choose start time of event' });
			if (!endDate) errors.push({ type: 'endDate', msg: 'Please choose end date of event' });
			if (!endTime) errors.push({ type: 'endTime', msg: 'Please choose end time of event' });

			if (new Date(startDate) > new Date(endDate)) {
				errors.push({ type: 'endDate', msg: 'End date cannot be lower then start date' });
			}

			var date = this.getDateObject();
			if (new Date(date.year, date.month, date.day) > new Date(startDate)) {
				errors.push({ type: 'startDate', msg: 'Event cannot be started in the past' });
			}

			if (new Date(date.year, date.month, date.day).toDateString() === new Date(startDate).toDateString()) {
				if (parseInt(startTime, 10) < new Date().getHours()) {
					errors.push({ type: 'startTime', msg: 'Event cannot be started in the past' });
				}
			}

			if (startDate === endDate && startDate && endDate) {
				if (parseInt(startTime, 10) > parseInt(endTime, 10)) {
					errors.push({ type: 'endDate', msg: 'End date cannot be lower then start date' });
				}
				if (startTime === endTime) {
					errors.push({ type: 'endTime', msg: 'Event cannot starts and ends at the same time' });
				}
			}

			if (!guests.length) errors.push({ type: 'guests', msg: 'Please add at least one guest to event' });
			if (!location) errors.push({ type: 'location', msg: 'Please provide event location' });

			if (errors.length > 0) {
				this.setState({ errors: errors });
				return false;
			}

			var newEvent = {
				name: name, type: type, host: host, startDate: startDate, startTime: startTime, endDate: endDate, endTime: endTime, location: location, message: message, guests: guests
			};

			this.props.createEvent(newEvent);
		}
	}, {
		key: 'onChangeTextField',
		value: function onChangeTextField(evt) {
			this.hideFieldError(evt.target.id);

			var event = this.state.event;
			event[evt.target.id] = evt.target.value;

			var progressWidth = this.getNewPropgressWidth(this.progressStep);

			this.setState({ event: event, progressWidth: progressWidth });
		}
	}, {
		key: 'onChangeDateField',
		value: function onChangeDateField(type, value) {
			var event = this.state.event;
			event[type] = value;

			var progressWidth = this.getNewPropgressWidth(this.progressStep);

			this.setState({ event: event, progressWidth: progressWidth });
		}
	}, {
		key: 'onChangeGuestField',
		value: function onChangeGuestField(eventType, value) {
			this.hideFieldError('guests');

			var event = this.state.event;
			if (eventType === 'add') {
				event.guests.push(value);
			}
			if (eventType === 'remove') {
				event.guests.splice(event.guests.indexOf(value), 1);
			}

			var progressWidth = this.getNewPropgressWidth(this.progressStep);

			this.setState({ event: event, progressWidth: progressWidth });
		}
	}, {
		key: 'getDateObject',
		value: function getDateObject() {
			var now = new Date();
			return {
				year: now.getFullYear(),
				month: now.getMonth(),
				day: now.getDate()
			};
		}
	}, {
		key: 'getNewPropgressWidth',
		value: function getNewPropgressWidth(progressStep) {
			var event = this.state.event;
			var filledProps = 0;
			for (var prop in event) {
				if (event[prop].length) filledProps++;
			}
			return filledProps * progressStep;
		}
	}, {
		key: 'hideFieldError',
		value: function hideFieldError(fieldType) {
			if (this.state.errors.findIndex(function (error) {
				return error.type === fieldType;
			}) > -1) {
				var errors = this.state.errors.filter(function (error) {
					return error.type !== fieldType;
				});
				this.setState({ errors: errors });
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var progressStyles = {
				width: this.state.progressWidth + '%'
			};
			return _react2.default.createElement(
				'div',
				{ className: 'row' },
				_react2.default.createElement(
					'div',
					{ className: 'progress' },
					_react2.default.createElement('div', { className: 'determinate', style: progressStyles })
				),
				_react2.default.createElement(
					'form',
					{ onKeyPress: this.onFormKeyPress, ref: function ref(eventForm) {
							_this2.eventForm = eventForm;
						}, onSubmit: this.onSubmitForm, className: 'col s12' },
					_react2.default.createElement(
						'h4',
						{ className: 'cols s3 center-align auth-header' },
						'Creation Of Event'
					),
					_react2.default.createElement(_TextField2.default, {
						onInput: this.onChangeTextField,
						value: this.state.event.name,
						placeholder: 'Type event name here',
						label: 'Event name',
						id: 'name',
						errors: this.state.errors,
						autoFocus: true
					}),
					_react2.default.createElement(_TextField2.default, {
						onInput: this.onChangeTextField,
						value: this.state.event.type,
						placeholder: 'Type event type here',
						label: 'Event type (birthday, conference, wedding, etc.)',
						id: 'type',
						errors: this.state.errors,
						list: 'event-types'
					}),
					_react2.default.createElement(_TextField2.default, {
						onInput: this.onChangeTextField,
						value: this.state.event.host,
						placeholder: 'Type host name here',
						label: 'Host (individual\u2019s name or an organization)',
						id: 'host',
						errors: this.state.errors
					}),
					_react2.default.createElement(_DateTimeFields2.default, {
						onChange: this.onChangeDateField,
						getDateObject: this.getDateObject,
						errors: this.state.errors
					}),
					_react2.default.createElement(_GuestsField2.default, {
						onBlur: this.onBlurGuests,
						onFocus: this.onFocusGuests,
						onChangeGuestField: this.onChangeGuestField,
						placeholder: 'Separate guests by pressing ENTER',
						label: 'Guest list (press enter to add guest, click on guest to remove from list)',
						id: 'guests',
						guests: this.state.event.guests,
						errors: this.state.errors
					}),
					_react2.default.createElement(_TextField2.default, {
						onInput: this.onChangeTextField,
						value: this.state.event.location,
						placeholder: 'Type the address of event',
						label: 'Location',
						id: 'location',
						errors: this.state.errors
					}),
					_react2.default.createElement(
						'div',
						{ className: 'row' },
						_react2.default.createElement(
							'div',
							{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
							_react2.default.createElement('textarea', { ref: function ref(messageInput) {
									_this2.messageInput = messageInput;
								}, id: 'message', className: 'materialize-textarea', placeholder: 'Which information do you want to add ?' }),
							_react2.default.createElement(
								'label',
								{ htmlFor: 'message', className: 'active' },
								'Additional information about the event (optional)'
							),
							_react2.default.createElement('div', { ref: function ref(messageError) {
									_this2.messageError = messageError;
								}, className: 'error-msg' })
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'row no-margin-row' },
						_react2.default.createElement('div', { ref: function ref(formErrors) {
								_this2.formErrors = formErrors;
							}, className: 'col s12 m6 l4 push-s0 push-m3 push-l4 error-msg' })
					),
					_react2.default.createElement(
						'div',
						{ className: 'row' },
						_react2.default.createElement(
							'div',
							{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
							_react2.default.createElement(
								'button',
								{ className: 'btn btn-fluid' },
								'Create Event'
							)
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'center-align' },
					_react2.default.createElement(
						_reactRouter.Link,
						{ to: '/events' },
						'Cancel'
					)
				)
			);
		}
	}]);

	return CreateEventForm;
}(_react.Component);

CreateEventForm.propTypes = {
	createEvent: _react.PropTypes.func.isRequired
};

exports.default = CreateEventForm;
});

require.register("src/components/create-event/DateTimeFields.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DateTimeField = function (_Component) {
	_inherits(DateTimeField, _Component);

	function DateTimeField() {
		_classCallCheck(this, DateTimeField);

		return _possibleConstructorReturn(this, (DateTimeField.__proto__ || Object.getPrototypeOf(DateTimeField)).apply(this, arguments));
	}

	_createClass(DateTimeField, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			// initialization of pickadate

			$(this.startDateInput).pickadate({
				onSet: function onSet() {
					var startDate = _this2.startDateInput.value.trim();
					var startTime = _this2.startTimeInput.value.trim();
					var date = _this2.props.getDateObject();

					_this2.props.onChange('startDate', startDate);

					_this2.hideInputError('startDate');
					_this2.hideInputError('startTime');

					if (new Date(date.year, date.month, date.day) > new Date(startDate)) {
						_this2.showInputError('startDate', 'Event cannot be started in the past');
						if (startTime && parseInt(startTime, 10) < new Date().getHours()) {
							_this2.showInputError('startTime', 'Event cannot be started in the past');
						}
					}
					if (new Date(date.year, date.month, date.day).toDateString() === new Date(startDate).toDateString()) {
						if (startTime && parseInt(startTime, 10) < new Date().getHours()) {
							_this2.showInputError('startTime', 'Event cannot be started in the past');
						}
					}
				}
			});

			$(this.endDateInput).pickadate({
				onSet: function onSet() {
					var endDate = _this2.endDateInput.value.trim();
					var endTime = _this2.endTimeInput.value.trim();
					var date = _this2.props.getDateObject();

					_this2.props.onChange('endDate', endDate);

					_this2.hideInputError('endDate');
					_this2.hideInputError('endTime');

					if (new Date(date.year, date.month, date.day) > new Date(endDate)) {
						_this2.showInputError('endDate', 'Event cannot be finished in the past');
					}
					if (new Date(date.year, date.month, date.day).toDateString() === new Date(endDate).toDateString()) {
						if (endTime && parseInt(endTime, 10) < new Date().getHours()) {
							_this2.showInputError('endTime', 'Event cannot be finished in the past');
						}
					}
				}
			});

			$(this.startTimeInput).pickatime({
				format: 'H:i',
				interval: 60,
				onSet: function onSet() {
					var startDate = _this2.startDateInput.value.trim();
					var startTime = _this2.startTimeInput.value.trim();
					var date = _this2.props.getDateObject();

					_this2.props.onChange('startTime', startTime);

					_this2.hideInputError('startTime');

					if (new Date(date.year, date.month, date.day).toDateString() === new Date(startDate).toDateString()) {
						if (parseInt(startTime, 10) < new Date().getHours()) {
							_this2.showInputError('startTime', 'Event cannot be started in the past');
						}
					}
				}
			});

			$(this.endTimeInput).pickatime({
				format: 'H:i',
				interval: 60,
				onSet: function onSet() {
					var startDate = _this2.startDateInput.value.trim();
					var endDate = _this2.endDateInput.value.trim();
					var startTime = _this2.startTimeInput.value.trim();
					var endTime = _this2.endTimeInput.value.trim();

					_this2.props.onChange('endTime', endTime);

					_this2.hideInputError('endTime');

					if (startDate === endDate && startDate && endDate) {
						if (parseInt(startTime, 10) > parseInt(endTime, 10)) {
							_this2.showInputError('endTime', 'End date cannot be lower then start date');
						}
						if (startTime === endTime) {
							_this2.showInputError('endTime', 'Event cannot starts and ends at the same time');
						}
					}
				}
			});
		}
	}, {
		key: 'showInputError',
		value: function showInputError(inputType) {
			var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

			this[inputType + 'Error'].textContent = message;
			this[inputType + 'Input'].classList.add('invalid');
		}
	}, {
		key: 'hideInputError',
		value: function hideInputError(inputType) {
			this[inputType + 'Error'].textContent = '';
			this[inputType + 'Input'].classList.remove('invalid');
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var startDateErr = '';
			var endDateErr = '';
			var startTimeErr = '';
			var endTimeErr = '';

			this.props.errors.forEach(function (err) {
				var type = err.type,
				    msg = err.msg;

				startDateErr = type === 'startDate' ? msg : startDateErr;
				endDateErr = type === 'endDate' ? msg : endDateErr;
				startTimeErr = type === 'startTime' ? msg : startTimeErr;
				endTimeErr = type === 'endTime' ? msg : endTimeErr;
			});
			// console.log(!startDateErr);

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ className: 'row no-margin-row' },
					_react2.default.createElement(
						'div',
						{ className: 'input-field col s6 m3 l2 push-s0 push-m3 push-l4' },
						_react2.default.createElement('input', {
							ref: function ref(startDateInput) {
								_this3.startDateInput = startDateInput;
							},
							placeholder: 'Choose start date',
							id: 'startDate', className: 'datepicker', type: 'date'
						}),
						_react2.default.createElement(
							'label',
							{ htmlFor: 'startDate', className: 'active' },
							'Event start date'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'input-field col s6 m3 l2 push-s0 push-m3 push-l4' },
						_react2.default.createElement('input', {
							ref: function ref(startTimeInput) {
								_this3.startTimeInput = startTimeInput;
							},
							placeholder: 'Choose start time',
							id: 'startTime', className: 'timepicker', type: 'time'
						}),
						_react2.default.createElement(
							'label',
							{ htmlFor: 'startTime', className: 'active' },
							'Event start time'
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					_react2.default.createElement(
						'div',
						{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4 no-margin-col' },
						_react2.default.createElement(
							'div',
							{ ref: function ref(startDateError) {
									_this3.startDateError = startDateError;
								}, className: 'error-msg' },
							startDateErr
						),
						_react2.default.createElement(
							'div',
							{ ref: function ref(startTimeError) {
									_this3.startTimeError = startTimeError;
								}, className: 'error-msg' },
							startTimeErr
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'row no-margin-row' },
					_react2.default.createElement(
						'div',
						{ className: 'input-field col s6 m3 l2 push-s0 push-m3 push-l4' },
						_react2.default.createElement('input', {
							ref: function ref(endDateInput) {
								_this3.endDateInput = endDateInput;
							},
							placeholder: 'Choose end date',
							id: 'endDate', className: 'datepicker', type: 'date'
						}),
						_react2.default.createElement(
							'label',
							{ htmlFor: 'endDate', className: 'active' },
							'Event end date'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'input-field col s6 m3 l2 push-s0 push-m3 push-l4' },
						_react2.default.createElement('input', {
							ref: function ref(endTimeInput) {
								_this3.endTimeInput = endTimeInput;
							},
							placeholder: 'Choose end time',
							id: 'endTime', className: 'timepicker', type: 'time'
						}),
						_react2.default.createElement(
							'label',
							{ htmlFor: 'endTime', className: 'active' },
							'Event end time'
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					_react2.default.createElement(
						'div',
						{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4 no-margin-col' },
						_react2.default.createElement(
							'div',
							{ ref: function ref(endDateError) {
									_this3.endDateError = endDateError;
								}, className: 'error-msg' },
							endDateErr
						),
						_react2.default.createElement(
							'div',
							{ ref: function ref(endTimeError) {
									_this3.endTimeError = endTimeError;
								}, className: 'error-msg' },
							endTimeErr
						)
					)
				)
			);
		}
	}]);

	return DateTimeField;
}(_react.Component);

exports.default = DateTimeField;


DateTimeField.propTypes = {
	onChange: _react.PropTypes.func.isRequired,
	getDateObject: _react.PropTypes.func.isRequired,
	errors: _react.PropTypes.array
};
});

require.register("src/components/create-event/EventTypesDatalist.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var listId = _ref.listId;
	return _react2.default.createElement(
		"datalist",
		{ id: listId },
		_react2.default.createElement("option", { value: "Conference talk" }),
		_react2.default.createElement("option", { value: "Friends meeting" }),
		_react2.default.createElement("option", { value: "Ney Year" }),
		_react2.default.createElement("option", { value: "Christmas" }),
		_react2.default.createElement("option", { value: "Wedding" }),
		_react2.default.createElement("option", { value: "Party" })
	);
};
});

require.register("src/components/create-event/GuestsField.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TextField = require('./TextField');

var _TextField2 = _interopRequireDefault(_TextField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GuestsField = function (_Component) {
	_inherits(GuestsField, _Component);

	function GuestsField(props) {
		_classCallCheck(this, GuestsField);

		var _this = _possibleConstructorReturn(this, (GuestsField.__proto__ || Object.getPrototypeOf(GuestsField)).call(this, props));

		_this.state = {
			guest: ''
		};

		_this.onFocusGuests = _this.onFocusGuests.bind(_this);
		_this.onBlurGuests = _this.onFocusGuests.bind(_this);
		_this.onKeyPressGuests = _this.onKeyPressGuests.bind(_this);
		_this.onInputGuests = _this.onInputGuests.bind(_this);
		return _this;
	}

	_createClass(GuestsField, [{
		key: 'onFocusGuests',
		value: function onFocusGuests() {
			this.props.onFocusGuests();
		}
	}, {
		key: 'onBlurGuests',
		value: function onBlurGuests() {
			this.props.onBlurGuests();
		}
	}, {
		key: 'onInputGuests',
		value: function onInputGuests(evt) {
			this.setState({ guest: evt.target.value });
		}
	}, {
		key: 'onKeyPressGuests',
		value: function onKeyPressGuests(evt) {
			var guestName = this.state.guest;
			if (evt.key === 'Enter' && guestName) {
				this.setState({ guest: '' });
				this.props.onChangeGuestField('add', guestName);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var _props = this.props,
			    guests = _props.guests,
			    onChangeGuestField = _props.onChangeGuestField,
			    inputProps = _objectWithoutProperties(_props, ['guests', 'onChangeGuestField']);

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(_TextField2.default, _extends({
					onKeyPress: this.onKeyPressGuests,
					onBlur: this.onBlurGuests,
					onFocus: this.onFocusGuests,
					onInput: this.onInputGuests,
					value: this.state.guest
				}, inputProps)),
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					_react2.default.createElement(
						'div',
						{
							onClick: function onClick(evt) {
								onChangeGuestField('remove', evt.target.textContent);
							},
							ref: function ref(guestList) {
								_this2.guestList = guestList;
							},
							className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4'
						},
						guests.map(function (guest, i) {
							return _react2.default.createElement(
								'span',
								{ className: 'guest', key: 'guest' + i },
								'\u2022 ',
								_react2.default.createElement(
									'span',
									null,
									guest
								),
								_react2.default.createElement('br', null)
							);
						})
					)
				)
			);
		}
	}]);

	return GuestsField;
}(_react.Component);

exports.default = GuestsField;


GuestsField.propTypes = {
	onFocusGuests: _react.PropTypes.func,
	onBlurGuests: _react.PropTypes.func,
	onChangeGuestField: _react.PropTypes.func,
	guests: _react.PropTypes.array
};
});

require.register("src/components/create-event/TextField.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _EventTypesDatalist = require('./EventTypesDatalist');

var _EventTypesDatalist2 = _interopRequireDefault(_EventTypesDatalist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextInput = function TextInput(props) {
	var id = props.id,
	    label = props.label,
	    errors = props.errors,
	    list = props.list;


	var error = null;
	if (errors.findIndex(function (err) {
		return err.type === id;
	}) > -1) {
		error = errors.filter(function (err) {
			return err.type === id;
		})[0];
	}

	var inputProps = Object.assign({}, props);
	delete inputProps.errors;

	return _react2.default.createElement(
		'div',
		{ className: 'row' },
		_react2.default.createElement(
			'div',
			{ className: 'input-field col s12 m6 l4 push-s0 push-m3 push-l4' },
			_react2.default.createElement('input', _extends({
				type: 'text'
			}, inputProps)),
			_react2.default.createElement(
				'label',
				{ htmlFor: id, className: 'active' },
				label
			),
			list && _react2.default.createElement(_EventTypesDatalist2.default, { listId: list }),
			_react2.default.createElement(
				'div',
				{ className: 'error-msg' },
				error && error.msg
			)
		)
	);
};

TextInput.propTypes = {
	id: _react.PropTypes.string.isRequired,
	label: _react.PropTypes.string.isRequired,
	errors: _react.PropTypes.array.isRequired,
	list: _react.PropTypes.string
};

exports.default = TextInput;
});

require.register("src/index.jsx", function(exports, require, module) {
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _redux = require('redux');

require('pickadate/lib/picker');

require('pickadate/lib/picker.date');

require('pickadate/lib/picker.time');

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _localStorage = require('./middlewares/localStorage');

var _localStorage2 = _interopRequireDefault(_localStorage);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// middlewares


// aditional libraries and styles
var createStoreWithMiddleware = (0, _redux.applyMiddleware)(_localStorage2.default)(_redux.createStore);

// routes

// import 'pickadate/lib/themes/default.css';
// import 'pickadate/lib/themes/default.date.css';
// import 'materialize-css/dist/css/materialize.css';
// import 'materialize-css/dist/js/materialize.min';
// import './css/style.css';

// reducers


(0, _reactDom.render)(_react2.default.createElement(
	_reactRedux.Provider,
	{ store: createStoreWithMiddleware(_reducers2.default) },
	_react2.default.createElement(_reactRouter.Router, { history: _reactRouter.browserHistory, routes: _routes2.default })
), document.getElementById('root'));
});

require.register("src/middlewares/localStorage.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _types = require('./../actions/types');

exports.default = function (_ref) {
	var dispatch = _ref.dispatch;

	return function (next) {
		return function (action) {
			if (action.type !== _types.ADD_EVENT || !action.payload || action.payload.id) {
				return next(action);
			}

			action.payload.id = localStorage.eventIndex ? +localStorage.eventIndex + 1 : 1;

			if (!localStorage.events) {
				localStorage.events = JSON.stringify([]);
			}

			var events = JSON.parse(localStorage.events);
			var currentUser = localStorage.currentUser;

			var userIndex = null;
			for (var i = 0; i < events.length; i++) {
				if ({}.hasOwnProperty.call(events[i], currentUser)) {
					userIndex = i;
					break;
				}
			}

			if (userIndex === null) {
				var obj = {};
				obj[currentUser] = [];
				obj[currentUser].push(action.payload);
				events.push(obj);
			} else {
				events[userIndex][currentUser].push(action.payload);
			}

			localStorage.setItem('events', JSON.stringify(events));
			localStorage.setItem('eventIndex', action.payload.id);

			var newAction = { type: action.type, payload: action.payload };

			// send action to the all middlewares again
			dispatch(newAction);
		};
	};
};
});

require.register("src/reducers/eventReducer.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case _types.FETCH_EVENT:
			return action.payload;
		default:
			return state;
	}
};

var _types = require('./../actions/types');
});

;require.register("src/reducers/eventsReducer.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	var action = arguments[1];

	switch (action.type) {

		case _types.FETCH_EVENTS:
			return [].concat(_toConsumableArray(action.payload));

		case _types.ADD_EVENT:
			return [action.payload].concat(_toConsumableArray(state));

		case _types.DELETE_EVENT:
			var eventIndex = action.payload;
			return [].concat(_toConsumableArray(state.slice(0, eventIndex)), _toConsumableArray(state.slice(eventIndex + 1)));

		default:
			return state;
	}
};

var _types = require('./../actions/types');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
});

;require.register("src/reducers/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _redux = require('redux');

var _eventsReducer = require('./eventsReducer');

var _eventsReducer2 = _interopRequireDefault(_eventsReducer);

var _eventReducer = require('./eventReducer');

var _eventReducer2 = _interopRequireDefault(_eventReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootReducer = (0, _redux.combineReducers)({
	events: _eventsReducer2.default, event: _eventReducer2.default
});

exports.default = rootReducer;
});

require.register("src/routes.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _App = require('./components/App');

var _App2 = _interopRequireDefault(_App);

var _Login = require('./components/Login');

var _Login2 = _interopRequireDefault(_Login);

var _SignUp = require('./components/SignUp');

var _SignUp2 = _interopRequireDefault(_SignUp);

var _EventsList = require('./components/EventsList');

var _EventsList2 = _interopRequireDefault(_EventsList);

var _CreateEvent = require('./components/CreateEvent');

var _CreateEvent2 = _interopRequireDefault(_CreateEvent);

var _Event = require('./components/Event');

var _Event2 = _interopRequireDefault(_Event);

var _NotFound = require('./components/NotFound');

var _NotFound2 = _interopRequireDefault(_NotFound);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createElement(
  _reactRouter.Route,
  { path: '/', component: _App2.default },
  _react2.default.createElement(_reactRouter.IndexRoute, { component: _SignUp2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: '/login', component: _Login2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: '/signup', component: _SignUp2.default }),
  _react2.default.createElement(
    _reactRouter.Route,
    { path: '/events' },
    _react2.default.createElement(_reactRouter.IndexRoute, { component: _EventsList2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: ':eventId', component: _Event2.default })
  ),
  _react2.default.createElement(_reactRouter.Route, { path: '/create-event', component: _CreateEvent2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: '*', component: _NotFound2.default })
);
});

require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window["$"] = require("jquery");


});})();require('___globals___');


//# sourceMappingURL=bundle.js.map