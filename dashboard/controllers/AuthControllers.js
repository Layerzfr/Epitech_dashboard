var mongoose = require("mongoose");
const passport = require('passport');
var User = require("../model/User");
var oauth = require('oauth');
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views/');
let twing = new TwingEnvironment(loader);
async function wait (ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    });
}
var userController = {};
var _twitterConsumerKey = "rfivln94JNkVoPVKoBn79crdc";
var _twitterConsumerSecret = "ppY9iUnH5uEL5QABgd1hEwZMt8cPUHrcCoqqhIwNUR2zl2xr0w";

function consumer() {
    return new oauth.OAuth(
        "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
        _twitterConsumerKey, _twitterConsumerSecret, "1.0A", "http://127.0.0.1:3000/twitter/sessions/callback", "HMAC-SHA1");
}

// Restrict access to root page
userController.home = async function(req, res) {
    var TwitterData = null;
    if(req.user) {
        if(req.user.oauthAccessSecret) {
            consumer().get("https://api.twitter.com/1.1/account/verify_credentials.json", req.user.oauthTwitter, req.user.oauthAccessSecret, function (error, data, response) {
              if (error) {
                console.log(error);
              } else {
                req.session.twitterScreenName = data["screen_name"];
                TwitterData = data;
                console.log(TwitterData)
                // res.send('You are signed in: ' + req.session.twitterScreenName)
              }
            });
        }
    }
    await wait(2 * 1000);
    twing.render('index.html.twig', {user: req.user, twitterDatas: JSON.parse(TwitterData)}).then((output) => {
        res.end(output);
    });
};

// Go to registration page
userController.register = function(req, res) {
    twing.render('register.html.twig', {'name': 'World'}).then((output) => {
        res.end(output);
    });
    // res.render('register');
};

// Post registration
userController.doRegister = function(req, res) {
    User.register(new User({ email : req.body.email, username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
        if (err) {
            return twing.render('register.html.twig', {}).then((output) => {
                res.end(output);
            });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
};

// Go to login page
userController.login = function(req, res) {
    console.log(req.user)
    twing.render('login.html.twig', {}).then((output) => {
        res.end(output);
    });
    // res.render('login');
};

// Post login
userController.doLogin = function(req, res, next) {
    passport.authenticate('local')(req, res , function(err, user, info) {
        if (err) { return next(err); }
        if (!req.user) {
            return res.redirect('/login');
        }

        req.logIn(req.user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    });
};

// userController.update = function(req, res){
//     if (req.user) {
//         res.render("update", {
//             user : req.user,
//             username: req.user.username,
//             email: req.user.email,
//         });
//     }else{
//         res.redirect('/login');
//     }
// }
//
// userController.doUpdate = function(req,res){
//
//     User.find({username: req.user.username}).updateOne({username: req.body.username, email: req.body.email}, function(err, todo){
//         if (err) return res.status(500).send(err);
//         res.redirect('/');
//     })
// }

// logout
userController.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

module.exports = userController;