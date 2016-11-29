import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import eventReducer from './../../src/reducers/eventReducer';
import { FETCH_EVENT } from './../../src/actions/types';

describe('eventReducer', () => {
	it('FETCH_EVENT, ', () => {
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

		const action = {
			type: FETCH_EVENT,
			payload: event
		};

		const stateBefore = {};
		const stateAfter = event;

		deepFreeze(stateBefore);
		deepFreeze(action);

		expect(eventReducer(stateBefore, action)).to.equal(stateAfter);
	});

	it('unknown type', () => {
		const action = {
			type: 'UKNOWN_ACTION',
			payload: 'any value'
		};
		expect(eventReducer({}, action)).to.eql({});
	});
});