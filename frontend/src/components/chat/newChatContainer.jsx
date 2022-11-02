import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupTile from "./groupTile";
import SearchTile from "./searchTile";

import Form from "../common/form";
const { renderInput, renderButton } = new Form();

const NewChatContainer = ({ user }) => {
	//sidebar states
	const [groupDetails, setGroupDetails] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState({});
	const [userId, setUserID] = useState("");
	const [searchDetails, setSearchDetails] = useState([]);
	const [searchString, setSearchString] = useState("");

	//chatbox states
	const [msgArr, setMsgArr] = useState([]);

	useEffect(() => {
		const userId = sessionStorage.getItem("user");
		axios
			.get(`http://localhost:3001/chat/${userId}/group`)
			.then((res) => {
				if (res.status >= 200 && res.status < 300) {
					setGroupDetails(res.data);
					setUserID(userId);
				}
			})
			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		if (selectedGroup.hasOwnProperty("groupId")) {
			axios
				.get(`http://localhost:3001/chat/${userId}/group/${selectedGroup.groupId}`)
				.then((res) => setMsgArr(res.data))
				.catch((err) => console.log(err));
		}
	}, [selectedGroup]);

	const handleSelectedGroup = (id) => {
		const group = groupDetails.find((detail) => detail.groupId === id);
		setSelectedGroup(group);
	};

	const handleSearch = (e) => {
		const searchStr = e.target.value;
		setSearchString(searchStr);

		if (searchStr) {
			axios
				.get(`http://localhost:3001/chat/${userId}/search/${searchStr}`)
				.then((res) => {
					setSearchDetails(res.data);
					console.log(res);
				})
				.catch((err) => console.log(err));
		}
	};

	const handleEntityAdd = (e, id) => {
		e.preventDefault();

		axios.put(`http://localhost:3001/chat/${userId}/${id}`).then((res) => {
			console.log(res);
		});
	};

	const handleMessageSent = (e) => {
		e.preventDefault();
		const input = e.target["messageInput"].value;
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
					{searchString && (
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
					)}
					{!searchString && (
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
										handleClick={handleSelectedGroup}
									/>
								);
							})}
						</div>
					)}
				</div>
				<div className="group-container">
					<div className="navbar">
						<img src={selectedGroup.picture} alt="group image" />
						<strong>{selectedGroup.groupName}</strong>
					</div>
					<div className="chatbox">
						<div className="message-display">
							{msgArr.map((msg) => (
								<p
									key={msg._id}
									className={`msg ${msg.sender === selectedGroup.message.userName ? "msg-self" : ""}`}
								>{`${msg.sender}: ${msg.content}`}</p>
							))}
						</div>
						<form onSubmit={(e) => handleMessageSent(e)} className="send-message">
							{renderInput("", "text", "messageInput", {
								placeholder: "Type a message...",
							})}
							{renderButton("Send", "send")}
						</form>
					</div>
				</div>
			</div>
		</React.Fragment>
		/* //navbar on top */

		//blank space for top group entry / "such empty, much wow" message
	);
};

export default NewChatContainer;
