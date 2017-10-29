#!/usr/bin/env node
'use strict';

const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');
const applyEach = require('async').applyEach;
const Hapi = require('hapi');

const triggers = require('./triggers');

const DEBUG = false;
let previous;

// Load in config
let config;
try {
    config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
} catch (e) {
    console.log(e);
    process.exit();
}

// Start up server
const server = new Hapi.Server();
server.connection({
    port: config.port,
    host: 'localhost'
});

// Process state
server.route({
    method: 'POST',
    path: '/',
    handler: (req, reply) => {
        processState(req.payload);
        reply('Success');
    }
});

server.start((err) => {
    if (err) throw err;
    console.log(`Server running at: ${server.info.uri}`);
});

function processState(state) {
    applyEach(triggers, state, previous, (err, res) => {
        if (err) throw err;
        if (DEBUG) console.log("All triggers processed");
        previous = state;
    });
};