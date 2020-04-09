var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var oauth = require('oauth');
var sys = require('sys');
var http = require('http');
const https = require('https');
var querystring = require('querystring');
const LocalStrategy = require('passport-local').Strategy;
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/dashboard')
    .then(() =>  console.log('connection succesful'))
    .catch((err) => console.error(err));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var _twitterConsumerKey = "rfivln94JNkVoPVKoBn79crdc";
var _twitterConsumerSecret = "ppY9iUnH5uEL5QABgd1hEwZMt8cPUHrcCoqqhIwNUR2zl2xr0w";

var _spotifyConsumerKey = "2847f09c105d4a07aec94c448957fe60";
var _spotifyConsumerSecret = "860cf137d5544e56a0548b1b65fd0908";

function consumer() {
  return new oauth.OAuth(
      "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
      _twitterConsumerKey, _twitterConsumerSecret, "1.0A", "http://127.0.0.1:3000/twitter/sessions/callback", "HMAC-SHA1");
}

function consumerSpotify() {
  return new oauth.OAuth(
      "https://accounts.spotify.com/authorize", "https://accounts.spotify.com/authorize",
      _spotifyConsumerKey, _spotifyConsumerSecret, "1.0A", "http://127.0.0.1:3000/spotify/sessions/callback", "HMAC-SHA1");
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/twitter/sessions/connect', function(req, res){
  consumer().getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
    } else {
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);
    }
  });
});

app.get('/twitter/sessions/callback', function(req, res){
  consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      User.find({username: req.user.username}).updateOne({oauthTwitter: oauthAccessToken, oauthAccessSecret: oauthAccessTokenSecret}, function(err, todo){
        if (err) return res.status(500).send(err);
        res.redirect('/');
    })
    }
  });
});


app.get('/spotify/sessions/connect', function(req, res){
  res.redirect("https://accounts.spotify.com/fr/authorize?client_id=2847f09c105d4a07aec94c448957fe60&response_type=code&redirect_uri=http://127.0.0.1:3000/spotify/sessions/callback");
});

app.get('/spotify/sessions/callback', function(req, res){
  console.log(req.query.code);
  console.log(req.query);

  var request = require('request');
  request.post({
    headers: {'Authorization' : 'Basic Mjg0N2YwOWMxMDVkNGEwN2FlYzk0YzQ0ODk1N2ZlNjA6ODYwY2YxMzdkNTU0NGU1NmEwNTQ4YjFiNjVmZDA5MDg=',
      'Content-Type': 'application/x-www-form-urlencoded',
      },
    url:     'https://accounts.spotify.com/api/token',
    body:    "grant_type=authorization_code&code="+req.query.code+"&redirect_uri=http://127.0.0.1:3000/spotify/sessions/callback"
  }, function(error, response, body){
    // if(error) {
    //   console.log(error);
    // }
    // console.log(response);
    // console.log(response);
    User.find({username: req.user.username}).updateOne({oauthSpotify: JSON.parse(response.body).access_token}, function(err, todo){
      if (err) return res.status(500).send(err);
      res.redirect('/');
    })
    console.log(JSON.parse(response.body).access_token)
  });
  // const options = {
  //   hostname: 'accounts.spotify.com',
  //   path: '/api/token',
  //   method: 'POST',
  //   body: "grant_type=authorization_code",
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //
  // }
  //
  // var reqSpotify = https.request(options, res => {
  //   console.log(`statusCode: ${res.statusCode}`)
  //
  //   res.on('data', d => {
  //     process.stdout.write(d)
  //   })
  // })
  //
  // reqSpotify.on('error', error => {
  //   console.error(error)
  // })
  //
  // reqSpotify.end();
  // consumerSpotify().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
  //   if (error) {
  //     res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
  //   } else {
  //     req.session.oauthAccessToken = oauthAccessToken;
  //     req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
  //     User.find({username: req.user.username}).updateOne({oauthSpotify: oauthAccessToken, oauthSpotifyAccessSecret: oauthAccessTokenSecret}, function(err, todo){
  //       if (err) return res.status(500).send(err);
  //       res.redirect('/');
  //     })
  //   }
  // });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var User = require('./model/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
module.exports = app;
