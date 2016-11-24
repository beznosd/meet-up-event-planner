import { FETCH_EVENT } from './../actions/types';

export default function(state = {}, action) {
	switch (action.type) {
	case FETCH_EVENT:
		return action.payload;
	default:
		return state;
	}
}