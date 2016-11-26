import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './../src/reducers';

import CreateEvent from './../src/components/CreateEvent';

describe('CreateEvent form', () => {
	let component;

	beforeEach(() => {
		component = render(
			<Provider store={createStore(reducers)}>
				<CreateEvent />
			</Provider>
		);
	});

	it('has a progress', () => {
		expect(component.find('.progress')).to.exists;
		expect(component.find('.determinate')).to.exists;
	});

	it('renders all fields', () => {
		expect(component.find('input')).to.have.length(9);
		expect(component.find('textarea')).to.have.length(1);
		expect(component.find('button')).to.have.length(1);
	});
});