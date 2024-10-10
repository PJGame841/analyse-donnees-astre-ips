const express = require("express");
const fs = require("fs");
const calculate = require("./calculateur");

const app = express();

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/interface.html");
});

app.get("/questions", (req, res) => {
	const questions = JSON.parse(fs.readFileSync("questions.json"));

	res.send(questions);
});

app.get("/hypotheses", (req, res) => {
	const config = JSON.parse(fs.readFileSync("config.json"));

	res.send(config);
});

app.put("/hypotheses", (req, res) => {
	// Update config.json

	res.send("OK");
});

app.get("/results", (req, res) => {
	const results = calculate();
	res.send(results);
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
