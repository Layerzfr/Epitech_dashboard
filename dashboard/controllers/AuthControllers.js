var mongoose = require("mongoose");
const passport = require('passport');
var User = require("../model/User");
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views/');
let twing = new TwingEnvironment(loader);

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
    twing.render('index.html.twig', {user: req.user}).then((output) => {
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