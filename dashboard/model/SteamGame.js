var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SteamSchema = new Schema({
    appId: String,
    appName: String
});


module.exports = mongoose.model('Steam', SteamSchema);