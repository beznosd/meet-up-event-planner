import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

export default class SignUp extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showAditional: false,
		};

		this.signup = this.signup.bind(this);
		this.checkEmail = this.checkEmail.bind(this);
		this.checkPass = this.checkPass.bind(this);
		this.checkName = this.checkName.bind(this);
		this.checkRepeatPass = this.checkRepeatPass.bind(this);
		this.switchAditionalInputs = this.switchAditionalInputs.bind(this);
		this.showPassRules = this.showPassRules.bind(this);
	}

	checkName() {
		const name = this.nameInput.value.trim();

		if (name && name.length < 2) {
			this.showInputError('name', 'Name should be at least from 2 symbols');
		} else {
			this.hideInputError('name');
		}
	}

	checkEmail() {
		if (!localStorage.users) {
			localStorage.users = JSON.stringify([]);
		}

		const email = this.emailInput.value.trim();
		const users = JSON.parse(localStorage.users);

		if (email && !this.isValidEmail(email)) {
			this.showInputError('email', 'Email is not valid');
		} else if (email && this.isEmailExists(email, users)) {
			this.showInputError('email', 'User with such email is already exists');
		} else {
			this.hideInputError('email');
		}
	}

	checkPass() {
		const pass = this.passInput.value.trim();

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

	checkRepeatPass() {
		const repeatpass = this.repeatPassInput.value.trim();
		const pass = this.passInput.value.trim();

		if (repeatpass && repeatpass !== pass) {
			this.showInputError('repeatPass', 'Passwords do not match');
		} else {
			this.hideInputError('repeatPass');
		}
	}

	showInputError(inputType, message = '') {
		this[`${inputType}Error`].textContent = message;
		this[`${inputType}Input`].classList.add('invalid');
	}

	hideInputError(inputType) {
		this[`${inputType}Error`].textContent = '';
		this[`${inputType}Input`].classList.remove('invalid');
	}

	showPassRules() {
		this.passRules.classList.remove('hide');
	}

	switchAditionalInputs() {
		if (!this.state.showAditional) {
			$('.aditional-info').slideDown(200);
		} else {
			$('.aditional-info').slideUp(200);
		}
		this.setState({ showAditional: !this.state.showAditional });
	}

	signup(evt) {
		evt.preventDefault();

		// required
		const name = this.nameInput.value.trim();
		const email = this.emailInput.value.trim();
		const pass = this.passInput.value.trim();
		const repeatpass = this.repeatPassInput.value.trim();
		// optional
		const job = this.jobInput.value.trim();
		const age = this.ageInput.value.trim();
		const isMarried = this.marriedInput.checked;
		const isChildren = this.childrenInput.checked;
		const isPets = this.petsInput.checked;

		let isError = false;

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
		
		const users = JSON.parse(localStorage.users);

		if (!this.isEmailExists(email, users)) {
			users.push({ name, email, pass, job, age, isMarried, isChildren, isPets });
			localStorage.users = JSON.stringify(users);
			localStorage.currentUser = email;
			browserHistory.push('/events');
		} else {
			this.showInputError('email', 'User with such email is already exists');
		}
	}

	isEmailExists(email, users) {
		let userExists = false;
		users.forEach((user) => {
			if (user.email === email) {
				userExists = true;
			}
		});
		return userExists;
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
							<input onBlur={this.checkName} ref={(nameInput) => { this.nameInput = nameInput; }} placeholder="Type name here" id="name" type="text" autoFocus autoComplete />
							<label htmlFor="name" className="active">Name</label>
							<div ref={(nameError) => { this.nameError = nameError; }} className="error-msg"></div>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onBlur={this.checkEmail} ref={(emailInput) => { this.emailInput = emailInput; }} placeholder="Type email here" id="email" type="email" autoComplete />
							<label htmlFor="email" className="active">Email</label>
							<div ref={(emailError) => { this.emailError = emailError; }} className="error-msg"></div>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onFocus={this.showPassRules} onInput={this.checkPass} ref={(passInput) => { this.passInput = passInput; }} placeholder="Type password here" id="password" type="password" />
							<label htmlFor="password" className="active">
								Password
							</label>
							<div ref={(passRules) => { this.passRules = passRules; }} className="password-rules hide error-msg">
								<div ref={(passRuleLength) => { this.passRuleLength = passRuleLength; }}>Password should be at least from 8 symbols</div>
								<div ref={(passRuleUppercase) => { this.passRuleUppercase = passRuleUppercase; }}>Password should contain uppercase letter</div>
								<div ref={(passRuleSpecial) => { this.passRuleSpecial = passRuleSpecial; }}>Password should contain number or special character</div>
							</div>
							<div ref={(passError) => { this.passError = passError; }} className="error-msg"></div>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onBlur={this.checkRepeatPass} ref={(repeatPassInput) => { this.repeatPassInput = repeatPassInput; }} placeholder="Repeat your password" id="repeat-passwrod" type="password" />
							<label htmlFor="repeat-password" className="active">Repeat Password</label>
							<div ref={(repeatPassError) => { this.repeatPassError = repeatPassError; }} className="error-msg"></div>
						</div>
					</div>

					<div ref={(formError) => { this.formError = formError; }} className="center-align error-msg"></div>
						
					{/* Aditional info switcher */}

					<div className="row no-margin-row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4 center-align no-margin-col">
							<span onClick={this.switchAditionalInputs} className="add-info-signup-link">Fill aditional information</span>
						</div>
					</div>

					{/* Aditional info fields */}

					<div className="aditional-info hidden">
						<div className="row no-margin-row">
							<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
								<input onBlur={this.checkJob} ref={(jobInput) => { this.jobInput = jobInput; }} placeholder="Type your job here" id="job" type="text" autoComplete />
								<label htmlFor="job" className="active">What is your job or occupation?</label>
								<div ref={(jobError) => { this.jobError = jobError; }} className="error-msg hide">Job should be at least from 2 symbols</div>
							</div>
						</div>
						<div className="row no-margin-row">
							<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
								<input onBlur={this.checkAge} ref={(ageInput) => { this.ageInput = ageInput; }} placeholder="Type your age here" id="age" min="1" max="150" type="number" />
								<label htmlFor="age" className="active">How old are you?</label>
								<div ref={(ageError) => { this.ageError = ageError; }} className="error-msg hide">How old are you?</div>
							</div>
						</div>
						<div className="row">
							<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4 no-margin-col">
								<input ref={(marriedInput) => { this.marriedInput = marriedInput; }} type="checkbox" id="married" />
								<label htmlFor="married">Married</label>
							</div>
						</div>
						<div className="row">
							<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4 no-margin-col">
								<input ref={(childrenInput) => { this.childrenInput = childrenInput; }} type="checkbox" id="children" />
								<label htmlFor="children">Have Children</label>
							</div>
						</div>
						<div className="row">
							<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4 no-margin-col">
								<input ref={(petsInput) => { this.petsInput = petsInput; }} type="checkbox" id="pets" />
								<label htmlFor="pets">Have pets</label>
							</div>
						</div>
					</div>
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