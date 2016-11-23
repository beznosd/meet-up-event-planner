import { ADD_EVENT } from './types';

export const addEvent = event => {
	return {
		type: ADD_EVENT,
		payload: event
	};
};