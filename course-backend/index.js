const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { greeting } = require("./utils/greeting");
const { loadConfig } = require("./configs/config");
const { DB } = require("./db");
const { dbMiddleware, pickTenant } = require("./middlewares/tenantHandler");
const { tokenParsing } = require("./middlewares/auth");
const route = require("./routes");
const EODService = require("./services/EODService");
// main function
(async () => {
	const conf = loadConfig();
	require("dotenv").config();
	const app = express();
	app.use(cookieParser());

	const db = await DB();

	app.use(cors());
	app.use(dbMiddleware(db));
	app.use(tokenParsing);
	// init tenant picker
	app.use(pickTenant);
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	// parse application/json
	app.use(route);

	const server = http.createServer(app);

	server.listen(conf.app.port, async () => {
		greeting(conf.app.name, conf.app.port);
		setInterval(() => EODService(db), 24 * 60 * 60 * 1000); // Run once a day
	});

	process.on("SIGINT", () => {
		console.log("Shutting down server...");
		server.close(() => {
			console.log("Server closed.");
			process.exit(0);
		});
	});
})();
