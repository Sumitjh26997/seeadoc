const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var jwt = require('jsonwebtoken');
const config = require('./app/config');
const routes = require('./app/routes/routes');
const index = require('./app/routes/index');
const port = process.env.PORT || 3000;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', index);

app.use('/api', routes);

app.listen(port);
console.log('Local server running at http://localhost:' + port);

