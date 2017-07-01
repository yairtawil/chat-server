const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();
let count = 0 ;

app.use(function (req, res) {
    res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', function incoming(message) {
        ws.send(message + '           yairtawil' + count);
        count = count + 1;
    });

    ws.send('something');
});

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});