import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import eventsReducer from './../../src/reducers/eventsReducer';
import { ADD_EVENT, FETCH_EVENTS, DELETE_EVENT } from './../../src/actions/types';

const event1 = {
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

const event2 = {
	endDate: '21 May, 2016',
	endTime: '10:30',
	guests: ['Vasya', 'Petya'],
	host: 'Burgerking',
	id: 2,
	location: 'New York, Baker Street',
	message: 'We will eat a burger',
	name: 'Friends meeting',
	startDate: '21 May, 2016',
	startTime: '12:00',
	type: 'Friends meeting'
};

describe('eventsReducer', () => {
	it('FETCH_EVENTS, ', () => {
		const eventsList = [event1, event2];

		const action = {
			type: FETCH_EVENTS,
			payload: eventsList
		};

		const stateBefore = [];
		const stateAfter =	eventsList;

		expect(eventsReducer(stateBefore, action)).to.eql(stateAfter);
	});

	it('ADD_EVENT, ', () => {
		let action = {
			type: ADD_EVENT,
			payload: event1
		};

		let stateBefore = [];
		let stateAfter = [event1];

		deepFreeze(stateBefore);
		deepFreeze(action);

		expect(eventsReducer(stateBefore, action)).to.eql(stateAfter);

		action = {
			type: ADD_EVENT,
			payload: event2
		};

		stateBefore = stateAfter;
		stateAfter = [event2, event1];

		deepFreeze(stateBefore);
		deepFreeze(action);

		expect(eventsReducer(stateBefore, action)).to.eql(stateAfter);
	});

	it('DELETE_EVENT, ', () => {
		let action = {
			type: DELETE_EVENT,
			payload: 1
		};

		let stateBefore = [event2, event1];
		let stateAfter = [event2];

		deepFreeze(stateBefore);
		deepFreeze(action);

		expect(eventsReducer(stateBefore, action)).to.eql(stateAfter);

		action = {
			type: DELETE_EVENT,
			payload: 0
		};

		stateBefore = [event1];
		stateAfter = [];

		deepFreeze(stateBefore);
		deepFreeze(action);

		expect(eventsReducer(stateBefore, action)).to.eql(stateAfter);
	});

	it('unknown type', () => {
		const action = {
			type: 'UKNOWN_ACTION',
			payload: 'any value'
		};
		expect(eventsReducer({}, action)).to.eql({});
	});
});


