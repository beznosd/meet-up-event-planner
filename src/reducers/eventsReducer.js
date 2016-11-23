import { ADD_EVENT } from './../actions/types';

const currentUser = localStorage.currentUser;
let events;
if (localStorage.events) {
	events = JSON.parse(localStorage.events);
}

let eventsList = [];
for (let i = 0; i < events.length; i++) {
	console.log(events[i], currentUser);
	if ({}.hasOwnProperty.call(events[i], currentUser)) {
		eventsList = events[i][currentUser].reverse();
		break;
	}
}

// eventsList = [];

export default function(state = eventsList, action) {
	switch (action.type) {
	case ADD_EVENT:
		return [action.payload, ...state];
	default:
		return state;
	}
}