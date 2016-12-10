import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import { addEvent } from './../actions';
import CreateEventFrom from './create-event/CreateEventForm';

class CreateEvent extends Component {
	constructor(props) {
		super(props);

		this.createEvent = this.createEvent.bind(this);
	}

	createEvent(newEvent) {
		this.props.addEvent(newEvent);
		browserHistory.push('/events');
	}

	render() {
		return (
			<CreateEventFrom createEvent={this.createEvent} />
		);
	}
}

CreateEvent.propTypes = {
	addEvent: PropTypes.func
};

export default connect(null, { addEvent })(CreateEvent);