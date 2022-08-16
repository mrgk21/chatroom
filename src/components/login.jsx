import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import Form from "./form";

class Login extends Form {
	state = {
		user: "",
		pass: "",
	};

	onSubmit = (e) => {
		e.preventDefault();
		console.log(this.state);
		localStorage.setItem(this.state.user, this.state.pass); //encrypt this later with e2e encryption
		<Link to={"chat"} />;
	};

	onChange = ({ target }) => {
		this.setState({ [target.name]: target.value });
	};

	render() {
		return (
			<div className="container">
				<div className="display-4">Login:</div>
				<form onSubmit={this.onLogin}>
					{this.renderInput("User ID", "text", "user", {
						placeholder: "Enter userID",
						className: "form-control",
					})}
					{this.renderInput("Password", "password", "pass", {
						placeholder: "Enter password",
						className: "form-control",
					})}
					{this.renderButton("Login", "login", { className: "btn btn-outline-primary mt-1" })}
				</form>
			</div>
		);
	}
}

export default Login;
