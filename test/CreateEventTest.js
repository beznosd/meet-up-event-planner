import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import TestUtils from 'react-addons-test-utils';

import CreateEvent from './../src/components/CreateEvent';

describe('CreateEvent form', () => {
	let component;

	beforeEach(() => {
		component = shallow(<CreateEvent />);
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

	// it('correctly saves the data when submited', () => {
	// 	const evt = {
	// 		preventDefault() {}
	// 	};
	// 	component.find('form').simulate('submit', evt);
	// });
});