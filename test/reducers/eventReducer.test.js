import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import eventReducer from './../../src/reducers/eventReducer';
import { FETCH_EVENT } from './../../src/actions/types';

describe('eventReducer', () => {
	it('handles action with type FETCH_EVENT, ', () => {
		const event = {
			endDate: '26 November, 2016',
			endTime: '20:00',
			guests: ['Joseph', 'Samuel'],
			host: 'Starbucks',
			id: 1,
			location: 'sldkf nlksdn',
			message: 'skjhd fkjsn df',
			name: 'New Event',
			startDate: '26 November, 2016',
			startTime: '19:00',
			type: 'Friends meeting'
		};

		const stateBefore = {};
		const stateAfter = event;

		const action = {
			type: FETCH_EVENT,
			payload: event
		};

		deepFreeze(stateBefore);
		deepFreeze(action);

		expect(eventReducer(stateBefore, action)).to.equal(stateAfter);
	});

	it('handles action with unknown type', () => {
		const action = {
			type: 'UKNOWN_ACTION',
			payload: 'any value'
		};
		expect(eventReducer({}, action)).to.eql({});
	});
});