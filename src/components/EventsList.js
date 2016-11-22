import React, { Component } from 'react';
import { Link } from 'react-router';

import EventsListItem from './EventsListItem';

export default class Event extends Component {
	constructor(props) {
		super(props);

		this.state = {
			eventsList: this.getEventList()
		};

		this.removeEvent = this.removeEvent.bind(this);
	}

	getEventList() {
		let events = [];
		const currentUser = localStorage.currentUser;
		if (localStorage.events) {
			events = JSON.parse(localStorage.events);
		}

		let eventsList = [];
		for (let i = 0; i < events.length; i++) {
			if ({}.hasOwnProperty.call(events[i], currentUser)) {
				eventsList = events[i][currentUser].reverse();
				break;
			}
		}

		return eventsList;
	}

	removeEvent(eventId) {
		// remove event

		const eventsList = this.state.eventsList;

		let eventIndex = null;
		for (let i = 0; i < eventsList.length; i++) {
			if (eventsList[i].id === eventId) {
				eventIndex = i;
				break;
			}
		}
		eventsList.splice(eventIndex, 1);
		
		// update state

		this.setState({ eventsList });
		
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
						{ (this.state.eventsList.length) 
							? this.state.eventsList.map(event => <EventsListItem key={event.id} removeEvent={() => this.removeEvent(event.id)} {...event} />) 
							: 'You have not created any event yet.'
						}
					</div>
				</div>
			</div>
		);
	}
}