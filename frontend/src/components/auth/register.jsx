import React, { useState } from "react";
import axios from "axios";
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
		axios
			.post("http://localhost:3001/auth/resgister", { auth: inputObj })
			.then(() => {
				setUserInfo({ data: inputObj });
			})
			.catch((err) => {
				const { status, data } = err.response;
				if (status === 400) setUserInfo({ error: data.error });
				console.log(err);
			});
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
					{renderButton("Register", "register")}
				</form>
			</div>
		</React.Fragment>
	);
};

export default Register;
