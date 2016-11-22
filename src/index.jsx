import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

import 'pickadate/lib/picker';
import 'pickadate/lib/picker.date';
import 'pickadate/lib/picker.time';
import 'pickadate/lib/themes/default.css';
import 'pickadate/lib/themes/default.date.css';
import 'materialize-css/dist/css/materialize.css';
import 'materialize-css/dist/js/materialize.min';
import './css/style.css';

import routes from './routes';

render(
	<Router history={browserHistory} routes={routes} />,
	document.getElementById('root')
);