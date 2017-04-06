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

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
});


app.post('/api/setSession', function (req, res) {
  baseURL = req.body.baseURL;
  auth_token = req.body.auth_token;
  res.sendStatus(200);
})
