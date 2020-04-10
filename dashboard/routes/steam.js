var express = require('express');
var router = express.Router();
var request = require('request-promise');
const fetch = require('node-fetch');
var passport = require('passport');
var User = require('../model/User');

function wait(ms)
{
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while(d2-d < ms);
}

router.get('/getusername', function (req, res) {
    request.get('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=5BED62BD82D03D000189824F0AE1E79E&steamids='+req.user.oauthSteam, function (error, response, body) {
        console.log(JSON.parse(body).response.players[0].personaname);
    })
});

router.get('/getgamesPrice', async function (req, res) {
    var apps = [];
    await request.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=5BED62BD82D03D000189824F0AE1E79E&steamid='+req.user.oauthSteam,await async function (error, response, body) {
        var i = 1;
        var price = 0;

        JSON.parse(body).response.games.forEach(await async function (games) {
            apps.push(games.appid);
        });
        const forLoop = async _ => {
            console.log('Start')
            console.log('Temps max estimé : ~' + ((apps.length +1) / 60) + ' minutes');

            for (let element in apps) {
                console.log(apps[element]);
                const response = await fetch("https://store.steampowered.com/api/appdetails/?appids=" + apps[element] + "&cc=EE&l=english&v=1");
                const json = await response.json();
                try {
                    if(json[apps[element]].data.price_overview) {
                        price += (json[apps[element]].data.price_overview.initial);
                    }
                } catch (e) {
                    console.log(e)
                }
                await wait(1000);
                console.log(price/100 +' €')
            }

            console.log('End')
        }

        await forLoop();


        console.log('final price: '+ price/100 +' €')
    })
});

// Return les X derniers jeux joués avec le nom du jeu ,  le logo du jeu et le nombre de minutes jouées.
router.get('/getrecentplayedgames', function (req, res) {
    request.get('http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=5BED62BD82D03D000189824F0AE1E79E&steamid='+req.user.oauthSteam, function (error, response, body) {
        console.log(JSON.parse(body).response);
    })
});

//Return les ID ( dans la console ) des amis Steam.
router.get('/getfriendlist', function (req, res) {
    request.get('http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=5BED62BD82D03D000189824F0AE1E79E&steamid='+req.user.oauthSteam+'&relationship=friend', function (error, response, body) {
        JSON.parse(body).friendslist.friends.forEach(function (user) {
            console.log(user.steamid);
        })
    })
});

router.get('/sessions/connect', passport.authenticate('openid'));

router.get('/sessions/callback', function(req, res){
    if (req.user) {
        User.find({username: req.user.username}).updateOne({oauthSteam: req.query["openid.identity"].substring(37)}, function(err, todo){
            if (err) return res.status(500).send(err);
            res.redirect('/');
        })
    } else {
        res.redirect('/?failed');
    }
});

module.exports = router;
