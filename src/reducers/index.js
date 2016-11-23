import { combineReducers } from 'redux';
import events from './eventsReducer';

const rootReducer = combineReducers({
	events
});

export default rootReducer;