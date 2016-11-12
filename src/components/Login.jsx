import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.login = this.login.bind(this);
	}

	login(evt) {
		evt.preventDefault();

		const email = this.emailInput.value.trim();
		const pass = this.passInput.value.trim();

		if (!email || !pass) {
			return false;
		}

		if (!localStorage.users) {
			localStorage.users = JSON.stringify([]);
		}

		const users = JSON.parse(localStorage.users);
		
		let success = false;
		for (let i = 0; i < users.length; i++) {
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
		browserHistory.push('/events');
	}

	render() {
		return (
			<div className="row">
				<form onSubmit={this.login} className="col s12">
					<h4 className="cols s3 center-align auth-header">Login</h4>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onBlur={this.checkEmail} ref={(emailInput) => { this.emailInput = emailInput; }} placeholder="Type email here" id="email" type="email" autoFocus autoComplete required />
							<label htmlFor="email" className="active">Email</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onBlur={this.checkPass} ref={(passInput) => { this.passInput = passInput; }} placeholder="Type password here" id="password" type="password" required />
							<label htmlFor="password" className="active">Password</label>
						</div>
					</div>
					<div ref={(formError) => { this.formError = formError; }} className="center-align error-msg"></div>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<button className="btn btn-fluid">Log in</button>
						</div>
					</div>
				</form>
				<div className="center-align">
					or <Link to="/signup">sign up</Link> if you are already have an account
				</div>
			</div>
		);
	}
}