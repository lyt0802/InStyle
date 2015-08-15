var morgan = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

module.exports = function(app) { 
    app.use('/static', express.static('public'));

    app.use(morgan('dev'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true})); 
    app.use(session({ secret: 'password', resave: true, saveUninitialized: false}));
    app.use(flash());

    app.locals.pretty = true;
    app.set('views', process.cwd() + '/views'); 
    app.set('view engine', 'jade'); 
};
