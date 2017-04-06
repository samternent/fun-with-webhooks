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

var baseURL = null;
var auth_token = null;

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

// var Twitter = require('twitter');
// var client = new Twitter({
//   consumer_key: config.twitterConsuerKey,
//   consumer_secret: config.twitterConsuerSecret,
//   access_token_key: config.twitterRequestToken,
//   access_token_secret: config.twitterRequestTokenSecret
// });
//
var Twit = require('twit')

var T = new Twit({
  consumer_key:         config.twitterConsumerKey,
  consumer_secret:      config.twitterConsumerSecret,
  access_token:         config.twitterAccessToken,
  access_token_secret:  config.twitterAccessTokenSecret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})





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
    hook: String,
    tags: Array,
    action: String,
    actionProvider: String
});

// create the model for users and expose it to our app
var Action = mongoose.model('Action', actionSchema);


var onActions = {
  'github': {
    'CREATE.ISSUE': function (task) {

      var title = `${task.content}`;
      var body = `${task.description} \n  [#${task.id}](${baseURL}/tasks/${task.id})`;
      var labels = [`#${task.id}`]

      github.issues.create({
        owner: 'samternent',
        repo: 'fun-with-webhooks',
        title: title,
        body: body,
        labels: labels
      }, function (err, data) {
        console.log(err)
        // emit github issue created
      })
    }
  },
  'twitter': {
    'TWEET': function (task) {
      var status = `FIXED - ${task.content} 🐶 #pugsnotbugs 🐞`;
      T.post('statuses/update', { status: status }, function(err, data, response) {
        if(err) console.log(err);

        // socket emit about the tweet
      })
    }
  }
}



app.post('/action', function (req, res) {
  var params = req.body;
  var action = new Action(params);
  action.save(function (err) {
    if (err)
      return res.json({success: false, message: 'we cannay do it man'})

    // socker emit that we created it ok!

    res.json({success: true, action: action});
  })
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


app.post('/dahook', function (req, res) {
  var twEvent = req.body.event.split('.');

  Action.findOne({ hook: req.body.event }, function (err, action) {
    if (err)
      return res.json({success: false})

    if (!action) {
      return res.json({success: false})
    } else {
      request({
          url: `${baseURL}/tasks/${req.body.objectId}.json`,
          headers: {
            "Authorization": "BASIC " + auth_token,
          },
        })
        .then((resp) => {
          var task = JSON.parse(resp)['todo-item']
          var tagged = false;

          if (task.tags) {
            task.tags.forEach((tag) => {
              action.tags.forEach((t) => {
                if (tag.name === t.name) {
                  tagged = true
                }
              })
            })
          }

          if (tagged) {
            onActions[action.actionProvider][action.action](task)
          }
        })
      res.sendStatus(200)
    }

  })
})

app.post('/githook', function (req, res) {
  if (req.body.action !== 'closed') return res.sendStatus(200);

  var label = req.body.issue.labels[0];
  if (!label)
    res.sendStatus(200)

  if (label.name.indexOf('#') > -1) {
    var taskId = label.name.substr(1);
    request({
        url: `${baseURL}/tasks/${taskId}/complete.json`,
        method: 'put',
        headers: {
          "Authorization": "BASIC " + auth_token,
        },
      }).
      then((resp) => {
        res.sendStatus(200)
      })

  }
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
