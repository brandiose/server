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
              message: "User already exists."
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
                message: 'User successfully created.'
              });
            });
          }
        });
    });
  },
  get: (req, res) => {
    db((err, database) => {

      log.info("users.GET", req.query);
      if (err) {
        res.sendStatus(500);
        log.error(err);
        return;
      }

      database
        .collection('users')
        .find({
          $or: [
            { '_id': { $eq: ObjectId(req.query.id) }},
            { 'email': { $eq: req.query.email }},
            { 'username': { $eq: req.query.email }},
            { 'phone': { $eq: req.query.phone }}
          ]
        })
        .toArray((err, result) => {
          if (err) {
            res.sendStatus(500);
            log.error(err);
            return;
          }

          if (result.length > 0) {
            log.success('brandiose/user [get] user found.', result);

            res.send({
              status: 200,
              message: 'User found',
              body: result
            });
          } else {
            log.warn('brandiose/user [get] user not found.');

            res.send({
              status: 404,
              message: 'User not found.',
              body: []
            });
          }
        });
    });
  },
  put: (req, res) => {
    db((err, database) => {
      log.info("users.PUT", req.params.userid, req.body);
      if (err) {
        res.sendStatus(500);
        log.error(err);
        return;
      }

      const query = {
        '_id': { $eq: ObjectId(req.params.userid )}
      };

      const values = {
        $set: req.body
      };

      database
        .collection('users')
        .updateOne(query, values, (err, result) => {
          if (err) {
            res.sendStatus(500);
            log.error(err);
            return;
          }

          log.success('brandiose/user [put] user updated.', query, values);
          res.send({
            status: 202,
            message: 'User updated'
          });
        });
    });
  }
};
