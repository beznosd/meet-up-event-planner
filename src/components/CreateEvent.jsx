import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

export default class CreateEvent extends Component {
	constructor(props) {
		super(props);

		this.state = { focusGuests: false };

		this.createEvent = this.createEvent.bind(this);
		this.onFocusGuests = this.onFocusGuests.bind(this);
		this.onBlurGuests = this.onBlurGuests.bind(this);
		this.onKeyPressGuests = this.onKeyPressGuests.bind(this);
		this.onFormKeyPress = this.onFormKeyPress.bind(this);
		this.onClickGuestList = this.onClickGuestList.bind(this);
	}

	componentDidMount() {
		$('.datepicker').pickadate();
		$('.timepicker').pickatime({
			format: 'H:i',
			interval: 60
		});
	}

	onClickGuestList(evt) {
		this.guestList.removeChild(evt.nativeEvent.target);
	}

	onFormKeyPress(evt) {
		if (evt.key === 'Enter' && this.state.focusGuests) {
			evt.preventDefault();
		}
	}

	onFocusGuests() {
		this.setState({ focusGuests: true });
	}

	onBlurGuests() {
		this.setState({ focusGuests: false });
	}

	onKeyPressGuests(evt) {
		const guestName = this.guestInput.value;
		if (evt.key === 'Enter' && guestName) {
			const el = document.createElement('span');
			el.innerHTML = `&bull; <span>${guestName}</span><br/>`;
			el.className = 'guest';
			this.guestList.appendChild(el);
			this.guestInput.value = '';
		}
	}

	hideFormErrors() {
		this.formErrors.innerHTML = '';
	}

	showFormErrors(errorMessages) {
		let errorsHtml = '';
		errorMessages.forEach((message) => {
			errorsHtml += `<div>&bull; ${message}</div>\n`;
		});
		this.formErrors.innerHTML = errorsHtml;
	}

	createEvent(evt) {
		evt.preventDefault();

		const errorMessages = [];

		const name = this.nameInput.value;
		const type = this.typeInput.value;
		const host = this.hostInput.value;
		const startDate = this.startDateInput.value;
		const startTime = this.startTimeInput.value;
		const endDate = this.endDateInput.value;
		const endTime = this.endTimeInput.value;
		const location = this.locationInput.value;
		const message = this.messageInput.value;
		const guestsElements = this.guestList.children;

		if (!name) {
			errorMessages.push('Please provide event name');
		}

		if (!type) {
			errorMessages.push('Please provide event type');
		}

		if (!host) {
			errorMessages.push('Please provide event host');
		}

		if (!startDate) {
			errorMessages.push('Please choose start date of event');
		}

		if (!startTime) {
			errorMessages.push('Please choose start time of event');
		}

		if (!endDate) {
			errorMessages.push('Please choose end date of event');
		}

		if (!endTime) {
			errorMessages.push('Please choose end time of event');
		}

		if (new Date(startDate) > new Date(endDate)) {
			errorMessages.push('End date cannot be lower then start date');
		}

		if (startDate === endDate && startDate && endDate) {
			if (parseInt(startTime, 10) > parseInt(endTime, 10)) {
				errorMessages.push('End date cannot be lower then start date');
			}
			if (startTime === endTime) {
				errorMessages.push('Event cannot starts and ends at the same time');
			}
		}

		if (!guestsElements.length) {
			errorMessages.push('Please add at least one guest to event');
		}

		if (!location) {
			errorMessages.push('Please provide event location');
		}

		if (errorMessages.length) {
			this.showFormErrors(errorMessages);
			return false;
		}

		this.hideFormErrors();

		const guests = [];
		for (let i = 0; i < guestsElements.length; i++) {
			guests.push(guestsElements[i].firstElementChild.textContent);
		}
		
		const newEvent = {
			name, type, host, startDate, startTime, endDate, endTime, location, message, guests
		};

		// adding event

		if (!localStorage.events) {
			localStorage.events = JSON.stringify([]);
		}

		const events = JSON.parse(localStorage.events);
		const currentUser = localStorage.currentUser;

		let userIndex = null;
		for (let i = 0; i < events.length; i++) {
			if ({}.hasOwnProperty.call(events[i], currentUser)) {
				userIndex = i;
				break;
			}
		}

		newEvent.id = (localStorage.eventIndex) ? +localStorage.eventIndex + 1 : 1;

		if (userIndex === null) {
			const obj = {};
			obj[currentUser] = [];
			obj[currentUser].push(newEvent);
			events.push(obj);
		} else {
			events[userIndex][currentUser].push(newEvent);
		}
		
		localStorage.setItem('events', JSON.stringify(events));
		localStorage.setItem('eventIndex', newEvent.id);

		browserHistory.push('/events');
	}

	render() {
		return (
			<div className="row">
				<form onKeyPress={this.onFormKeyPress} ref={(eventForm) => { this.eventForm = eventForm; }} onSubmit={this.createEvent} className="col s12">
					<h4 className="cols s3 center-align auth-header">Creation Of Event</h4>

					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input ref={(nameInput) => { this.nameInput = nameInput; }} placeholder="Type event name here" id="name" type="text" />
							<label htmlFor="name" className="active">Event name</label>
						</div>
					</div>

					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input ref={(typeInput) => { this.typeInput = typeInput; }} placeholder="Type event type here" id="type" type="text" />
							<label htmlFor="type" className="active">Event type (birthday, conference, wedding, etc.)</label>
						</div>
					</div>

					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input ref={(hostInput) => { this.hostInput = hostInput; }} placeholder="Type host name here" id="host" type="text" />
							<label htmlFor="host" className="active">Host (individual’s name or an organization)</label>
						</div>
					</div>

					<div className="row">
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
						<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4">
							<input ref={(endDateInput) => { this.endDateInput = endDateInput; }} placeholder="Choose end date" id="end-date" className="datepicker" type="date" />
							<label htmlFor="end-date" className="active">Event end date</label>
						</div>
						<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4">
							<input ref={(endTimeInput) => { this.endTimeInput = endTimeInput; }} placeholder="Choose end time" id="end-time" className="timepicker" type="time" />
							<label htmlFor="end-time" className="active">Event end time</label>
						</div>
					</div>

					<div className="row no-margin-row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input onKeyPress={this.onKeyPressGuests} onBlur={this.onBlurGuests} onFocus={this.onFocusGuests} ref={(guestInput) => { this.guestInput = guestInput; }} placeholder="Separate guests by pressing ENTER" id="guest-list" type="text" />
							<label htmlFor="guest-list" className="active">Guest list (press enter to add, click on guest to remove from list)</label>
						</div>
					</div>

					<div className="row">
						<div onClick={this.onClickGuestList} ref={(guestList) => { this.guestList = guestList; }} className="input-field col s12 m6 l4 push-s0 push-m3 push-l4"></div>
					</div>

					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<input ref={(locationInput) => { this.locationInput = locationInput; }} placeholder="Type the address of event" id="location" type="text" />
							<label htmlFor="location" className="active">Location</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
							<textarea ref={(messageInput) => { this.messageInput = messageInput; }} id="message" className="materialize-textarea" placeholder="Which information do you want to add ?"></textarea>
							<label htmlFor="message" className="active">Additional information about the event (optional)</label>
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