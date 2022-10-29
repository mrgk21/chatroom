import React from "react";

class Form extends React.Component {
	renderButton = (label, name, options) => {
		return (
			<button name={name} {...options}>
				{label}
			</button>
		);
	};

	renderInput = (label, type, name, error = "", options) => {
		return (
			<React.Fragment>
				<label htmlFor={name}>{label}</label>
				<span className="badge ms-2 text-bg-danger">{error[name]}</span>
				<input type={type} name={name} {...options} onChange={this.handleChange} />
			</React.Fragment>
		);
	};
}

export default Form;
