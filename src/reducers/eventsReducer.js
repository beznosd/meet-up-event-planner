import { 
	ADD_EVENT, 
	FETCH_EVENTS, 
	DELETE_EVENT 
} from './../actions/types';

export default function(state = [], action) {
	switch (action.type) {
		
	case FETCH_EVENTS:
		return [...action.payload];

	case ADD_EVENT:
		return [action.payload, ...state];

	case DELETE_EVENT:
		const eventIndex = action.payload;
		return [
			...state.slice(0, eventIndex),
			...state.slice(eventIndex + 1)
		];

	default:
		return state;
	}
}