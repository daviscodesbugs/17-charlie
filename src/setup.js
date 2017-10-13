#!/usr/bin/env node
'use srict';

const inquirer = require('inquirer');

let steps = [
	{
		type: "input",
		name: "host_uri",
		message: "Host URI",
		default: "http://localhost"
	}, {
		type: "input",
		name: "port",
		message: "Port",
		default: "3000",
		validate: (input) => {
			return(!isNaN(input));
		}
	}
];

inquirer.prompt(steps).then((vars) => {
	console.log(vars);
});
