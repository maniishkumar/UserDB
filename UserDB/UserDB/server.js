'use strict';
//var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var users = require('./Routes/users');

var app = express();
var port = process.env.PORT || 1338;

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json 
app.use(bodyParser.json());
app.use(logger('dev'));


//Initilize routes
app.get('/users', users.findAll);
app.get('/users/:id', users.findById);

app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);
app.delete('/users/:id', users.deleteUser);

//Listening
app.listen(port);
console.log("Server is listening on " + port);

