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
		axios.get(`${process.env.REACT_APP_SERVER_URL}/user/group`).then((res) => {
			if (res.status >= 200 && res.status < 300) {
				setGroupDetails(res.data);
			}
		});
	}, []);

	useEffect(() => {
		axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${selectedGroup}`).then((res) => {
			if (res.status >= 200 && res.status < 300) {
				setMsgArr(res.data);
			}
		});
	});

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
						{/* {groupDetails.map((group) => (
							<GroupTile groupPicture={group.picture} groupName={group.name} message={group.message} />
						))} */}
						<GroupTile />
					</div>
				</div>
			</div>
		</React.Fragment>
		/* //navbar on top */

		//blank space for top group entry / "such empty, much wow" message
	);
};

export default NewChatContainer;
