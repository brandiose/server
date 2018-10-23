const moment = require('moment');
const ObjectId = require('mongodb').ObjectID;
const log = require('../utils/log.js');
const db = require('../utils/db.js');

 let brandApi= {
  post: (req, res) => {
    db((err, database) => {
      if (err) {
        res.sendStatus(500);
        log.error(err);
        return;
      }

      if (
        req.body.name === undefined ||
        req.params.userid === undefined
      ) {
        log.error("brandiose/stack [post] request does not contain name or userid.", req.body);
        res.send({
          status: 500,
          message: "Please provide the appropriate info to create a stack."
        });
        return;
      }

      database
      .collection('stacks')
        .find({
          $and: [
            { 'name': { $eq: req.body.name }},
            { 'userid': { $eq: req.params.userid }}
          ]
        })
        .toArray((err, result) => {
          if (err) {
            res.sendStatus(500);
            log.error(err);
            return;
          }

          if (result.length > 0) {
            log.error("brandiose/stack [post] stack already exists.", req.body);
            res.send({
              status: 409,
              message: "Stack already exists for this user."
            });
            return;
          } else {
            req.body.created = moment().format("YYYY-MM-DD HH:mm");
            req.body.modified = req.body.created;
            req.body.userid = req.params.userid;
            database.collection('stacks').save(req.body, (err, result) => {
              if (err) {
                res.sendStatus(500);
                return log.error(err);
              }

              log.success('brandiose/stack [post] saved to db', req.body);

              res.send({
                status: 201,
                message: 'Stack successfully created.',
                body: req.body
              });
            });
          }
        });
    });
  },
  get: (req, res, query) => {

  },
  put: (req, res) => {

  }
};

module.exports = brandApi;
