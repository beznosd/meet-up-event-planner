import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { fetchEvents, deleteEvent } from './../actions';

import EventsListItem from './EventsListItem';

class EventsList extends Component {
	constructor(props) {
		super(props);

		this.props.fetchEvents();

		this.removeEvent = this.removeEvent.bind(this);
	}

	removeEvent(eventId) {
		// remove event

		const eventsList = this.props.events;

		let eventIndex = null;
		for (let i = 0; i < eventsList.length; i++) {
			if (eventsList[i].id === eventId) {
				eventIndex = i;
				break;
			}
		}
		eventsList.splice(eventIndex, 1);
		
		// update state, fire action creator

		this.props.deleteEvent(eventIndex);
		
		// update localStorage

		const events = JSON.parse(localStorage.events);
		const currentUser = localStorage.currentUser;

		let userIndex = null;
		for (let i = 0; i < events.length; i++) {
			if ({}.hasOwnProperty.call(events[i], currentUser)) {
				userIndex = i;
				break;
			}
		}
		
		events[userIndex][currentUser] = eventsList;
		localStorage.setItem('events', JSON.stringify(events));
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col s12 m6 l4 push-s0 push-m3 push-l4">
						<Link to="/create-event" className="btn btn-fluid">Create new event</Link>
					</div>
				</div>
				<div className="app-content">
					<h4 className="left-align">Your events list</h4>
					<div className="event-list">
						{ (this.props.events.length) 
							? this.props.events.map(event => <EventsListItem key={event.id} removeEvent={() => this.removeEvent(event.id)} {...event} />) 
							: 'You have not created any event yet.'
						}
					</div>
				</div>
			</div>
		);
	}
}

EventsList.propTypes = {
	events: PropTypes.array,
	fetchEvents: PropTypes.func,
	deleteEvent: PropTypes.func
};

const mapStateToProps = state => {
	return {
		events: state.events
	};
};

export default connect(mapStateToProps, { fetchEvents, deleteEvent })(EventsList);
