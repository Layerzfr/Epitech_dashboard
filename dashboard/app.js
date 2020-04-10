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
var request = require('request-promise');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/dashboard')
    .then(() =>  console.log('connection succesful'))
    .catch((err) => console.error(err));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var steamRouter = require('./routes/steam');
var twitterRouter = require('./routes/twitter');
var spotifyRouter = require('./routes/spotify');

var app = express();

var _youtubeConsumerKey = "482608527715-8fpkr88gaq0chr2rngoer02i8240baib.apps.googleusercontent.com\n";
var _youtubeConsumerSecret = "7ywN-C1VKkvURTRzWXKaGw2M";
//https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&response_type=code&state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Foauth2.example.com%2Ftoken&redirect_uri=http%3A//127.0.0.1:3000/youtube/services/callback&client_id=482608527715-8fpkr88gaq0chr2rngoer02i8240baib.apps.googleusercontent.com


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
app.use('/steam', steamRouter);
app.use('/twitter', twitterRouter);
app.use('/spotify', spotifyRouter);

var OpenIDStrategy = require('passport-openid').Strategy;
var SteamStrategy = new OpenIDStrategy({
      // OpenID provider configuration
      providerURL: 'http://steamcommunity.com/openid',
      stateless: true,
      // How the OpenID provider should return the client to us
      returnURL: 'http://localhost:3000/steam/sessions/callback',
      realm: 'http://localhost:3000/',
    },
    // This is the "validate" callback, which returns whatever object you think
    // should represent your user when OpenID authentication succeeds.  You
    // might need to create a user record in your database at this point if
    // the user doesn't already exist.
    function(identifier, done) {
      // The done() function is provided by passport.  It's how we return
      // execution control back to passport.
      // Your database probably has its own asynchronous callback, so we're
      // faking that with nextTick() for demonstration.
      process.nextTick(function () {
        // Retrieve user from Firebase and return it via done().
        var user = {
          identifier: identifier,
          // Extract the Steam ID from the Claimed ID ("identifier")
          steamId: identifier.match(/\d+$/)[0]
        };
        // In case of an error, we invoke done(err).
        // If we cannot find or don't like the login attempt, we invoke
        // done(null, false).
        // If everything went fine, we invoke done(null, user).
        console.log(user);
        return done(null, user);
      });
    });
passport.use(SteamStrategy);

app.get('/youtube/sessions/connect', function(req, res){
  res.redirect("https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&response_type=code&state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Foauth2.example.com%2Ftoken&redirect_uri=http%3A//127.0.0.1:3000/youtube/services/callback&client_id=482608527715-8fpkr88gaq0chr2rngoer02i8240baib.apps.googleusercontent.com");
});

app.get('/youtube/services/callback', function(req, res){
  console.log(req.query.code);
  console.log(req.query);

  request.post({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded',
    },
    url:     'https://oauth2.googleapis.com/token',
    body:    "code="+req.query.code+"&client_id=482608527715-8fpkr88gaq0chr2rngoer02i8240baib.apps.googleusercontent.com&client_secret=7ywN-C1VKkvURTRzWXKaGw2M&redirect_uri=http://127.0.0.1:3000/youtube/services/callback&grant_type=authorization_code"
  }, function(error, response, body){
    User.find({username: req.user.username}).updateOne({oauthYoutube: JSON.parse(response.body).access_token}, function(err, todo){
      if (err) return res.status(500).send(err);
      res.redirect('/');
    });
    console.log((response.body))
  });

  // var request = require('request');
  // request.post({
  //   headers: {'Authorization' : 'Basic Mjg0N2YwOWMxMDVkNGEwN2FlYzk0YzQ0ODk1N2ZlNjA6ODYwY2YxMzdkNTU0NGU1NmEwNTQ4YjFiNjVmZDA5MDg=',
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   url:     'https://accounts.spotify.com/api/token',
  //   body:    "grant_type=authorization_code&code="+req.query.code+"&redirect_uri=http://127.0.0.1:3000/spotify/sessions/callback"
  // }, function(error, response, body){
  //   User.find({username: req.user.username}).updateOne({oauthSpotify: JSON.parse(response.body).access_token}, function(err, todo){
  //     if (err) return res.status(500).send(err);
  //     res.redirect('/');
  //   })
  //   console.log(JSON.parse(response.body).access_token)
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
