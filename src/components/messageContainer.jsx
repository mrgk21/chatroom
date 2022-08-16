import React from "react";
import MessageBox from "./messageBox";

const MessageContainer = ({ user, messages }) => {
	return (
		<React.Fragment>
			<div className="msg-container container-fluid">
				{messages.map((msg) => (
					<MessageBox name={user.name} id={user.id} message={msg.payload} align={"end"} />
				))}
			</div>
		</React.Fragment>
	);
};

export default MessageContainer;
