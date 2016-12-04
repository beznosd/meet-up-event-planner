import { 
	ADD_EVENT, 
	FETCH_EVENTS, 
	DELETE_EVENT, 
	FETCH_EVENT 
} from './types';

export const addEvent = event => {
	return {
		type: ADD_EVENT,
		payload: event
	};
};

export const fetchEvents = () => {
	const eventsList = getEventsList();

	return {
		type: FETCH_EVENTS,
		payload: eventsList
	};
};

export const fetchEvent = (eventId) => {
	const eventsList = getEventsList();

	let event = null;
	for (let i = 0; i < eventsList.length; i++) {
		if (eventsList[i].id === +eventId) {
			event = eventsList[i];
			break;
		}
	}

	return {
		type: FETCH_EVENT,
		payload: event
	};
};

export const deleteEvent = (eventIndex) => {
	return {
		type: DELETE_EVENT,
		payload: eventIndex
	};
};

// helper function
const getEventsList = () => {
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

	return eventsList;
};
