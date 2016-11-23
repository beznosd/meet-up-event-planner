import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

// aditional libraries and styles
import 'pickadate/lib/picker';
import 'pickadate/lib/picker.date';
import 'pickadate/lib/picker.time';
import 'pickadate/lib/themes/default.css';
import 'pickadate/lib/themes/default.date.css';
import 'materialize-css/dist/css/materialize.css';
import 'materialize-css/dist/js/materialize.min';
import './css/style.css';

// reducers
import reducers from './reducers';

// middlewares
import localStorage from './middlewares/localStorage';

// routes
import routes from './routes';

const createStoreWithMiddleware = applyMiddleware(localStorage)(createStore);

render(
	<Provider store={createStoreWithMiddleware(reducers)}>
		<Router history={browserHistory} routes={routes} />
	</Provider>,
	document.getElementById('root')
);