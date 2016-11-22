import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const EventsListItem = (props) => {
	return (
		<div className="row">
			<div className="card blue-grey darken-1">
				<div className="card-content white-text">
					<span className="card-title">{props.name}</span>
					<p>Starts: {props.startDate} at {props.startTime}</p>
					<p>Ends: {props.endDate} at {props.endTime}</p>
					<p>Location: {props.location}</p>
				</div>
				<div className="card-action right-align">
					<i onClick={props.removeEvent} className="material-icons delete-event-icon">delete</i>
					<Link to={`/events/${props.id}`} className="event-item-link">More details</Link>
				</div>
			</div>
		</div>
	);
};

EventsListItem.propTypes = {
	name: PropTypes.string,
	startDate: PropTypes.string,
	startTime: PropTypes.string,
	endDate: PropTypes.string,
	endTime: PropTypes.string,
	location: PropTypes.string,
	removeEvent: PropTypes.func,
	id: PropTypes.number
};

export default EventsListItem;