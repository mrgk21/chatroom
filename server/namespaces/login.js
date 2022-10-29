const dbService = require("../services/dbService");

const login = (socket, next) => {
	socket.on("login", (creds, func) => {
		console.log(creds);
		if (creds.user === dbService.getLogin().user) {
			func("logged in");
			next();
		}
		func("login failed");
		const err = new Error("login failed");
		next(err);
	});
};

module.exports = login;
