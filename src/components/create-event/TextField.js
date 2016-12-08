import React, { PropTypes } from 'react';
import EventTypesDatalist from './EventTypesDatalist';

const TextInput = (props) => {
	const { id, label, listId, errors } = props;

	let error = null;
	if (errors.findIndex(err => err.type === id) > -1) {
		error = errors.filter(err => err.type === id)[0];
	}

	return (
		<div className="row">
			<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
				<input 
					type="text" 
					{...props}
				/>
				<label htmlFor={id} className="active">{label}</label>
				{listId && <EventTypesDatalist listId={listId} />}
				<div className="error-msg">{error && error.msg}</div>
			</div>
		</div>
	);
};

TextInput.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	errors: PropTypes.array.isRequired,
	listId: PropTypes.string
};

export default TextInput;