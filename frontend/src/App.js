import React from "react";
// import "./App.css";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";
import MessageContainer from "./components/chat/messageContainer";
import NavBar from "./components/chat/navbar";
import InputBox from "./components/chat/inputBox";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import { Route, Routes } from "react-router-dom";

const ChatContainer = ({ details, handleMessageSent }) => {
	console.log(details);
	const { user, messages, group: groupName } = details;
	return (
		<div className="app-container">
			<NavBar groupName={groupName} />
			<MessageContainer user={user} messages={messages} />
			<InputBox onMessageSent={handleMessageSent} />
		</div>
	);
};

class App extends React.Component {
	state = {
		user: { name: "Gaurav K", id: 1234 },
		group: "Group Name OG",
		messages: [
			{
				from: { name: "Gaurav K", id: 1234 },
				payload: "Hello, this is a message",
			},
		],
	};

	handleMessageSent = (msg) => {
		const messages = [...this.state.messages];
		messages.push({ from: this.state.user, payload: msg });
		this.setState({ messages });
	};

	render() {
		const { user, messages, group: groupName } = this.state;
		return (
			<React.Fragment>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route
						path="*"
						element={
							<main>
								<div className="display-4 container-fluid">Invalid Page</div>
							</main>
						}
					/>
					<Route
						path="/chat"
						element={<ChatContainer details={this.state} handleMessageSent={this.handleMessageSent} />}
					/>
				</Routes>
			</React.Fragment>
		);
	}
}

export default App;
