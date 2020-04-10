var express = require('express');
var router = express.Router();
var request = require('request-promise');
var User = require('../model/User');

var _youtubeConsumerKey = "482608527715-8fpkr88gaq0chr2rngoer02i8240baib.apps.googleusercontent.com\n";
var _youtubeConsumerSecret = "7ywN-C1VKkvURTRzWXKaGw2M";


router.get('/sessions/connect', function(req, res){
    res.redirect("https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&response_type=code&state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Foauth2.example.com%2Ftoken&redirect_uri=http%3A//127.0.0.1:3000/youtube/services/callback&client_id=482608527715-8fpkr88gaq0chr2rngoer02i8240baib.apps.googleusercontent.com");
});

router.get('/services/callback', function(req, res){
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
});

module.exports = router;
