var express = require('express');
var router = express.Router();
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views/');
let twing = new TwingEnvironment(loader);
var auth = require("../controllers/AuthControllers");

/* GET users listing. */
router.get('/', function(req, res, next) {
  twing.render('users.html.twig', {'name': 'World'}).then((output) => {
    res.end(output);
  });
});

// router.get('/', auth.update);
//
// router.post('/', auth.doUpdate);


module.exports = router;
