import React, { PropTypes, Component } from 'react';
import TextField from './TextField';

export default class GuestsField extends Component {
	constructor(props) {
		super(props);

		this.state = {
			guest: ''
		};

		this.onFocusGuests = this.onFocusGuests.bind(this);
		this.onBlurGuests = this.onFocusGuests.bind(this);
		this.onKeyPressGuests = this.onKeyPressGuests.bind(this);
		this.onInputGuests = this.onInputGuests.bind(this);
	}

	onFocusGuests() {
		this.props.onFocusGuests();
	}

	onBlurGuests() {
		this.props.onBlurGuests();
	}

	onInputGuests(evt) {
		this.setState({ guest: evt.target.value });
	}

	onKeyPressGuests(evt) {
		const guestName = this.state.guest;
		if (evt.key === 'Enter' && guestName) {
			this.setState({ guest: '' });
			this.props.onChangeGuestField('add', guestName);
		}
	}

	render() {
		const { guests, onChangeGuestField, ...inputProps } = this.props;
		return (
			<div>
				<TextField
					onKeyPress={this.onKeyPressGuests} 
					onBlur={this.onBlurGuests}
					onFocus={this.onFocusGuests}
					onInput={this.onInputGuests}
					value={this.state.guest}
					{...inputProps}
				/>
				<div className="row">
					<div 
						onClick={(evt) => { onChangeGuestField('remove', evt.target.textContent); }} 
						ref={(guestList) => { this.guestList = guestList; }} 
						className="input-field col s12 m6 l4 push-s0 push-m3 push-l4"
					>
						{guests.map((guest, i) => <span className="guest" key={`guest${i}`}>&bull; <span>{guest}</span><br /></span>)}
					</div>
				</div>
			</div>
		);
	}
}

GuestsField.propTypes = {
	onFocusGuests: PropTypes.func,
	onBlurGuests: PropTypes.func,
	onChangeGuestField: PropTypes.func,
	guests: PropTypes.array
};