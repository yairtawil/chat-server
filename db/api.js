import * as _ from 'lodash';

const Message = require('./models/Message');
const express = require('express');
const User = require('./models/User');
const mongoose = require('mongoose');
const apiRouter  = express.Router();
let currentUser = null;

mongoose.connect('mongodb://localhost:27017/chat');

mongoose.connection.once("open", function callback(){
    console.log("Connected!");
});

apiRouter.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const age = req.body.age;
    User.findOne({username}, ['_id', 'username', 'age'], (err, findResult) => {
        if(_.isNil(findResult)) {
            User.create({username, password, age}, (err, createResult)=> {
                currentUser = createResult;
                res.json(createResult);
            });
        } else {
            res.sendStatus(400);
        }
    });
});

apiRouter.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username, password}, ['_id', 'username', 'age'], (err, user) => {
        if(err) {
            res.sendStatus(401);
        } else {
            if(_.isNil(user)) {
                res.sendStatus(401);
            } else {
                currentUser = user;
                console.log("currentUser ", currentUser);
                res.json(user);
            }
        }
    });
});

apiRouter.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    User.findOne({_id: userId}, ['_id', 'username', 'age'], (err, user) => {
        if(err) {
            res.sendStatus(401);
        } else {
            if(_.isNil(user)) {
                res.sendStatus(401);
            } else {
                currentUser = user;
                console.log("currentUser ", currentUser);
                res.json(user);
            }
        }
    });
});

apiRouter.get('/:userId/friends', (req, res) => {
    const userId = req.params.userId;
    User.find({_id: {$ne: userId}} , ['_id', 'username', 'age', 'connected'], (err, user) => {
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

apiRouter.get('/:userId/messages/:friendId', (req, res) => {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const limit = req.query.limit || 10;
    const date = req.query.date;
    Message.find({$or: [{from: userId, to: friendId},{to: userId, from: friendId}], date: { $lt: date } })
        .limit(+limit)
        .sort('-date')
        .exec((err, result) => {
            res.json(result.reverse());
        });
});

class UserInstance {
    UpdateConnected(connected) {
        User.update({_id: this.id}, {connected}, (err, res) => {
            console.log("res!!!", res);
        })
    }
    get username() {
        return currentUser.username;
    }
    get id() {
        return currentUser._id;
    }
}

module.exports = {apiRouter, userInstance: new UserInstance()};

