#!/usr/bin/env node
'use srict';

const inquirer = require('inquirer');
const pad = require('pad');
const fs = require('fs');
require('urlify').create({
  spaces: "_",
  nonPrintable: "_",
  toLower: true,
  trim: true,
  extendString: true
});

let isNumber = function(num) {
	return !isNaN(num);
};

let steps = [
	{
		type: "input",
		name: "uri",
		message: "Host URI:",
		default: "http://localhost"
	}, 
	inputIntPrompt("port", "Port:", 3000),
	inputFloatPrompt("timeout", "Timeout (sec):", 1.1),
	inputFloatPrompt("buffer", "Buffer (sec):", 0.1),
	inputFloatPrompt("throttle", "Throttle (sec):", 1.1),
	inputFloatPrompt("heartbeat", "Heartbeat (sec):", 60.1),

	// Data ---------------------------
	dataPrompt("provider", "provider"),
	dataPrompt("map", "map"),
	dataPrompt("round", "round"),
	dataPrompt("player_id", "player ID"),
	dataPrompt("allplayers_id", "all player ID"),
	dataPrompt("player_state", "player state"),
	dataPrompt("allplayers_state", "all player state"),
	dataPrompt("allplayers_match_stats", "all player match stat"),
	dataPrompt("allplayers_weapons", "all player weapon"),
	dataPrompt("allplayers_position", "all player position"),
	dataPrompt("phase_countdowns", "phase countdown"),

	{
		type: "input",
		name: "name",
		message: "Configuration name:",
		validate: function (val) { if (val) { return true; } return false; }
	}
];

inquirer.prompt(steps).then((vars) => {
	let file_string = "\"" + vars.name + "\"\n{\n" +
	stringPair("uri", vars.uri + ":" + vars.port, 2) +
	stringPair("timeout", vars.timeout, 2) +
	stringPair("buffer", vars.buffer, 2) +
	stringPair("throttle", vars.throttle, 2) +
	stringPair("heartbeat", vars.heartbeat, 2) +
	"  \"data\"\n  {\n" +
	stringPair("provider", vars.provider ? 1 : 0, 4) + 
	stringPair("map", vars.map ? 1 : 0, 4) + 
	stringPair("round", vars.round ? 1 : 0, 4) + 
	stringPair("player_id", vars.player_id ? 1 : 0, 4) + 
	stringPair("allplayers_id", vars.allplayers_id ? 1 : 0, 4) + 
	stringPair("player_state", vars.player_state ? 1 : 0, 4) + 
	stringPair("allplayers_state", vars.allplayers_state ? 1 : 0, 4) + 
	stringPair("allplayers_match_stats", vars.allplayers_match_stats ? 1 : 0, 4) + 
	stringPair("allplayers_weapons", vars.allplayers_weapons ? 1 : 0, 4) + 
	stringPair("allplayers_position", vars.allplayers_position ? 1 : 0, 4) + 
	stringPair("phase_countdowns", vars.phase_countdowns ? 1 : 0, 4) + 
	"  }\n" +
	"}";

	let filename = "gamestate_integration_" + vars.name.urlify() + ".cfg";
	console.log("Configuration generated: ", filename);
	// console.log(file_string);
	fs.writeFile(filename, file_string, (err) => {
		if(err) throw err;
		else console.log(`Successfully written to file ${filename} in base directory.`);
	});
});

function dataPrompt(name, message_name) {
	return {
		type: "confirm",
		name: name,
		message: "Send " + message_name + " data?"
	};
}

function inputIntPrompt(name, message, default_val) {
	return inputPrompt(name, message, default_val, parseInt);
}

function inputFloatPrompt(name, message, default_val) {
	return inputPrompt(name, message, default_val, parseFloat);
}

function inputPrompt(name, message, default_val, filter) {
	return {
		type: "input",
		name: name,
		message: message,
		default: default_val,
		validate: isNumber,
		filter: filter
	};
}

function stringPair(key, value, indent) {
	const LONGEST_KEY = 23;
	indent = new Array(indent + 1).join(" ");
	return indent + "\"" + pad(key + "\"", LONGEST_KEY) + " \"" + value + "\"\n";
}
