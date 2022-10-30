const { io } = require("socket.io-client");
const _ = require("lodash");

let openSocketInstances = []; // {namespace: instanceRef}

//do not put / in front of namespace
const createInstance = (namespace) => {
	if (openSocketInstances.find((arrInstance) => arrInstance.namespace === namespace) === undefined) {
		const socket = io(`http://localhost:3001/${namespace}`);
		openSocketInstances.push({ [namespace]: socket });
		return socket;
	}
	console.log("Instance already exists, using" + namespace);
	return openSocketInstances[namespace];
};

const removeInstance = (namespace, func) => {
	const nsp = openSocketInstances.find((arrInstance) => arrInstance[namespace] !== undefined); //find the namespace to remove
	if (nsp !== undefined) {
		openSocketInstances = openSocketInstances.filter((instance) => instance[namespace] !== nsp[namespace]);
		console.log("Removed instance");
		return;
	}
	console.log("Instance does not exist.");
	return;
};

const validate = (namespace, data, cb) => {
	// socket.emit("client-register");
	//add namespaces later
};

module.exports = {
	createInstance,
	useInstance: (namespace) => openSocketInstances[namespace],
	removeInstance,
	validate,
};
