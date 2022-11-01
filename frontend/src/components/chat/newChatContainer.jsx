import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "../common/form";
import GroupTile from "./groupTile";

const { renderInput, renderButton } = new Form();

const NewChatContainer = ({ user }) => {
	const [msgArr, setMsgArr] = useState([]);
	const [groupDetails, setGroupDetails] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState("");

	useEffect(() => {
		const userId = sessionStorage.getItem("user");
		axios.get(`http://localhost:3001/chat/${userId}/group`).then((res) => {
			if (res.status >= 200 && res.status < 300) {
				// const groupIds = JSON.stringify(res.data.map((x) => x.groupId));
				// sessionStorage.setItem("groupIds", groupIds);
				setGroupDetails(res.data);
			}
		});
	}, []);

	useEffect(() => {
		const userId = sessionStorage.getItem("user");
		axios.get(`http://localhost:3001/chat/${userId}/group/${selectedGroup}`).then((res) => {
			if (res.status >= 200 && res.status < 300) {
				setMsgArr(res.data);
			}
		});
	}, [selectedGroup]);

	const handleClick = (id) => {
		setSelectedGroup(id);
	};

	return (
		<React.Fragment>
			<div className="chat-container">
				<div className="sidebar-container">
					<div className="search-container">
						{renderInput("", "text", "searchInput", {
							placeholder: "Search for people or groups",
						})}
						{renderButton("Search", "searchButton")}
					</div>
					<div className="group-list-container">
						{groupDetails.map((group) => {
							const { groupId, picture, groupName, message } = group;
							return (
								<GroupTile
									key={groupId}
									groupId={groupId}
									groupPicture={picture}
									groupName={groupName}
									message={message}
									handleClick={handleClick}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</React.Fragment>
		/* //navbar on top */

		//blank space for top group entry / "such empty, much wow" message
	);
};

export default NewChatContainer;
