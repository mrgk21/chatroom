import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupTile from "./groupTile";
import SearchTile from "./searchTile";

import Form from "../common/form";
const { renderInput, renderButton } = new Form();

const NewChatContainer = ({ user }) => {
	//sidebar states
	const [groupDetails, setGroupDetails] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState("");
	const [searchDetails, setSearchDetails] = useState([]);
	const [searchString, setSearchString] = useState("");

	//chatbox states
	const [msgArr, setMsgArr] = useState([]);

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
		const searchStr = e.target.value;
		setSearchString(searchStr);
		console.log(searchStr);
		const userId = sessionStorage.getItem("user");
		axios.get(`http://localhost:3001/chat/${userId}/search/${searchStr}`).then((res) => {
			setSearchDetails(res.data);
			console.log(res);
		});
	};

	const handleEntityAdd = (e) => {
		e.preventDefault();
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
					<div className="search-list-container">
						{searchDetails.map((detail) => (
							<SearchTile
								key={detail.hasOwnProperty("userId") ? detail.userId : detail.groupId}
								isUser={detail.hasOwnProperty("userId")}
								tileDetails={detail}
								onEntityAdd={handleEntityAdd}
							/>
						))}
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
