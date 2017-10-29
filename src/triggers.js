const actions = require('./actions');
const _ = require('lodash');

let triggers = [ // sorted alphabetically
    playerDies,
    roundEnds
];
module.exports = triggers;

// Helper function, checks if action is implemented/used
function run(action, state) {
    if (action) action(state);
}

/**
 * Each trigger takes the current state, the previous state, and a callback
 * Callbacks should return null if no error
 */

function playerDies(state, prev, cb) {
    if (_.get(state, "player.state.health") == 0 &&
        _.get(prev, "player.state.health") > 0) {
        run(actions.playerDied, state);
    }
    cb(null);
}

function roundEnds(state, prev, cb) {
    if (_.get(state, "round.phase") == "over" &&
        _.get(prev, "round.phase") == "live") {
        run(actions.roundEnded, state);
    }
    cb(null);
}