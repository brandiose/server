const express = require("express");
const bp = require('body-parser');
const moment = require('moment');
const ObjectId = require('mongodb').ObjectID;
const db = require('./utils/db.js');
const log = require('./utils/log.js');
const app = express();

app.use(bp.json());
app.use(bp.urlencoded({
	extended: true
}));

app.listen(4000, function() {
	log.info("May node be with 4000.");
});

app.get('/', function(req, res) {
 	res.send('Hello World');
});
