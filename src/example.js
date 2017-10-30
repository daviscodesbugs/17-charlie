const _ = require('lodash');
let data = require('../rsrc/casual');

let i = 0;
data.forEach((state) => {
    console.log(i, _.get(state, "round.phase"));
    i += 1;
});