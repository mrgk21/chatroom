import React, { Component } from "react";
import Form from "./form";

class Register extends Form {
	state = {
		user: "",
		pass: "",
	};

	onRegister = (e) => {
		e.preventDefault();
		//send to server for validating logins info
		console.log(this.state);
	};

	render() {
		return (
			<div className="container">
				<div className="display-4">Register:</div>
				<form onSubmit={this.onRegister}>
					{this.renderInput("User ID", "text", "user", {
						placeholder: "Enter userID",
						className: "form-control",
					})}
					{this.renderInput("Password", "password", "pass", {
						placeholder: "Enter password",
						className: "form-control",
					})}
					{this.renderButton("Click to register", "register", { className: "btn btn-outline-primary mt-1" })}
				</form>
			</div>
		);
	}
}

export default Register;
