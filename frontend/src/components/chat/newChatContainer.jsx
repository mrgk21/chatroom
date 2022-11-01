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
				setGroupDetails(res.data);
			}
		});
	}, []);

	useEffect(() => {
		console.log("axios 2 called");
		const userId = sessionStorage.getItem("user");
		axios.get(`http://localhost:3001/chat/${userId}/group/${selectedGroup}`).then((res) => {
			if (res.status >= 200 && res.status < 300) {
				setMsgArr(res.data);
			}
		});
	}, [selectedGroup]);

	const handleSearch = (e) => {
		console.log("called");
		// e.preventDefault();
		const searchString = e.target.value;

		axios.get(`http://localhost:3001/chat/search/${searchString}`).then((res) => console.log(res));
	};

	return (
		<React.Fragment>
			<div className="chat-container">
				<div className="sidebar-container">
					<div className="search-container">
						{renderInput("", "text", "searchInput", {
							placeholder: "Search for people or groups",
							onChange: handleSearch,
						})}
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
									handleClick={(id) => setSelectedGroup(id)}
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
