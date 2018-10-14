const log = require('./log.js');
const mongodb = require('mongodb');
const client = mongodb.MongoClient;
const sndwave = require('../brandiose.config.js');

var db;
var err;
var wait = [];

client.connect(sndwave.dburl, { useNewUrlParser: true }, function(err,database){
  error = err;
  db = database.db(sndwave.vedbname);

  wait.forEach(function(callback) {
    callback(err, database);
  });
});

module.exports = function(callback) {
  if (db || error) {
    log.success("Successful DB connection.");
    callback(error, db);
  } else {
    log.info("Waiting for DB connection...");
    wait.push(callback);
  }
};
