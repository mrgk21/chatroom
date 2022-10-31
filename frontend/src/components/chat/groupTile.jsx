import React, { Component } from "react";

const GroupTile = ({ groupPicture = "https://picsum.photos/200", groupName = "test group", message }) => {
	return (
		<React.Fragment>
			<div className="group-tile">
				<img src={groupPicture} alt="Group image" />
				<strong>
					{groupName}
					<hr />
				</strong>
				<p>{`Gaurav: Okay`}</p>
			</div>
		</React.Fragment>
	);
};

export default GroupTile;
