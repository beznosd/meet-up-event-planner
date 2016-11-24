import { ADD_EVENT } from './../actions/types';

export default ({ dispatch }) => {
	return next => action => {
		if (action.type !== ADD_EVENT || !action.payload || action.payload.id) {
			return next(action);
		}

		action.payload.id = (localStorage.eventIndex) ? +localStorage.eventIndex + 1 : 1;

		if (!localStorage.events) {
			localStorage.events = JSON.stringify([]);
		}

		const events = JSON.parse(localStorage.events);
		const currentUser = localStorage.currentUser;

		let userIndex = null;
		for (let i = 0; i < events.length; i++) {
			if ({}.hasOwnProperty.call(events[i], currentUser)) {
				userIndex = i;
				break;
			}
		}

		if (userIndex === null) {
			const obj = {};
			obj[currentUser] = [];
			obj[currentUser].push(action.payload);
			events.push(obj);
		} else {
			events[userIndex][currentUser].push(action.payload);
		}
		
		localStorage.setItem('events', JSON.stringify(events));
		localStorage.setItem('eventIndex', action.payload.id);

		const newAction = { type: action.type, payload: action.payload };

		// send action to the all middlewares again
		dispatch(newAction);
	};
};