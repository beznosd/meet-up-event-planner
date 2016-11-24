import { ADD_EVENT, FETCH_EVENTS } from './../actions/types';

export default function(state = [], action) {
	switch (action.type) {
	case ADD_EVENT:
		return [action.payload, ...state];
	case FETCH_EVENTS:
		return [...action.payload];
	default:
		return state;
	}
}