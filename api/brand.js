const moment = require('moment');
const ObjectId = require('mongodb').ObjectID;
const log = require('../utils/log.js');
const db = require('../utils/db.js');

module.exports = {
  post: (req, res) => {
    db((err, database) => {
      if (err) {
        res.sendStatus(500);
        log.error(err);
        return;
      }

      if (
        req.body.name === undefined ||
        req.body.userid === undefined
      ) {
        log.error("brandiose/brand [post] request does not contain name or userid.", req.body);
        res.send({
          status: 500,
          message: "Please provide the appropriate info to create a brand."
        });
        return;
      }

      database
      .collection('brands')
        .find({
          $and: [
            { 'name': { $eq: req.body.name }},
            { 'userid': { $eq: req.body.userid }}
          ]
        })
        .toArray((err, result) => {
          if (err) {
            res.sendStatus(500);
            log.error(err);
            return;
          }

          if (result.length > 0) {
            log.error("brandiose/user [post] user already exists.", req.body);
            res.send({
              status: 409,
              message: "Brand already exists for this user."
            });
            return;
          } else {
            req.body.created = moment().format("YYYY-MM-DD HH:mm");
            req.body.modified = req.body.created;
            database.collection('brands').save(req.body, (err, result) => {
              if (err) {
                res.sendStatus(500);
                return log.error(err);
              }

              log.success('brandiose/brands [post] saved to db', req.body);

              res.send({
                status: 201,
                message: 'Brand successfully created.'
              });
            });
          }
        });
    });
  },
  get: (req, res) => {
  },
  put: (req, res) => {
  }
};
