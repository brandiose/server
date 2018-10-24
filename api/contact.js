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
       req.params.userid === undefined ||
       req.params.stackid === undefined ||
       req.body.brandid === undefined
     ) {
       log.error("brandiose/contact [post] contact does not contain userid, stackid, or brandid.", req.body);
       res.send({
         status: 500,
         message: "Please provide the appropriate info to add a contact."
       });
       return;
     }

     database
     .collection('contacts')
       .find({
         $and: [
           { 'userid': { $eq: req.params.userid }},
           { 'stackid': { $eq: req.params.stackid }},
           { 'brandid': { $eq: req.body.brandid }}
         ]
       })
       .toArray((err, result) => {
         if (err) {
           res.sendStatus(500);
           log.error(err);
           return;
         }

         if (result.length > 0) {
           log.error("brandiose/contact [post] contact already exists.", req.body);
           res.send({
             status: 409,
             message: "Contact already exists for this user."
           });
           return;
         } else {
           req.body.created = moment().format("YYYY-MM-DD HH:mm");
           req.body.modified = req.body.created;
           req.body.userid = req.params.userid;
           req.body.stackid = req.params.stackid;
           database.collection('contacts').save(req.body, (err, result) => {
             if (err) {
               res.sendStatus(500);
               return log.error(err);
             }

             log.success('brandiose/contact [post] saved to db', req.body);

             res.send({
               status: 201,
               message: 'Contact successfully added.',
               body: req.body
             });
           });
         }
       });
   });
  },
  get: (req, res) => {
   db((err, database) => {

     log.info("contacts.GET", req.query);
     if (err) {
       res.sendStatus(500);
       log.error(err);
       return;
     }

     database
       .collection('contacts')
       .find({
         $and: [
           { 'userid': { $eq: req.params.userid }},
           { 'stackid': { $eq: req.params.stackid }}
         ]
       })
       .toArray((err, result) => {
         if (err) {
           res.sendStatus(500);
           log.error(err);
           return;
         }

         if (result.length > 0) {
           log.success('brandiose/contact [get] contact found.', result);

           res.send({
             status: 200,
             message: 'Contact found',
             body: result
           });
         } else {
           log.warn('brandiose/contact [get] contact not found.');

           res.send({
             status: 404,
             message: 'Contact not found.',
             body: []
           });
         }
       });
   });
  },
  put: (req, res) => {
    db((err, database) => {
      log.info("contacts.PUT", req.params.contactid, req.body);
      if (err) {
        res.sendStatus(500);
        log.error(err);
        return;
      }

      req.body.modified = moment().format("YYYY-MM-DD HH:mm");

      const query = {
        '_id': { $eq: ObjectId(req.params.contactid )}
      };

      const values = {
        $set: req.body
      };

      database
        .collection('contacts')
        .updateOne(query, values, (err, result) => {
          if (err) {
            res.sendStatus(500);
            log.error(err);
            return;
          }

          log.success('brandiose/contact [put] contact updated.', query, values);
          res.send({
            status: 202,
            message: 'Contact updated'
          });
        });
    });
  }
};

 module.exports = brandApi;
