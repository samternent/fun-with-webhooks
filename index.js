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


app.get('/test-github-issues', function (req, res) {
  var title = 'issue title';

  github.issues.create({
    owner: 'samternent',
    repo: 'fun-with-webhooks',
    title: title,
  }, function () {
    res.sendStatus(200)
  })

})


app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
});
