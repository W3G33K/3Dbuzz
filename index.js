let $ = require("cheerio"),
	dotenv = require("dotenv"),
	fs = require("fs"),
	path = require("path");

let envConfig = dotenv.config();
if (envConfig.error) {
	console.error(envConfig.error);
}

const THREEDBUZZ_HOME = process.env["3DBUZZ_HOME"];
const THREEDBUZZ_URL = process.env["3DBUZZ_URL"];
fs.readFile(THREEDBUZZ_URL, function(error, data) {
	if (error) {
		console.error(error);
	}

	let html = data.toString();
	let jQ = $.load(html);
	jQ("a").each(function(index, el) {
		let self = jQ(el),
			href = self.attr("href");
		let filename = href.substr(href.lastIndexOf("/") + 1),
			file = path.resolve(THREEDBUZZ_HOME, filename);
		if (fs.existsSync(file) === false) {
			console.error(`${file} does not exist!`);
		}
	});
});
