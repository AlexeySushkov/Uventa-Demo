var express = require('express');
var request = require('request');
var router = express.Router();


var mongoose = require('mongoose');
var Usp = require('../models/usp.js');
var Phone = require('../models/phone.js');

/* SAVE USP */
router.post('/*usp*', function(req, res, next) {
  console.log(req.body)
  Usp.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET ALL USP */
router.get('/*usp*', function(req, res, next) {
  console.log(req.body)
  Usp.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* SAVE PHONE */
router.post('/*phone*', function(req, res, next) {
  console.log(req.body)
  Phone.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET ALL PHONE */
router.get('/*phone*', function(req, res, next) {
  console.log(req.body)
  Phone.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

router.get('/*', function(req, res, next) {
  var query = req.params[0];
  console.log(query)

  request.get({
    url: req.app.get('apiRoot') + '/api/' + query,
    qs: req.query
  }, function(err, response, body) {
    if (err) {
      return next(err);
    }
    try {
      res.json(JSON.parse(body));
    } catch (e) {
      res.json({});
    }
  });
});

router.post('/*', function(req, res, next) {
  var query = req.params[0];
  console.log(query)

  request.post({
      url: req.app.get('apiRoot') + '/api/' + query,
      json: req.body
    },
    function(err, response, body) {
      if (err) {
        return next(err);
      }
      res.json(body);
    });
});

module.exports = router;
