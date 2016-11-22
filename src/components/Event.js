import React from 'react';

const Event = (props) => {
	const currentUser = localStorage.currentUser;
	const events = JSON.parse(localStorage.events);
	const eventId = props.routeParams.eventId;
	

	let eventsList = [];
	for (let i = 0; i < events.length; i++) {
		if ({}.hasOwnProperty.call(events[i], currentUser)) {
			eventsList = events[i][currentUser];
			break;
		}
	}

	let event = null;
	for (let i = 0; i < eventsList.length; i++) {
		if (eventsList[i].id === +eventId) {
			event = eventsList[i];
			break;
		}
	}

	return (
		<div className="app-content event-content">
			<h4 className="center-align">&bull; {event.name} &bull;</h4>
			<p><b>Host:</b> {event.host}</p>
			<p><b>Event type:</b> {event.type}</p>
			<p><b>Guests:</b></p>
			<div>
				{event.guests.map((guest, i) => <div key={i}>{guest}</div>)}
			</div>
			<p><b>Starts</b> {event.startDate} at {event.startTime}</p>
			<p><b>Ends</b> {event.endDate} at {event.endTime}</p>
			<p><b>Location:</b> {event.location}</p>
			<p><b>Additional Information:</b> {(event.message) ? event.message : 'no aditional info in this event'}</p>
		</div>
	);
};

Event.propTypes = {
	routeParams: React.PropTypes.object
};

export default Event;