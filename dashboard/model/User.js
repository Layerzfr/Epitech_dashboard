var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    email: String,
    username: String,
    password: String,
    oauthTwitter: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);