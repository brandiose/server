const express = require("express");
const bp = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
const log = require('./utils/log.js');
const app = express();

const api = {
  user: require('./api/user.js')
}

app.use(bp.json());
app.use(bp.urlencoded({
	extended: true
}));

app.listen(4000, () => {
	log.info("May node be with 4000.");
});

app.get('/', (req, res) => {
 	res.send('Hello World');
});

// *****************
// 	Users
// *****************
app.post('/user', api.user.post);
