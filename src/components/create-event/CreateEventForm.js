import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import TextField from './TextField';
import DateTimeFields from './DateTimeFields';

class CreateEventForm extends Component {
	constructor(props) {
		super(props);

		this.state = { 
			event: {
				name: '',
				host: '',
				location: '',
				type: '',
				startDate: '',
				startTime: '',
				endDate: '',
				endTime: ''
			},
			errors: [],
			focusGuests: false,
			progressWidth: 0
		};

		this.onSubmitForm = this.onSubmitForm.bind(this);
		this.onFocusGuests = this.onFocusGuests.bind(this);
		this.onBlurGuests = this.onBlurGuests.bind(this);
		this.onKeyPressGuests = this.onKeyPressGuests.bind(this);
		this.onFormKeyPress = this.onFormKeyPress.bind(this);
		this.onClickGuestList = this.onClickGuestList.bind(this);
		this.onChangeTextField = this.onChangeTextField.bind(this);
		this.onInputTextField = this.onInputTextField.bind(this);
		this.onChangeDateField = this.onChangeDateField.bind(this);
	}

	componentDidMount() {

		// Initialization of top progress

		const progress = document.querySelector('.progress');

		window.scrollTo(0, 0);

		window.onscroll = () => {
			progress.style.top = `${window.pageYOffset}px`;
		};

		const progressStep = 100 / 10;

		// improve with bubbling, one callback to the form
		// [].forEach.call(this.eventForm, (input) => {
		// 	if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
		// 		input.oninput = () => {
		// 			this.changePropgress(input, progressStep);
		// 		};
		// 		input.onchange = () => {
		// 			this.changePropgress(input, progressStep);
		// 		};
		// 	}
		// });

		// initialization of google address autocomplete
		new google.maps.places.Autocomplete(document.querySelector('input[id="location"]'));
	}

	onClickGuestList(evt) {
		this.guestList.removeChild(evt.target.parentNode);
	}

	onFormKeyPress(evt) {
		if (evt.key === 'Enter' && this.state.focusGuests) {
			evt.preventDefault();
		}
	}

	onFocusGuests() {
		this.setState({ focusGuests: true });
	}

	onBlurGuests(evt) {
		this.setState({ focusGuests: false });
		// if (!this.guestList.children.length) {
		// 	this.showInputError('guests', 'This field is required');
		// }
	}

	onKeyPressGuests(evt) {
		const guestName = this.guestsInput.value;
		if (evt.key === 'Enter' && guestName) {
			const el = document.createElement('span');
			el.innerHTML = `&bull; <span>${guestName}</span><br/>`;
			el.className = 'guest';
			this.guestList.appendChild(el);
			this.guestsInput.value = '';
			this.hideInputError('guests');
		}
	}

	onInputTextField(evt) {
		if (evt.target.value.trim()) {
			this.hideInputError(evt.target.id);
		}
	}

	changePropgress(input, progressStep) {
		if (input.value.length !== 0 && !input.progressChecked) {
			this.setState({ progressWidth: this.state.progressWidth + progressStep });
			input.progressChecked = true;
		}

		if (input.value.length === 0 && input.progressChecked) {
			this.setState({ progressWidth: this.state.progressWidth - progressStep });
			input.progressChecked = false;
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

	getDateObject() {
		const now = new Date();
		return {
			year: now.getFullYear(),
			month: now.getMonth(),
			day: now.getDate()
		};
	}

	onSubmitForm(evt) {
		evt.preventDefault();

		const name = this.state.event.name;
		const type = this.state.event.type;
		const host = this.state.event.host;
		const startDate = this.state.event.startDate;
		const startTime = this.state.event.startTime;
		const endDate = this.state.event.endDate;
		const endTime = this.state.event.endTime;
		const location = this.state.event.location;
		const message = this.messageInput.value.trim();
		const guestsElements = this.guestList.children;

		let errors = [];
		const errors2 = [];

		// collect errors
		if (!name) errors2.push({ type: 'name', msg: 'Please provide event name' });
		if (!type) errors2.push({ type: 'type', msg: 'Please provide event type' });
		if (!host) errors2.push({ type: 'host', msg: 'Please provide event host' });
		if (!startDate) errors2.push({ type: 'startDate', msg: 'Please choose start date of event' });
		if (!startTime) errors2.push({ type: 'startTime', msg: 'Please choose start time of event' });
		if (!endDate) errors2.push({ type: 'endDate', msg: 'Please choose end date of event' });
		if (!endTime) errors2.push({ type: 'endTime', msg: 'Please choose end time of event' });

		if (new Date(startDate) > new Date(endDate)) {
			errors2.push({ type: 'endDate', msg: 'End date cannot be lower then start date' });
		}

		const date = this.getDateObject();
		if (new Date(date.year, date.month, date.day) > new Date(startDate)) {
			errors2.push({ type: 'startDate', msg: 'Event cannot be started in the past' });
		}

		if (new Date(date.year, date.month, date.day).toDateString() === new Date(startDate).toDateString()) {
			if (parseInt(startTime, 10) < new Date().getHours()) {
				errors2.push({ type: 'startTime', msg: 'Event cannot be started in the past' });
			}
		}

		if (startDate === endDate && startDate && endDate) {
			if (parseInt(startTime, 10) > parseInt(endTime, 10)) {
				errors2.push({ type: 'endDate', msg: 'End date cannot be lower then start date' });
			}
			if (startTime === endTime) {
				errors2.push({ type: 'endTime', msg: 'Event cannot starts and ends at the same time' });
			}
		}

		if (!guestsElements.length)	errors.push({ type: 'guests', msg: 'Please add at least one guest to event' });
		if (!location) errors2.push({ type: 'location', msg: 'Please provide event location' });

		if (errors.length > 0) {
			errors.forEach((error) => {
				this.showInputError(error.type, error.msg);
			});
			errors = [];
		}

		if (errors2.length > 0) {
			this.setState({ errors: errors2 });
			// return false;
		}

		// console.log('adding event ...');
		// return false;

		const guests = [];
		for (let i = 0; i < guestsElements.length; i++) {
			guests.push(guestsElements[i].firstElementChild.textContent);
		}
		
		const newEvent = {
			name, type, host, startDate, startTime, endDate, endTime, location, message, guests
		};

		this.props.createEvent(newEvent);
	}

	hideFieldError(fieldType) {
		if (this.state.errors.findIndex(error => error.type === fieldType) > -1) {
			const errors = this.state.errors.filter(error => error.type !== fieldType);
			this.setState({ errors });
		}
	}

	onChangeTextField(evt) {
		this.hideFieldError(evt.target.id);

		const event = this.state.event;
		event[evt.target.id] = evt.target.value;

		this.setState({ event });
	}

	onChangeDateField(type, value) {
		const event = this.state.event;
		event[type] = value;

		this.setState({ event });
	}


	render() {
		const progressStyles = {
			width: `${this.state.progressWidth}%`
		};
		return (
			<div className="row">
				<div className="progress">
					<div className="determinate" style={progressStyles}></div>
				</div>
				<form onKeyPress={this.onFormKeyPress} ref={(eventForm) => { this.eventForm = eventForm; }} onSubmit={this.onSubmitForm} className="col s12">
					<h4 className="cols s3 center-align auth-header">Creation Of Event</h4>

					<TextField 
						onChange={this.onChangeTextField}
						value={this.state.event.name}
						placeholder="Type event name here"
						label="Event name"
						id="name"
						errors={this.state.errors}
						autoFocus
					/>

					<TextField 
						onChange={this.onChangeTextField}
						value={this.state.event.type}
						placeholder="Type event type here"
						label="Event type (birthday, conference, wedding, etc.)"
						id="type"
						errors={this.state.errors}
						list="event-types"
					/>
					
					<TextField 
						onChange={this.onChangeTextField}
						value={this.state.event.host}
						placeholder="Type host name here"
						label="Host (individual’s name or an organization)"
						id="host"
						errors={this.state.errors}
					/>

					<DateTimeFields errors={this.state.errors} onChange={this.onChangeDateField} />

					<div className="row no-margin-row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onKeyPress={this.onKeyPressGuests} onBlur={this.onBlurGuests} onFocus={this.onFocusGuests} ref={(guestsInput) => { this.guestsInput = guestsInput; }} placeholder="Separate guests by pressing ENTER" id="guest-list" type="text" />
							<label htmlFor="guest-list" className="active">Guest list (press enter to add guest, click on guest to remove from list)</label>
							<div ref={(guestsError) => { this.guestsError = guestsError; }} className="error-msg"></div>
						</div>
					</div>

					<div className="row">
						<div onClick={this.onClickGuestList} ref={(guestList) => { this.guestList = guestList; }} className="input-field col s12 m6 l4 push-s0 push-m3 push-l4"></div>
					</div>

					<TextField 
						onChange={this.onChangeTextField}
						value={this.state.event.location}
						placeholder="Type the address of event"
						label="Location"
						id="location"
						errors={this.state.errors}
					/>

					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<textarea ref={(messageInput) => { this.messageInput = messageInput; }} id="message" className="materialize-textarea" placeholder="Which information do you want to add ?"></textarea>
							<label htmlFor="message" className="active">Additional information about the event (optional)</label>
							<div ref={(messageError) => { this.messageError = messageError; }} className="error-msg"></div>
						</div>
					</div>

					<div className="row no-margin-row">
						<div ref={(formErrors) => { this.formErrors = formErrors; }} className="col s12 m6 l4 push-s0 push-m3 push-l4 error-msg"></div>
					</div>
					
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<button className="btn btn-fluid">Create Event</button>
						</div>
					</div>
				</form>
				<div className="center-align">
					<Link to="/events">Cancel</Link>
				</div>
			</div>
		);
	}
}

CreateEventForm.propTypes = {
	createEvent: PropTypes.func.isRequired
};

export default CreateEventForm;