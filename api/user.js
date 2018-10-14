const moment = require('moment');
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

      if (req.body.email === undefined) {
        log.error("brandiose/user [post] request does not contain email.", req.body);
        res.send({
          status: 500,
          message: "Please provide an email to create a user."
        });
        return;
      }

      database
      .collection('users')
        .find(
          { 'email': { $eq: req.body.email }}
        )
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
              message: "Account already exists."
            });
            return;
          } else {
            req.body.created = moment().format("YYYY-MM-DD HH:mm");
            req.body.modified = req.body.created;
            database.collection('users').save(req.body, (err, result) => {
              if (err) {
                res.sendStatus(500);
                return log.error(err);
              }

              log.success('brandiose/user [post] daved to db', req.body);

              res.send({
                status: 201,
                message: 'Account successfully created.'
              });
            });
          }
        })
    });
  },
  get: (req, res) => {
    log.success('user:get', req, res);
  },
  put: (req, res) => {
    log.success('user:put', req, res);
  }
};
