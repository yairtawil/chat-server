const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const cors = require('cors');
const dbRouter = require('./db/api').apiRouter;
const bodyParser = require('body-parser');
const app = express();
const userInstance = require('./db/api').userInstance;
const Message = require('./db/models/Message');

app.use(cors());
app.use(bodyParser.json());
app.use('/api', dbRouter);

let count = 0;

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

wss.broadcase = (data) => {
    wss.clients.forEach((client) => {
        client.send(data);
    });
};

wss.on('connection', (ws, req) => {
    ws.id = userInstance.id;
    console.log(userInstance.username + 'open');
    userInstance.UpdateConnected(true);

    ws.on('close', () => {
        userInstance.UpdateConnected(false);
        console.log(userInstance.username + ' is Close');
    });

    ws.on('message', (message) => {
        ws.send(message);
        const messageObject = JSON.parse(message);
        switch (messageObject.type) {
            case 'message':
                Message.create({
                    from: messageObject.from,
                    to: messageObject.to,
                    text: messageObject.text,
                    date: messageObject.date
                }, (err, createResult) => {
                    wss.clients.forEach(client => {
                        if (messageObject.to == client.id) {
                            client.send(message);
                        }
                    });
                });
                break;
            case 'typing':
                wss.clients.forEach(client => {
                    if (messageObject.to == client.id) {
                        client.send(message);
                    }
                });
                break;
        }

    });
});

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});