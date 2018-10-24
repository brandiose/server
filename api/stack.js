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
    db((err, database) => {

      log.info("stacks.GET", req.query);
      if (err) {
        res.sendStatus(500);
        log.error(err);
        return;
      }

      database
        .collection('stacks')
        .find(query)
        .toArray((err, result) => {
          if (err) {
            res.sendStatus(500);
            log.error(err);
            return;
          }

          if (result.length > 0) {
            log.success('brandiose/stack [get] brand found.', result);

            res.send({
              status: 200,
              message: 'Stack(s) found',
              body: result
            });
          } else {
            log.warn('brandiose/stack [get] stack not found.');

            res.send({
              status: 404,
              message: 'Stack(s) not found.',
              body: []
            });
          }
        });
    });
  },
  getById: (req, res, query) => {
    brandApi.get(req, res, {
      '_id': ObjectId(req.params.stackid)
    });
  },
  getByUserId: (req, res, query) => {
    brandApi.get(req, res, {
      'userid': req.params.userid
    })
  },
  put: (req, res) => {
    db((err, database) => {
      log.info("stack.PUT", req.params.stackid, req.body);
      if (err) {
        res.sendStatus(500);
        log.error(err);
        return;
      }

      req.body.modified = moment().format("YYYY-MM-DD HH:mm");

      const query = {
        '_id': { $eq: ObjectId(req.params.stackid )}
      };

      const values = {
        $set: req.body
      };

      database
        .collection('stacks')
        .updateOne(query, values, (err, result) => {
          if (err) {
            res.sendStatus(500);
            log.error(err);
            return;
          }

          log.success('brandiose/stack [put] stack updated.', query, values);
          res.send({
            status: 202,
            message: 'Stack updated'
          });
        });
    });
  }
};

module.exports = brandApi;
