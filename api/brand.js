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
            log.error("brandiose/user [post] brand already exists.", req.body);
            res.send({
              status: 409,
              message: "Brand already exists for this user."
            });
            return;
          } else {
            req.body.created = moment().format("YYYY-MM-DD HH:mm");
            req.body.modified = req.body.created;
            req.body.userid = req.params.userid;
            database.collection('brands').save(req.body, (err, result) => {
              if (err) {
                res.sendStatus(500);
                return log.error(err);
              }

              log.success('brandiose/brands [post] saved to db', req.body);

              res.send({
                status: 201,
                message: 'Brand successfully created.',
                body: req.body
              });
            });
          }
        });
    });
  },
  get: (req, res, query) => {
    db((err, database) => {

      log.info("brands.GET", req.query);
      if (err) {
        res.sendStatus(500);
        log.error(err);
        return;
      }

      database
        .collection('brands')
        .find(query)
        .toArray((err, result) => {
          if (err) {
            res.sendStatus(500);
            log.error(err);
            return;
          }

          if (result.length > 0) {
            log.success('brandiose/brand [get] brand found.', result);

            res.send({
              status: 200,
              message: 'Brand(s) found',
              body: result
            });
          } else {
            log.warn('brandiose/brand [get] brand not found.');

            res.send({
              status: 404,
              message: 'Brand(s) not found.',
              body: []
            });
          }
        });
    });
  },
  getById: (req, res) => {
    brandApi.get(req, res, {
      '_id': ObjectId(req.params.brandid)
    });
  },
  getByUserId: (req, res) => {
    brandApi.get(req, res, {
      'userid': req.query.userid
    });
  },
  getByQuery: (req, res) => {
    brandApi.get(req, res, {
      $or: [
        { 'name': { $eq: req.query.name }}
      ]
    });
  },
  put: (req, res) => {
    db((err, database) => {
      log.info("brands.PUT", req.params.brandid, req.body);
      if (err) {
        res.sendStatus(500);
        log.error(err);
        return;
      }

      req.body.modified = moment().format("YYYY-MM-DD HH:mm");

      const query = {
        '_id': { $eq: ObjectId(req.params.brandid )}
      };

      const values = {
        $set: req.body
      };

      database
        .collection('brands')
        .updateOne(query, values, (err, result) => {
          if (err) {
            res.sendStatus(500);
            log.error(err);
            return;
          }

          log.success('brandiose/brand [put] brand updated.', query, values);
          res.send({
            status: 202,
            message: 'Brand updated'
          });
        });
    });
  }
};

module.exports = brandApi;
