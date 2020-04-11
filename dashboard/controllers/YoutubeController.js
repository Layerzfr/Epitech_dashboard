var User = require("../model/User");
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views/');
let twing = new TwingEnvironment(loader);
var request = require('request-promise');

var youtubeController = {};

var _youtubeConsumerKey = "482608527715-8fpkr88gaq0chr2rngoer02i8240baib.apps.googleusercontent.com";
var _youtubeConsumerSecret = "7ywN-C1VKkvURTRzWXKaGw2M";
var _youtubeApiKey = "AIzaSyA4xXnPqBQaJfzzYpMn3RBTFBYZT206Qas";

youtubeController.connect = function(req,res) {
    res.redirect("https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/youtube&response_type=code&state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Foauth2.example.com%2Ftoken&redirect_uri=http%3A//127.0.0.1:3000/youtube/services/callback&client_id=482608527715-8fpkr88gaq0chr2rngoer02i8240baib.apps.googleusercontent.com");
};

youtubeController.callback = function(req,res) {
    request.post({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
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
};

youtubeController.getChannel = function(req,res) {
    request.get({
        headers: {'Authorization' : 'Bearer '+req.user.oauthYoutube,
            'Accept': 'application/json'
        },
        url:     "https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&mine=true&key="+_youtubeApiKey,
    }, function(error, response, body){
        return twing.render('youtube/channel.html.twig', {
            'channelName': JSON.parse(response.body).items[0].snippet.title,
            'viewsCount': JSON.parse(response.body).items[0].statistics.viewCount,
            'subscribersCount': JSON.parse(response.body).items[0].statistics.subscriberCount,
            'createdAt' : JSON.parse(response.body).items[0].snippet.publishedAt
        }).then((output) => {
            res.end(output);
        });
    });
};

module.exports = youtubeController;