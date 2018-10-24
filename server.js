const express = require("express");
const bp = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
const log = require('./utils/log.js');
const app = express();

const api = {
  user: require('./api/user.js'),
  brand: require('./api/brand.js'),
  stack: require('./api/stack.js'),
  contact: require('./api/contact.js')
};

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
app.get('/user', api.user.get);
app.get('/user/:userid', api.user.get);
app.put('/user/:userid', api.user.put);

// *****************
// 	Brands
// *****************
app.post('/user/:userid/brand', api.brand.post);
app.get('/brand', api.brand.getByQuery);
app.get('/brand/:brandid', api.brand.getById);
app.get('/user/:userid/brand', (req, res) => {
  let newReq = Object.assign({}, req);

  newReq.query = {};
  newReq.query.userid = req.params.userid;

  api.brand.getByUserId(newReq, res);
});
app.put('/brand/:brandid', api.brand.put);

// *****************
// 	Stacks
// *****************
app.post('/user/:userid/stack', api.stack.post);
app.get('/stack/:stackid', api.stack.getById);
app.get('/user/:userid/stack', api.stack.getByUserId);
app.put('/stack/:stackid', api.stack.put);

// *****************
// 	Contacts
// *****************
app.post('/user/:userid/stack/:stackid/contact', api.contact.post);
