import React, { useRef, useState } from "react";

const InputBox = ({ onMessageSent }) => {
	const [input, setInput] = useState("");
	const inputRef = useRef(null);

	const handleChange = (event) => {
		event.preventDefault();
		setInput(event.target.value);
	};

	const handleSubmit = (event) => {
		//send data to server for messaging
		console.log(input);
		if (input) onMessageSent(input);
	};

	const handleKeyDown = (event) => {
		if (event.keyCode == 13) {
			inputRef.current.value = "";
			setInput("");
			handleSubmit(event);
		}
	};

	return (
		<React.Fragment>
			<div className="input-box">
				<div className="input-group mb-2 mt-2">
					<input
						ref={inputRef}
						className="form-control"
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						tabIndex="0"
					/>
					<button className="btn btn-secondary" onClick={handleSubmit}>
						Send
					</button>
				</div>
			</div>
		</React.Fragment>
	);
};

export default InputBox;
