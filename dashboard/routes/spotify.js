var express = require('express');
var router = express.Router();
var request = require('request-promise');
var User = require('../model/User');
var oauth = require('oauth');
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views/');
let twing = new TwingEnvironment(loader);

var _spotifyConsumerKey = "2847f09c105d4a07aec94c448957fe60";
var _spotifyConsumerSecret = "860cf137d5544e56a0548b1b65fd0908";


function consumerSpotify() {
    return new oauth.OAuth(
        "https://accounts.spotify.com/authorize", "https://accounts.spotify.com/authorize",
        _spotifyConsumerKey, _spotifyConsumerSecret, "1.0A", "http://127.0.0.1:3000/spotify/sessions/callback", "HMAC-SHA1");
}

router.get('/sessions/connect', function(req, res){
    res.redirect("https://accounts.spotify.com/fr/authorize?client_id=2847f09c105d4a07aec94c448957fe60&response_type=code&redirect_uri=http://127.0.0.1:3000/spotify/sessions/callback&&scope=user-read-private%20user-read-email&playlist-read-private");
});

router.get('/sessions/callback', function(req, res){
    console.log(req.query.code);
    console.log(req.query);

    request.post({
        headers: {'Authorization' : 'Basic Mjg0N2YwOWMxMDVkNGEwN2FlYzk0YzQ0ODk1N2ZlNjA6ODYwY2YxMzdkNTU0NGU1NmEwNTQ4YjFiNjVmZDA5MDg=',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        url:     'https://accounts.spotify.com/api/token',
        body:    "grant_type=authorization_code&code="+req.query.code+"&redirect_uri=http://127.0.0.1:3000/spotify/sessions/callback"
    }, function(error, response, body){
        User.find({username: req.user.username}).updateOne({oauthSpotify: JSON.parse(response.body).access_token}, function(err, todo){
            if (err) return res.status(500).send(err);
            res.redirect('/');
        })
        console.log(JSON.parse(response.body).access_token)
    });
});

router.get('/getUserPlaylist', function(req, res){

    request.get({
        headers: {'Authorization' : 'Bearer '+req.user.oauthSpotify,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url:     'https://api.spotify.com/v1/me/playlists',
        // body:    "grant_type=authorization_code&code="+req.query.code+"&redirect_uri=http://127.0.0.1:3000/spotify/sessions/callback"
    }, function(error, response, body){
        var playlists = [];
        JSON.parse(response.body).items.forEach(function (item) {
            console.log(item.id)
            playlists.push(item.id);
        })
        var min=0;
        var max=playlists.length;
        var random = Math.floor(Math.random() * (+max - +min)) + +min;

        return twing.render('playlist.html.twig', {'playlist': playlists[random]}).then((output) => {
            res.end(output);
        });

        // console.log(JSON.parse(response.body).items)
    });
});

module.exports = router;
