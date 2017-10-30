const request = require('request');
const data_stream = require('../rsrc/casual');

const NUM_STEPS = data_stream.length;
console.log("Simulating", NUM_STEPS + "/" + data_stream.length, "steps..." );

let i = 0;
let interval = setInterval(() => {
    sendChunk(data_stream[i], i);
    i += 1;
    if (i >= data_stream.length) clearInterval(interval);
}, 500);

function sendChunk(data, i) {
    let requestURL = "http://localhost:3000";
    let options = {
        method: 'POST',
        url: requestURL,
        json: data,
    };
    request(options, (err, res, body) => {
        if (err) throw err;
        if (res.statusCode != 200) throw res.statusCode;
        console.log(i + 1, res.body);
    });
}