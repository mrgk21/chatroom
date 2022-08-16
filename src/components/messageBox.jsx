import React from "react";

const MessageBox = ({ name, id, message, align = "start", options }) => {
	return (
		<React.Fragment>
			<div className={`row justify-content-${align}`}>
				<div className="col-4 mt-2 me-2 ps-2 bg-light border rounded" {...options}>
					<span className="h5 lead">{name} </span>
					<small className="text-muted">#{id}</small>
					<div className="ps-2">{message}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default MessageBox;
