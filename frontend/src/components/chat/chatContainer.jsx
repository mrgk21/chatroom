import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../../services/socketService";
import NavBar from "./navbar";
import MessageContainer from "./messageContainer";
import InputBox from "./inputBox";

const ChatContainer = ({ details }) => {
	const [message, setMessage] = useState([]);
	const [groupDetails, setGroupDetails] = useState([]);

	//complete this after
	useEffect(() => {
		axios.get(`${process.env.REACT_APP_SERVER_URL}/chat/`).then((res) => {
			if (res.status >= 200 && res.status < 300) {
				setMessage(res.data);
			}
		});
	});

	const handleMessageSent = (msg) => {
		messages.push({ from: this.state.user, payload: msg });
	};

	const { user, messages, group: groupName } = details;

	return (
		<div className="app-container">
			<NavBar groupName={groupName} />
			<MessageContainer user={user} messages={messages} />
			<InputBox onMessageSent={handleMessageSent} />
		</div>
	);
};

export default ChatContainer;
