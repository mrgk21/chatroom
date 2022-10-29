import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import socket from "../services/socketService";

import Form from "./form";
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
		try {
			await socket.createInstance("auth").emit("login", inputObj, (val) => {
				const { message, error } = val;
				console.log(error);
				setUserInfo({ data: inputObj, error });
			});
		} catch (error) {
			console.log("error: ", error);
		}
	};

	return (
		<React.Fragment>
			{console.log(userInfo.error === undefined ? true : false)}
			{userInfo.error === undefined ? <Navigate to={"/chat"} replace={true} /> : null}
			<div className="container">
				<div className="display-4">Login:</div>
				<span className="badge fs-5 text-bg-danger">
					{userInfo.error !== undefined ? userInfo.error.general : ""}
				</span>
				<form onSubmit={(e) => handleSubmit(e)}>
					{renderInput("User ID", "text", "user", userInfo.error, {
						placeholder: "Enter userID",
						className: "form-control",
					})}
					{renderInput("Password", "password", "pass", userInfo.error, {
						placeholder: "Enter password",
						className: "form-control",
					})}
					{renderButton("Login", "login", { className: "btn btn-outline-primary mt-1" })}
				</form>
			</div>
		</React.Fragment>
	);
};

export default Login;
