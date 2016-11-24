import { ADD_EVENT, FETCH_EVENTS } from './types';

export const addEvent = event => {
	return {
		type: ADD_EVENT,
		payload: event
	};
};

export const fetchEvents = () => {
	const currentUser = localStorage.currentUser;
	let events = [];
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

	return {
		type: FETCH_EVENTS,
		payload: eventsList
	};
};