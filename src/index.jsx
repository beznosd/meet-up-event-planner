import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import 'pickadate/lib/picker';
import 'pickadate/lib/picker.date';
import 'pickadate/lib/picker.time';
import 'pickadate/lib/themes/default.css';
import 'pickadate/lib/themes/default.date.css';
import 'materialize-css/dist/css/materialize.css';
import 'materialize-css/dist/js/materialize.min';
import './css/style.css';

import App from './components/App';
import Login from './components/Login';
import SignUp from './components/SignUp';
import EventsList from './components/EventsList';
import CreateEvent from './components/CreateEvent';
import Event from './components/Event';
import NotFound from './components/NotFound';

render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={SignUp} />
			<Route path="/login" component={Login} />
			<Route path="/signup" component={SignUp} />
			<Route path="/events">
				<IndexRoute component={EventsList} />
				<Route path=":eventId" component={Event} />
			</Route>
			<Route path="/create-event" component={CreateEvent} />
			<Route path="*" component={NotFound} />
		</Route>
	</Router>,
	document.getElementById('root')
);