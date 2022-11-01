import React from "react";

const SearchTile = ({ isUser, tileDetails, onEntityAdd }) => {
	return (
		<React.Fragment>
			<div className="search-tile">
				<strong>{isUser ? `User: ${tileDetails.name}` : `Group: ${tileDetails.name}`}</strong>
				<button onClick={(e) => onEntityAdd(e, isUser ? tileDetails.userId : tileDetails.groupId)}>+</button>
			</div>
		</React.Fragment>
	);
};

export default SearchTile;
