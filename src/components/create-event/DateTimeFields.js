import React, { Component, PropTypes } from 'react';

export default class DateTimeField extends Component {
	
	componentDidMount() {
		// initialization of pickadate

		$(this.startDateInput).pickadate({
			onSet: () => {
				const startDate = this.startDateInput.value.trim();
				const startTime = this.startTimeInput.value.trim();
				const date = this.props.getDateObject();

				this.props.onChange('startDate', startDate);

				this.hideInputError('startDate');
				this.hideInputError('startTime');

				if (new Date(date.year, date.month, date.day) > new Date(startDate)) {
					this.showInputError('startDate', 'Event cannot be started in the past');
					if (startTime && parseInt(startTime, 10) < new Date().getHours()) {
						this.showInputError('startTime', 'Event cannot be started in the past');
					}
				}
				if (new Date(date.year, date.month, date.day).toDateString() === new Date(startDate).toDateString()) {
					if (startTime && parseInt(startTime, 10) < new Date().getHours()) {
						this.showInputError('startTime', 'Event cannot be started in the past');
					}
				}
			}
		});

		$(this.endDateInput).pickadate({
			onSet: () => {
				const endDate = this.endDateInput.value.trim();
				const endTime = this.endTimeInput.value.trim();
				const date = this.props.getDateObject();
				
				this.props.onChange('endDate', endDate);
				
				this.hideInputError('endDate');
				this.hideInputError('endTime');
				
				if (new Date(date.year, date.month, date.day) > new Date(endDate)) {
					this.showInputError('endDate', 'Event cannot be finished in the past');
				}
				if (new Date(date.year, date.month, date.day).toDateString() === new Date(endDate).toDateString()) {
					if (endTime && parseInt(endTime, 10) < new Date().getHours()) {
						this.showInputError('endTime', 'Event cannot be finished in the past');
					}
				}
			}
		});

		$(this.startTimeInput).pickatime({
			format: 'H:i',
			interval: 60,
			onSet: () => {
				const startDate = this.startDateInput.value.trim();
				const startTime = this.startTimeInput.value.trim();
				const date = this.props.getDateObject();
				
				this.props.onChange('startTime', startTime);

				this.hideInputError('startTime');
				
				if (new Date(date.year, date.month, date.day).toDateString() === new Date(startDate).toDateString()) {
					if (parseInt(startTime, 10) < new Date().getHours()) {
						this.showInputError('startTime', 'Event cannot be started in the past');
					}
				}
			}
		});

		$(this.endTimeInput).pickatime({
			format: 'H:i',
			interval: 60,
			onSet: () => {
				const startDate = this.startDateInput.value.trim();
				const endDate = this.endDateInput.value.trim();
				const startTime = this.startTimeInput.value.trim();
				const endTime = this.endTimeInput.value.trim();
				
				this.props.onChange('endTime', endTime);
				
				this.hideInputError('endTime');
				
				if (startDate === endDate && startDate && endDate) {
					if (parseInt(startTime, 10) > parseInt(endTime, 10)) {
						this.showInputError('endTime', 'End date cannot be lower then start date');
					}
					if (startTime === endTime) {
						this.showInputError('endTime', 'Event cannot starts and ends at the same time');
					}
				}
			}
		});
	}

	showInputError(inputType, message = '') {
		this[`${inputType}Error`].textContent = message;
		this[`${inputType}Input`].classList.add('invalid');
	}

	hideInputError(inputType) {
		this[`${inputType}Error`].textContent = '';
		this[`${inputType}Input`].classList.remove('invalid');
	}

	render() {
		let startDateErr = '';
		let endDateErr = '';
		let startTimeErr = ''; 
		let endTimeErr = '';

		this.props.errors.forEach(err => {
			const { type, msg } = err;
			startDateErr = (type === 'startDate') ? msg : startDateErr;
			endDateErr = (type === 'endDate') ? msg : endDateErr;
			startTimeErr = (type === 'startTime') ? msg : startTimeErr;
			endTimeErr = (type === 'endTime') ? msg : endTimeErr;
		});
		// console.log(!startDateErr);

		return (
			<div>
				<div className="row no-margin-row">
					<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4">
						<input 
							ref={(startDateInput) => { this.startDateInput = startDateInput; }} 
							placeholder="Choose start date" 
							id="startDate" className="datepicker" type="date" 
						/>
						<label htmlFor="startDate" className="active">Event start date</label>
					</div>
					<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4">
						<input 
							ref={(startTimeInput) => { this.startTimeInput = startTimeInput; }} 
							placeholder="Choose start time" 
							id="startTime" className="timepicker" type="time" 
						/>
						<label htmlFor="startTime" className="active">Event start time</label>
					</div>
				</div>

				<div className="row">
					<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4 no-margin-col">
						<div ref={(startDateError) => { this.startDateError = startDateError; }} className="error-msg">
							{startDateErr}
						</div>
						<div ref={(startTimeError) => { this.startTimeError = startTimeError; }} className="error-msg">
							{startTimeErr}
						</div>
					</div>
				</div>
				

				<div className="row no-margin-row">
					<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4">
						<input 
							ref={(endDateInput) => { this.endDateInput = endDateInput; }} 
							placeholder="Choose end date" 
							id="endDate" className="datepicker" type="date"
						/>
						<label htmlFor="endDate" className="active">Event end date</label>
					</div>
					<div className="input-field col s6 m3 l2 push-s0 push-m3 push-l4">
						<input 
							ref={(endTimeInput) => { this.endTimeInput = endTimeInput; }} 
							placeholder="Choose end time" 
							id="endTime" className="timepicker" type="time" 
						/>
						<label htmlFor="endTime" className="active">Event end time</label>
					</div>
				</div>

				<div className="row">
					<div className="input-field col s12 m6 l4 push-s0 push-m3 push-l4 no-margin-col">
						<div ref={(endDateError) => { this.endDateError = endDateError; }} className="error-msg">
							{endDateErr}
						</div>
						<div ref={(endTimeError) => { this.endTimeError = endTimeError; }} className="error-msg">
							{endTimeErr}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

DateTimeField.propTypes = {
	onChange: PropTypes.func.isRequired,
	getDateObject: PropTypes.func.isRequired,
	errors: PropTypes.array
};