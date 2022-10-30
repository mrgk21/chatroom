import React, { useState } from "react";
import socket from "../../services/socketService";
import { Navigate } from "react-router-dom";

import Form from "../common/form";
const { renderButton, renderInput } = new Form();

const Register = () => {
	const [userInfo, setUserInfo] = useState({ data: {}, error: {} });

	const handleSubmit = async (e) => {
		e.preventDefault();
		let inputObj = {};
		for (const field of e.target) {
			if (field.localName === "input") {
				inputObj[field.name] = field.value;
			}
		}
		try {
			await socket.createInstance("auth").emit("register", inputObj, (val) => {
				const { message, error } = val;
				setUserInfo({ data: inputObj, error });
			});
		} catch (error) {
			console.log("error: ", error);
		}
	};

	if (userInfo.error === undefined) return <Navigate to={"/login"} replace={true} />;

	return (
		<React.Fragment>
			<div className="auth-container">
				<div className="title">Register:</div>
				<span
					className="auth-warning form-warning"
					style={{ visibility: !userInfo.error.hasOwnProperty("general") ? "collapse" : "visible" }}
				>
					{userInfo.error !== undefined ? userInfo.error.general : ""}
				</span>
				<form onSubmit={(e) => handleSubmit(e)}>
					{renderInput("User ID", "text", "user", userInfo.error, {
						placeholder: "Enter userID",
					})}
					{renderInput("Password", "password", "pass", userInfo.error, {
						placeholder: "Enter password",
					})}
					{renderButton("Register", "register")}
				</form>
			</div>
		</React.Fragment>
	);
};

export default Register;
