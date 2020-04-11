var express = require('express');
var router = express.Router();

var spotifyController = require('../controllers/SpotifyController');

router.get('/sessions/connect', spotifyController.connect);

router.get('/sessions/callback', spotifyController.callback);

router.get('/getUserPlaylist', spotifyController.getUserPlaylist);

module.exports = router;
