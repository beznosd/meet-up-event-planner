import { combineReducers } from 'redux';
import events from './eventsReducer';
import event from './eventReducer';

const rootReducer = combineReducers({
	events, event
});

export default rootReducer;