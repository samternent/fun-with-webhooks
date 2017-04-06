require('babel-core/register');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request-promise');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(__dirname + '/app'));
app.use('/assets', express.static(__dirname + '/app'));

var port = process.env.PORT || 1620;

app.listen(port, function() {
  console.log('Node app is running on port', port);
});


app.post('/api/setSession', function (req, res) {
  baseURL = req.body.baseURL;
  auth_token = req.body.auth_token;
  res.sendStatus(200);
})


var config = require('./config.js');


// Fun with webhooks
var GitHubApi = require("github");
var github = new GitHubApi({
    protocol: "https",
    host: "api.github.com",
    headers: {
        "user-agent": "fun-with-webhooks"
    },
    Promise: require('bluebird'),
    followRedirects: false,
    timeout: 5000
});

github.authenticate({
    type: "oauth",
    token: config.githubToken
});


var mongoose = require('mongoose');

mongoose.connect(config.db, {
  server: {
    socketOptions: {
      socketTimeoutMS: 0,
      connectTimeoutMS: 0
    }
  }
});


// define the schema for our model
var actionSchema = mongoose.Schema({
    provider: String,
    hook: Object,
    tags: Array,
    action: String,
    actionProvider: String
});

// create the model for users and expose it to our app
var Action = mongoose.model('Action', actionSchema);


//
// app.get('/test-github-issues', function (req, res) {
//   var title = 'issue title';
//
//   github.issues.create({
//     owner: 'samternent',
//     repo: 'fun-with-webhooks',
//     title: title,
//   }, function () {
//     res.sendStatus(200)
//   })
//
// })
//
//

app.post('/action', function (req, res) {
  var params = req.body;
  var action = new Action(params);
  // post data objet to mongo
  action.save(function (err) {
    if (err)
      return res.json({success: false, message: 'we cannay do it man'})

    res.json({success: true, action: action});
  })

  // setup provider webhook
})


app.get('/actions', function (req, res) {
  Action.find(function (err, actions) {
    if (err)
      return res.json({success: false, message: 'we cannay do it man'})

    if (!actions) {
      return res.json({success: false, message: 'no matching actions' });
    } else {
      return res.json({ success: true, actions: actions })
    }

  })
})


app.get('/reset', function (req, res) {
  Action.deleteMany(function (err, actions) {
    if (err)
      return res.json({success: false, message: 'we cannay do it man'})

    if (!actions) {
      return res.json({success: false, message: 'no matching actions' });
    } else {
      return res.json({ success: true, actions: actions })
    }

  })
})


app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
});
