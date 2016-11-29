import { expect } from 'chai';
import { addEvent, fetchEvents, fetchEvent, deleteEvent } from './../../src/actions';
import { ADD_EVENT, FETCH_EVENTS, DELETE_EVENT } from './../../src/actions/types';

const event = {
	endDate: '26 November, 2016',
	endTime: '20:00',
	guests: ['Joseph', 'Samuel'],
	host: 'Starbucks',
	id: 1,
	location: 'Phoenix, China avenue',
	message: 'We will drink a coffee',
	name: 'Coffee conference',
	startDate: '26 November, 2016',
	startTime: '19:00',
	type: 'Conference'
};

describe('Action Creators', () => {
	it('addEvent', () => {
		const validAction = {
			type: ADD_EVENT,
			payload: event
		};
		expect(addEvent(event)).to.eql(validAction);
	});

	it('deleteEvent', () => {
		const validAction = {
			type: DELETE_EVENT,
			payload: 1
		};
		expect(deleteEvent(1)).to.eql(validAction);
	});
});