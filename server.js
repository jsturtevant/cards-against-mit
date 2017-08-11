// Express Framework
var express = require('express');
var app = express();

// Jade Templating Engine
var jade = require('jade');
app.set('view engine', 'jade');

// Mongo Database
var mongo = require('mongodb');
var ObjectID = require('mongodb').ObjectID;

const connectionString = process.env.MONGO_CONNSTRING || '';
const db = require("monk")(connectionString);

// MIDDLEWARE

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static('public'));

// ROUTES
app.get('/', function (req, res) {
  res.redirect('/play');
});

app.get('/play', function (req, res) {
  res.render('play');
});

app.get('/billboard', function (req, res) {
  res.render('billboard');
});

app.get('/sort', function (req, res) {
  var collection = db.get('submissions');
  collection.find({}, { sort: { votes: 1 } }, function (e, docs) {
    if (e) { throw e; } else {
      var pairings = [];
      docs.reverse().forEach(function (pairing) { // reverse for decreasing order
        pairings.push(pairing);
      });
      res.send({ "pairings": pairings });
    }
  });
});

app.get('/initial', function (req, res) {
  res.send();
});

app.post('/submit', function (req, res) {
  // Insert Pairing
  var pairings = db.get('submissions');
  var submission = req.body.submission;

  pairings.insert({ "submission": submission, "votes": 0 })

  res.send();
});

app.post('/upvote', function (req, res) {
  var id = req.body.id;
  var collection = db.get('submissions');
  collection.findOne(new ObjectID(id), {}, function (e, pairing) {
    if (e) { throw e; } else {
      pairing.votes += 1;
      collection.update(new ObjectID(id), pairing, function (e) {
        if (e) { throw e; } else {
          res.sendStatus(200);
        }
      });
    }
  }).catch(err => {
    console.log("here")
  });
});

// 404
app.use(function (req, res, next) {
  res.setHeader('Content-Type', 'text/html');
  res.send(404, 'You are lost.');
});

// RUN
if (process.env.NODE_ENV == "production") {
  // in Azure cloud
  app.listen(80);
}
else {
  // local
  app.listen(8000);
}