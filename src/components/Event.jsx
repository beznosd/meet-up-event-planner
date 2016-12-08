import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchEvent } from './../actions';

class Event extends Component {
	constructor(props) {
		super(props);
		
		this.props.fetchEvent(this.props.routeParams.eventId);
	}

	render() {
		const event = this.props.event;

		if (Object.keys(event).length === 0) {
			return <div className="center-align">Loading ...</div>;
		}

		return (
			<div className="app-content event-content">
				<h4 className="center-align">&bull; {event.name} &bull;</h4>
				<p><b>Host:</b> {event.host}</p>
				<p><b>Event type:</b> {event.type}</p>
				<p><b>List of guests:</b></p>
				<div>
					{event.guests.map((guest, i) => <div key={i}>{guest}</div>)}
				</div>
				<p><b>Starts:</b> {event.startDate} at {event.startTime}</p>
				<p><b>Ends:</b> {event.endDate} at {event.endTime}</p>
				<p><b>Location:</b> {event.location}</p>
				<p><b>Additional Information:</b> {(event.message) ? event.message : 'no aditional info in this event'}</p>
			</div>
		);
	}
}

Event.propTypes = {
	routeParams: PropTypes.object,
	fetchEvent: PropTypes.func,
	event: PropTypes.object
};

const mapStateToProps = state => {
	return {
		event: state.event
	};
};

export default connect(mapStateToProps, { fetchEvent })(Event);