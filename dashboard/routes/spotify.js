var express = require('express');
var router = express.Router();

var spotifyController = require('../controllers/SpotifyController');

router.get('/sessions/connect', spotifyController.connect);

router.get('/sessions/callback', spotifyController.callback);

router.get('/getUserPlaylist', spotifyController.getUserPlaylist);

router.get('/api/getUserPlaylist', spotifyController.getUserPlaylistApi);

module.exports = router;
