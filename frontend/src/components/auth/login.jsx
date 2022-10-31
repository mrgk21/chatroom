import axios from "axios";
import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import socket from "../../services/socketService";

import Form from "../common/form";
const { renderInput, renderButton } = new Form();

const Login = () => {
	const [userInfo, setUserInfo] = useState({ data: {}, error: {} });

	const handleSubmit = async (e) => {
		e.preventDefault();
		let inputObj = {};
		for (const field of e.target) {
			if (field.localName === "input") {
				inputObj[field.name] = field.value;
			}
		}
		axios
			.post("http://localhost:3001/auth/login", { auth: inputObj })
			.then(() => {
				setUserInfo({ data: inputObj });
			})
			.catch((err) => {
				const { status, data } = err.response;
				if (status === 400) setUserInfo({ error: data.error });
				console.log(err);
			});
	};

	if (userInfo.error === undefined) return <Navigate to={"/chat"} replace={true} />;

	return (
		<React.Fragment>
			{console.log(userInfo.error === undefined ? true : false)}
			<div className="auth-container">
				<div className="title">Login:</div>
				<span
					className="auth-warning form-warning "
					style={{ visibility: !userInfo.error.hasOwnProperty("general") ? "collapse" : "visible" }}
				>
					{userInfo.error !== undefined ? userInfo.error.general : ""}
				</span>
				<form onSubmit={(e) => handleSubmit(e)}>
					{renderInput(
						"User ID",
						"text",
						"user",
						{
							placeholder: "Enter userID",
						},
						userInfo.error
					)}
					{renderInput(
						"Password",
						"password",
						"pass",
						{
							placeholder: "Enter password",
						},
						userInfo.error
					)}
					{renderButton("Login", "login")}
				</form>
			</div>
		</React.Fragment>
	);
};

export default Login;
