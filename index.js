const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const cors = require('cors');
const dbRouter = require('./db/api');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', dbRouter);

let count = 0 ;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);

    ws.on('message', function incoming(message) {
        ws.send(message + '           yairtawil' + count);
        count = count + 1;
    });
    ws.send('something');
});

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});