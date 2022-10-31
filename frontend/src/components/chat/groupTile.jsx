import React, { Component } from "react";

const GroupTile = ({ groupPicture = "https://picsum.photos/200", groupName = "test group", message }) => {
	console.log(message);
	return (
		<React.Fragment>
			<div className="group-tile">
				<img src={groupPicture} alt="Group image" />
				<strong>
					{groupName}
					<hr />
				</strong>
				<p>{`${message.userName}: ${message.content}`}</p>
			</div>
		</React.Fragment>
	);
};

export default GroupTile;
