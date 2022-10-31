import React from "react";

class Form extends React.Component {
	renderButton = (label, name, options) => {
		return (
			<button className="form-button" name={name} {...options}>
				{label}
			</button>
		);
	};

	renderInput = (label, type, name, options, error = {}) => {
		return (
			<React.Fragment>
				<label className="form-label" htmlFor={name}>
					{label}
					<span
						className="form-warning"
						style={{ visibility: !error.hasOwnProperty(name) ? "collapse" : "visible" }}
					>
						{error[name]}
					</span>
				</label>
				<input className="form-input" type={type} name={name} {...options} onChange={this.handleChange} />
			</React.Fragment>
		);
	};
}

export default Form;
