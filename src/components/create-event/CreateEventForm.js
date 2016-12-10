import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import TextField from './TextField';
import GuestsField from './GuestsField';
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
				endTime: '',
				guests: []
			},
			errors: [],
			focusGuests: false,
			progressWidth: 0
		};

		this.progressStep = 10;

		this.onSubmitForm = this.onSubmitForm.bind(this);
		this.onFocusGuests = this.onFocusGuests.bind(this);
		this.onBlurGuests = this.onBlurGuests.bind(this);
		this.onFormKeyPress = this.onFormKeyPress.bind(this);
		this.onChangeTextField = this.onChangeTextField.bind(this);
		this.onChangeDateField = this.onChangeDateField.bind(this);
		this.onChangeGuestField = this.onChangeGuestField.bind(this);
	}

	componentDidMount() {
		// Initialization of top progress
		const progress = document.querySelector('.progress');
		window.scrollTo(0, 0);
		window.onscroll = () => {
			progress.style.top = `${window.pageYOffset}px`;
		};

		// initialization of google address autocomplete
		new google.maps.places.Autocomplete(document.querySelector('input[id="location"]'));
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
		const guests = this.state.event.guests;
		const location = document.getElementById('location').value;
		const message = this.messageInput.value.trim();

		const errors = [];

		// collect errors
		if (!name) errors.push({ type: 'name', msg: 'Please provide event name' });
		if (!type) errors.push({ type: 'type', msg: 'Please provide event type' });
		if (!host) errors.push({ type: 'host', msg: 'Please provide event host' });
		if (!startDate) errors.push({ type: 'startDate', msg: 'Please choose start date of event' });
		if (!startTime) errors.push({ type: 'startTime', msg: 'Please choose start time of event' });
		if (!endDate) errors.push({ type: 'endDate', msg: 'Please choose end date of event' });
		if (!endTime) errors.push({ type: 'endTime', msg: 'Please choose end time of event' });

		if (new Date(startDate) > new Date(endDate)) {
			errors.push({ type: 'endDate', msg: 'End date cannot be lower then start date' });
		}

		const date = this.getDateObject();
		if (new Date(date.year, date.month, date.day) > new Date(startDate)) {
			errors.push({ type: 'startDate', msg: 'Event cannot be started in the past' });
		}

		if (new Date(date.year, date.month, date.day).toDateString() === new Date(startDate).toDateString()) {
			if (parseInt(startTime, 10) < new Date().getHours()) {
				errors.push({ type: 'startTime', msg: 'Event cannot be started in the past' });
			}
		}

		if (startDate === endDate && startDate && endDate) {
			if (parseInt(startTime, 10) > parseInt(endTime, 10)) {
				errors.push({ type: 'endDate', msg: 'End date cannot be lower then start date' });
			}
			if (startTime === endTime) {
				errors.push({ type: 'endTime', msg: 'Event cannot starts and ends at the same time' });
			}
		}

		if (!guests.length)	errors.push({ type: 'guests', msg: 'Please add at least one guest to event' });
		if (!location) errors.push({ type: 'location', msg: 'Please provide event location' });

		if (errors.length > 0) {
			this.setState({ errors });
			return false;
		}
		
		const newEvent = {
			name, type, host, startDate, startTime, endDate, endTime, location, message, guests
		};

		this.props.createEvent(newEvent);
	}

	onChangeTextField(evt) {
		this.hideFieldError(evt.target.id);

		const event = this.state.event;
		event[evt.target.id] = evt.target.value;

		const progressWidth = this.getNewPropgressWidth(this.progressStep);

		this.setState({ event, progressWidth });
	}

	onChangeDateField(type, value) {
		const event = this.state.event;
		event[type] = value;

		const progressWidth = this.getNewPropgressWidth(this.progressStep);

		this.setState({ event, progressWidth });
	}

	onChangeGuestField(eventType, value) {
		this.hideFieldError('guests');

		const event = this.state.event;
		if (eventType === 'add') {
			event.guests.push(value);
		}
		if (eventType === 'remove') {
			event.guests.splice(event.guests.indexOf(value), 1);
		}

		const progressWidth = this.getNewPropgressWidth(this.progressStep);

		this.setState({ event, progressWidth });
	}

	getDateObject() {
		const now = new Date();
		return {
			year: now.getFullYear(),
			month: now.getMonth(),
			day: now.getDate()
		};
	}

	getNewPropgressWidth(progressStep) {
		const event = this.state.event;
		let filledProps = 0;
		for (const prop in event) {
			if (event[prop].length) filledProps++;
		}
		return filledProps * progressStep;
	}

	hideFieldError(fieldType) {
		if (this.state.errors.findIndex(error => error.type === fieldType) > -1) {
			const errors = this.state.errors.filter(error => error.type !== fieldType);
			this.setState({ errors });
		}
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
						onInput={this.onChangeTextField}
						value={this.state.event.name}
						placeholder="Type event name here"
						label="Event name"
						id="name"
						errors={this.state.errors}
						autoFocus
					/>

					<TextField 
						onInput={this.onChangeTextField}
						value={this.state.event.type}
						placeholder="Type event type here"
						label="Event type (birthday, conference, wedding, etc.)"
						id="type"
						errors={this.state.errors}
						list="event-types"
					/>
					
					<TextField 
						onInput={this.onChangeTextField}
						value={this.state.event.host}
						placeholder="Type host name here"
						label="Host (individual’s name or an organization)"
						id="host"
						errors={this.state.errors}
					/>

					<DateTimeFields 
						onChange={this.onChangeDateField} 
						getDateObject={this.getDateObject} 
						errors={this.state.errors} 
					/>

					<GuestsField
						onBlur={this.onBlurGuests}
						onFocus={this.onFocusGuests}
						onChangeGuestField={this.onChangeGuestField}
						placeholder="Separate guests by pressing ENTER"
						label="Guest list (press enter to add guest, click on guest to remove from list)"
						id="guests"
						guests={this.state.event.guests}
						errors={this.state.errors}
					/>

					<TextField 
						onInput={this.onChangeTextField}
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