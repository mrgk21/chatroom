import React from "react";
import { Link } from "react-router-dom";

class Form extends React.Component {
	state = {
		user: "",
		login: "",
	};

	onChange = ({ target }) => {
		this.setState({ [target.name]: target.value });
	};

	validateInput = () => {
		//validate data from server with this.state
		this.onSubmit();
	};

	renderButton = (label, name, options) => {
		return (
			<button name={name} onSubmit={this.validateInput} {...options}>
				{label}
			</button>
		);
	};

	renderInput = (label, type, name, options) => {
		return (
			<React.Fragment>
				<label htmlFor={name}>{label}</label>
				<input type={type} name={name} {...options} onChange={this.onChange} />
			</React.Fragment>
		);
	};
}

export default Form;
