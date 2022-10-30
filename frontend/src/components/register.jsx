import React, { useState } from "react";
import socket from "../services/socketService";
import { Navigate } from "react-router-dom";

import Form from "./form";
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

	return (
		<React.Fragment>
			{console.log(userInfo.error === undefined ? true : false)}
			{userInfo.error === undefined ? <Navigate to={"/login"} replace={true} /> : null}
			{/* {userInfo.error !== undefined ? ( */}
			<div className="container">
				<div className="display-4">Register:</div>
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
					{renderButton("Register", "register", { className: "btn btn-outline-primary mt-1" })}
				</form>
			</div>
			{/* ) : null} */}
		</React.Fragment>
	);
};

export default Register;
