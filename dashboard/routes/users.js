var express = require('express');
var router = express.Router();
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views/');
let twing = new TwingEnvironment(loader);

/* GET users listing. */
router.get('/', function(req, res, next) {
  twing.render('users.html.twig', {'name': 'World'}).then((output) => {
    res.end(output);
  });
});

module.exports = router;
