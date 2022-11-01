import React from "react";

const GroupTile = ({ groupPicture, groupName, message, groupId, handleClick }) => {
	return (
		<React.Fragment>
			<div className="group-tile" onClick={() => handleClick(groupId)}>
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
