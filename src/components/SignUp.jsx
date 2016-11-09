import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

export default class SignUp extends Component {
	constructor(props) {
		super(props);

		this.signup = this.signup.bind(this);
		this.checkEmail = this.checkEmail.bind(this);
		this.checkPass = this.checkPass.bind(this);
		this.checkRepeatPass = this.checkRepeatPass.bind(this);
	}

	checkEmail() {
		const email = this.emailInput.value;

		if (email && !this.isValidEmail(email)) {
			this.showInputError('email');
		} else {
			this.hideInputError('email');
		}
	}

	checkPass() {
		const pass = this.passInput.value;

		if (pass && pass.length < 8) {
			this.showInputError('pass');
		} else {
			this.hideInputError('pass');
		}
	}

	checkRepeatPass() {
		const repeatpass = this.repeatPassInput.value;
		const pass = this.passInput.value;

		if (repeatpass && repeatpass !== pass) {
			this.showInputError('repeatPass');
		} else {
			this.hideInputError('repeatPass');
		}
	}

	showInputError(inputType) {
		this[`${inputType}Error`].classList.remove('hide');
		this[`${inputType}Input`].classList.add('invalid');
	}

	hideInputError(inputType) {
		this[`${inputType}Error`].classList.add('hide');
		this[`${inputType}Input`].classList.remove('invalid');
	}

	showFormError(msg) {
		this.formError.textContent = msg;
	}

	hideFormError() {
		this.formError.textContent = '';
	}

	signup(evt) {
		evt.preventDefault();

		const email = this.emailInput.value;
		const pass = this.passInput.value;
		const repeatpass = this.repeatPassInput.value;

		let isError = false;

		if (!this.isValidEmail(email)) {
			this.showInputError('email');
			isError = true;
		}

		if (pass.length < 8) {
			this.showInputError('pass');
			isError = true;
		}

		if (pass !== repeatpass) {
			this.showInputError('repeatPass');
			isError = true;
		}

		if (isError) {
			return false;
		}

		// check for user existance

		if (!localStorage.users) {
			localStorage.users = JSON.stringify([]);
		}

		let userExists = false;
		
		const users = JSON.parse(localStorage.users);
		users.forEach((user) => {
			if (user.email === email) {
				userExists = true;
			}
		});
				
		if (!userExists) {
			users.push({ email, pass });
			localStorage.users = JSON.stringify(users);
			localStorage.currentUser = email;
			browserHistory.push('/events');
		} else {
			this.showFormError('User with such email is already exists');
		}
		return true;
	}

	isValidEmail(email) {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	render() {
		return (
			<div className="row">
				<form onSubmit={this.signup} className="col s12">
					<h4 className="cols s3 center-align auth-header">Signup</h4>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onBlur={this.checkEmail} ref={(emailInput) => { this.emailInput = emailInput; }} placeholder="Type email here" id="email" type="email" />
							<label htmlFor="email" className="active">Email</label>
							<div ref={(emailError) => { this.emailError = emailError; }} className="error-msg hide">Email is not valid</div>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onBlur={this.checkPass} ref={(passInput) => { this.passInput = passInput; }} placeholder="Type password here" id="password" type="password" />
							<label htmlFor="password" className="active">Password</label>
							<div ref={(passError) => { this.passError = passError; }} className="error-msg hide">Password should be at least from 8 symbols</div>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onBlur={this.checkRepeatPass} ref={(repeatPassInput) => { this.repeatPassInput = repeatPassInput; }} placeholder="Repeat your password" id="repeat-passwrod" type="password" />
							<label htmlFor="repeat-password" className="active">Repeat Password</label>
							<div ref={(repeatPassError) => { this.repeatPassError = repeatPassError; }} className="error-msg hide">Passwords do not match</div>
						</div>
					</div>
					<div ref={(formError) => { this.formError = formError; }} className="center-align error-msg"></div>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<button className="btn btn-fluid">Sign up</button>
						</div>
					</div>
				</form>
				<div className="center-align">
					or <Link to="/login">log in</Link> if you are already have an account
				</div>
			</div>
		);
	}
}