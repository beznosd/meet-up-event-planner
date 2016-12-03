import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';

import { addEvent } from './../actions';

class CreateEvent extends Component {
	constructor(props) {
		super(props);

		this.state = { 
			focusGuests: false,
			progressWidth: 0
		};

		this.createEvent = this.createEvent.bind(this);
		this.onFocusGuests = this.onFocusGuests.bind(this);
		this.onKeyPressGuests = this.onKeyPressGuests.bind(this);
		this.onFormKeyPress = this.onFormKeyPress.bind(this);
		this.onClickGuestList = this.onClickGuestList.bind(this);
		this.onInputTextField = this.onInputTextField.bind(this);
	}

	componentDidMount() {
		// initialization of pickadate

		$(this.startDateInput).pickadate({
			onSet: () => {
				this.hideInputError('startDate');
				this.hideInputError('startTime');
				const startDate = this.startDateInput.value.trim();
				const startTime = this.startTimeInput.value.trim();
				const date = this.getDateObject();
				if (new Date(date.year, date.month, date.day) > new Date(startDate)) {
					this.showInputError('startDate', 'Event cannot be started in the past');
					if (startTime && parseInt(startTime, 10) < new Date().getHours()) {
						this.showInputError('startTime', 'Event cannot be started in the past');
					}
				}
				if (new Date(date.year, date.month, date.day).toDateString() === new Date(startDate).toDateString()) {
					if (startTime && parseInt(startTime, 10) < new Date().getHours()) {
						this.showInputError('startTime', 'Event cannot be started in the past');
					}
				}
			}
		});

		$(this.endDateInput).pickadate({
			onSet: () => {
				this.hideInputError('endDate');
				this.hideInputError('endTime');
				const endDate = this.endDateInput.value.trim();
				const endTime = this.endTimeInput.value.trim();
				const date = this.getDateObject();
				if (new Date(date.year, date.month, date.day) > new Date(endDate)) {
					this.showInputError('endDate', 'Event cannot be finished in the past');
				}
				if (new Date(date.year, date.month, date.day).toDateString() === new Date(endDate).toDateString()) {
					if (endTime && parseInt(endTime, 10) < new Date().getHours()) {
						this.showInputError('endTime', 'Event cannot be finished in the past');
					}
				}
			}
		});

		$(this.startTimeInput).pickatime({
			format: 'H:i',
			interval: 60,
			onSet: () => {
				this.hideInputError('startTime');
				const startDate = this.startDateInput.value.trim();
				const startTime = this.startTimeInput.value.trim();
				const date = this.getDateObject();
				if (new Date(date.year, date.month, date.day).toDateString() === new Date(startDate).toDateString()) {
					if (parseInt(startTime, 10) < new Date().getHours()) {
						this.showInputError('startTime', 'Event cannot be started in the past');
					}
				}
			}
		});

		$(this.endTimeInput).pickatime({
			format: 'H:i',
			interval: 60,
			onSet: () => {
				this.hideInputError('endTime');
				const startDate = this.startDateInput.value.trim();
				const endDate = this.endDateInput.value.trim();
				const startTime = this.startTimeInput.value.trim();
				const endTime = this.endTimeInput.value.trim();
				if (startDate === endDate && startDate && endDate) {
					if (parseInt(startTime, 10) > parseInt(endTime, 10)) {
						this.showInputError('endTime', 'End date cannot be lower then start date');
					}
					if (startTime === endTime) {
						this.showInputError('endTime', 'Event cannot starts and ends at the same time');
					}
				}
			}
		});

		// Initialization of top progress

		const progress = document.querySelector('.progress');

		window.scrollTo(0, 0);

		window.onscroll = () => {
			progress.style.top = `${window.pageYOffset}px`;
		};

		const progressStep = 100 / 10;

		// improve with bubbling, one callback to the form
		[].forEach.call(this.eventForm, (input) => {
			if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
				input.oninput = () => {
					this.changePropgress(input, progressStep);
				};
				input.onchange = () => {
					this.changePropgress(input, progressStep);
				};
			}
		});

		// initialization of google address autocomplete
		new google.maps.places.Autocomplete(this.locationInput);
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

	getDateObject() {
		const now = new Date();
		return {
			year: now.getFullYear(),
			month: now.getMonth(),
			day: now.getDate()
		};
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

	createEvent(evt) {
		
		const name = this.nameInput.value.trim();
		const type = this.typeInput.value.trim();
		const host = this.hostInput.value.trim();
		const startDate = this.startDateInput.value.trim();
		const startTime = this.startTimeInput.value.trim();
		const endDate = this.endDateInput.value.trim();
		const endTime = this.endTimeInput.value.trim();
		const location = this.locationInput.value.trim();
		const message = this.messageInput.value.trim();
		const guestsElements = this.guestList.children;

		evt.preventDefault();
		let isError = false;

		if (!name) {
			this.showInputError('name', 'Please provide event name');
			isError = true;
		}

		if (!type) {
			this.showInputError('type', 'Please provide event type');
			isError = true;
		}

		if (!host) {
			this.showInputError('host', 'Please provide event host');
			isError = true;
		}

		if (!startDate) {
			this.showInputError('startDate', 'Please choose start date of event');
			isError = true;
		}

		if (!startTime) {
			this.showInputError('startTime', 'Please choose start time of event');
			isError = true;
		}

		if (!endDate) {
			this.showInputError('endDate', 'Please choose end date of event');
			isError = true;
		}

		if (!endTime) {
			this.showInputError('endTime', 'Please choose end time of event');
			isError = true;
		}

		if (new Date(startDate) > new Date(endDate)) {
			this.showInputError('endDate', 'End date cannot be lower then start date');
			isError = true;
		}

		const date = this.getDateObject();

		if (new Date(date.year, date.month, date.day) > new Date(startDate)) {
			this.showInputError('startDate', 'Event cannot be started in the past');
			isError = true;
		}
		
		if (new Date(date.year, date.month, date.day).toDateString() === new Date(startDate).toDateString()) {
			if (parseInt(startTime, 10) < new Date().getHours()) {
				this.showInputError('startTime', 'Event cannot be started in the past');
				isError = true;
			}
		}

		if (startDate === endDate && startDate && endDate) {
			if (parseInt(startTime, 10) > parseInt(endTime, 10)) {
				this.showInputError('endDate', 'End date cannot be lower then start date');
				isError = true;
			}
			if (startTime === endTime) {
				this.showInputError('endTime', 'Event cannot starts and ends at the same time');
				isError = true;
			}
		}

		if (!guestsElements.length) {
			this.showInputError('guests', 'Please add at least one guest to event');
			isError = true;
		}

		if (!location) {
			this.showInputError('location', 'Please provide event location');
			isError = true;
		}

		if (isError) {
			return false;
		}

		const guests = [];
		for (let i = 0; i < guestsElements.length; i++) {
			guests.push(guestsElements[i].firstElementChild.textContent);
		}
		
		const newEvent = {
			name, type, host, startDate, startTime, endDate, endTime, location, message, guests
		};

		this.props.addEvent(newEvent);

		browserHistory.push('/events');
	}

	render() {
		const styleProgress = {
			width: `${this.state.progressWidth}%`
		};

		return (
			<div className="row">
				<div className="progress">
					<div className="determinate" style={styleProgress}></div>
				</div>
				<form onKeyPress={this.onFormKeyPress} ref={(eventForm) => { this.eventForm = eventForm; }} onSubmit={this.createEvent} className="col s12">
					<h4 className="cols s3 center-align auth-header">Creation Of Event</h4>

					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onInput={this.onInputTextField} ref={(nameInput) => { this.nameInput = nameInput; }} name="name1" placeholder="Type event name here" id="name" type="text" autoFocus />
							<label htmlFor="name" className="active">Event name</label>
							<div ref={(nameError) => { this.nameError = nameError; }} className="error-msg"></div>
						</div>
					</div>

					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input list="event-types" onInput={this.onInputTextField} ref={(typeInput) => { this.typeInput = typeInput; }} placeholder="Type event type here" id="type" type="text" />
							<label htmlFor="type" className="active">Event type (birthday, conference, wedding, etc.)</label>
							<datalist id="event-types">
								<option value="Conference talk" />
								<option value="Friends meeting" />
								<option value="Ney Year" />
								<option value="Christmas" />
								<option value="Wedding" />
								<option value="Party" />
							</datalist>
							<div ref={(typeError) => { this.typeError = typeError; }} className="error-msg"></div>
						</div>
					</div>

					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onInput={this.onInputTextField} ref={(hostInput) => { this.hostInput = hostInput; }} placeholder="Type host name here" id="host" type="text" />
							<label htmlFor="host" className="active">Host (individual’s name or an organization)</label>
							<div ref={(hostError) => { this.hostError = hostError; }} className="error-msg"></div>
						</div>
					</div>

					<div className="row no-margin-row">
						<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4">
							<input ref={(startDateInput) => { this.startDateInput = startDateInput; }} placeholder="Choose start date" id="start-date" className="datepicker" type="date" />
							<label htmlFor="start-date" className="active">Event start date</label>
						</div>
						<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4">
							<input ref={(startTimeInput) => { this.startTimeInput = startTimeInput; }} placeholder="Choose start time" id="start-time" className="timepicker" type="time" />
							<label htmlFor="start-time" className="active">Event start time</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4 no-margin-col">
							<div ref={(startDateError) => { this.startDateError = startDateError; }} className="error-msg"></div>
							<div ref={(startTimeError) => { this.startTimeError = startTimeError; }} className="error-msg"></div>
						</div>
					</div>
					

					<div className="row no-margin-row">
						<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4">
							<input ref={(endDateInput) => { this.endDateInput = endDateInput; }} placeholder="Choose end date" id="end-date" className="datepicker" type="date" />
							<label htmlFor="end-date" className="active">Event end date</label>
						</div>
						<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4">
							<input ref={(endTimeInput) => { this.endTimeInput = endTimeInput; }} placeholder="Choose end time" id="end-time" className="timepicker" type="time" />
							<label htmlFor="end-time" className="active">Event end time</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4 no-margin-col">
							<div ref={(endDateError) => { this.endDateError = endDateError; }} className="error-msg"></div>
							<div ref={(endTimeError) => { this.endTimeError = endTimeError; }} className="error-msg"></div>
						</div>
					</div>

					<div className="row no-margin-row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onKeyPress={this.onKeyPressGuests} onFocus={this.onFocusGuests} ref={(guestsInput) => { this.guestsInput = guestsInput; }} placeholder="Separate guests by pressing ENTER" id="guest-list" type="text" />
							<label htmlFor="guest-list" className="active">Guest list (press enter to add guest, click on guest to remove from list)</label>
							<div ref={(guestsError) => { this.guestsError = guestsError; }} className="error-msg"></div>
						</div>
					</div>

					<div className="row">
						<div onClick={this.onClickGuestList} ref={(guestList) => { this.guestList = guestList; }} className="input-field col s12 m6 l4 push-s0 push-m3 push-l4"></div>
					</div>

					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onInput={this.onInputTextField} ref={(locationInput) => { this.locationInput = locationInput; }} placeholder="Type the address of event" id="location" type="text" />
							<label htmlFor="location" className="active">Location</label>
							<div ref={(locationError) => { this.locationError = locationError; }} className="error-msg"></div>
						</div>
					</div>
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

CreateEvent.propTypes = {
	addEvent: PropTypes.func
};

export default connect(null, { addEvent })(CreateEvent);