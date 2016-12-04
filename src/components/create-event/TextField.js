import React, { PropTypes } from 'react';

const TextInput = ({ onChangeTextField, value, id, placeholder, label, errors, autofocus }) => {
	let error = null;
	if (errors.findIndex(err => err.type === id) > -1) {
		error = errors.filter(err => err.type === id)[0];
	}

	return (
		<div className="row">
			<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4">
				<input 
					id={id} 
					type="text" 
					value={value} 
					autoFocus={autofocus} 
					placeholder={placeholder} 
					onChange={onChangeTextField} 
				/>
				<label htmlFor={id} className="active">{label}</label>
				<div className="error-msg">{error && error.msg}</div>
			</div>
		</div>
	);
};

TextInput.propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	errors: PropTypes.array.isRequired,
	placeholder: PropTypes.string.isRequired,
	onChangeTextField: PropTypes.func.isRequired,
	autofocus: PropTypes.bool
};

export default TextInput;