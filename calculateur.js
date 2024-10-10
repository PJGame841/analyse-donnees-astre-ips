const fs = require("fs");

const hypotheses = [
	{
		id: 5,
		answer: "Ensimersion",
		ponderation: 5,
		degree: 2,
	},
	{
		id: 5,
		answer: "EnsimElec",
		ponderation: -5,
		degree: 1,
	},
	{
		id: 9,
		answer: "Oui",
		ponderation: 2,
		degree: 1,
	},
	{
		id: 11,
		answer: "Manuel",
		ponderation: -2,
		degree: 1,
	},
	{
		id: 18,
		answer: "Linux",
		ponderation: 4,
		degree: 1,
	},
	{
		id: 12,
		not_more_than: 4,
		ponderation: -10,
		degree: 1,
	},
	{
		id: 17,
		answer: "Arduino/Raspberry Pi",
		ponderation: -1,
		degree: 1,
	},
	{
		id: 21,
		answer: "Oui",
		ponderation: 1,
		degree: 1,
	},
];

const data = [];

function csvToData(csv) {
	// Return an array of array
	// Each array is a line of the csv
	// When " is found, the next " is the end of the string, even if there is a comma
	const lines = csv.split("\n");
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i];
		const student = [];
		let inString = false;
		let currentString = "";
		for (let j = 0; j < line.length; j++) {
			const char = line[j];
			if (char === '"') {
				inString = !inString;
				if (!inString) {
					student.push(currentString);
					currentString = "";
				}
			} else if (char === "," && !inString) {
				if (line[j - 1] !== '"') {
					student.push(currentString);
					currentString = "";
				}
			} else {
				currentString += char;
			}
		}
		data.push(student);
	}
}

function getAnswer(line, id) {
	return data[line][id];
}

function main() {
	const csv = fs.readFileSync("answers.csv", "utf8");
	csvToData(csv);

	const results = [];

	for (let i = 0; i < data.length; i++) {
		let score = 0;
		if (!data[i][1]) {
			continue;
		}
		for (let j = 0; j < hypotheses.length; j++) {
			const hypothesis = hypotheses[j];
			const answer = getAnswer(i, hypothesis.id);

			console.log(hypothesis.answer ?? hypothesis.not_more_than, "|", answer);
			if (hypothesis.answer && !answer.indexOf(hypothesis.answer)) {
				continue;
			}
			if (
				hypothesis.not_more_than &&
				answer.split(",").length > hypothesis.not_more_than
			) {
				continue;
			}
			score += hypothesis.ponderation * hypothesis.degree;
		}
		results.push({
			student: data[i][1],
			score,
		});
		console.log("Student", data[i][1], "score", score);
	}

	results.sort((a, b) => b.score - a.score);

	return results;
}

module.exports = main;
