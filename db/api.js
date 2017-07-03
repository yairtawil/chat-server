import * as _ from 'lodash';

const express = require('express');
const User = require('./models/User');
const mongoose = require('mongoose');
const apiRouter  = express.Router();

mongoose.connect('mongodb://localhost:27017/chat');

mongoose.connection.once("open", function callback(){
    console.log("Connected!");
});

apiRouter.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const age = req.body.age;
    User.findOne({username}, (err, result) => {
        if(_.isNil(result)) {
            User.create({username, password, age}, (err, result)=> {
                res.json(result);
            });
        } else {
            res.sendStatus(400);
        }
    });
});

apiRouter.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username, password}, (err, user) => {
        if(err) {
            res.sendStatus(401);
        } else {
            if(_.isNil(user)) {
                res.sendStatus(401);
            } else {
                res.json(user);
            }
        }
    });
});

apiRouter.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    User.findOne({_id: userId}, (err, user) => {
        if(err) {
            res.sendStatus(401);
        } else {
            if(_.isNil(user)) {
                res.sendStatus(401);
            } else {
                res.json(user);
            }
        }
    });
});

module.exports = apiRouter;