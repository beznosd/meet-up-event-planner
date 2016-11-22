import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
	return (
		<div className="center-align">
			<h4>404 Such page does not exists</h4>
			<h5>
				<Link to="/signup">Sign up</Link> or 
				<Link to="/login"> log in</Link> to app.
			</h5>
		</div>
	);
};

export default NotFound;