var express = require('express');
var router = express.Router();
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views/');
let twing = new TwingEnvironment(loader);

var auth = require("../controllers/AuthControllers");

// restrict index for logged in user only
router.get('/', auth.home);

//chat for loged user
router.get('/chat', auth.chat);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

/* GET home page. */
router.get('/', function(req, res, next) {
  twing.render('index.html.twig', {'name': 'World'}).then((output) => {
    res.end(output);
  });
});

module.exports = router;
