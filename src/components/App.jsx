import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';

export default class App extends Component {
	logout() {
		localStorage.currentUser = '';
		browserHistory.push('/login');
	}

	render() {
		const location = this.props.location.pathname;
		const rout404 = this.props.routes[1].path === '*';

		// if not authorized, redirect to signup
		if (location !== '/login' && location !== '/signup' && location !== '/' && !rout404) {
			if (!localStorage.currentUser) {
				browserHistory.push('/signup');
			}
		}

		let backIcon = <i onClick={() => browserHistory.goBack()} className="material-icons back-icon small">arrow_back</i>;
		let logoutIcon = <i onClick={this.logout} className="material-icons logout-icon small">exit_to_app</i>;

		if (location === '/login' || location === '/signup' || location === '/' || rout404) {
			logoutIcon = '';
			backIcon = '';
		}

		if (location === '/events') {
			backIcon = '';
		}

		return (
			<div>
				<h2 className="center-align">Meet Up Event Planner</h2>
				{logoutIcon}
				{backIcon}
				{ this.props.children }
			</div>
		);
	}
}

App.propTypes = {
	routes: PropTypes.array,
	children: PropTypes.object,
	location: PropTypes.object
};