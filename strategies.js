var discord  = require('passport-discord').Strategy;
var User = require('./models/user');

var discordStrategy = new discord({
	clientID: process.env.DISCORD_CLIENT_ID,
	clientSecret: process.env.DISCORD_CLIENT_SECRET,
	callbackURL: process.env.DISCORD_CALLBACK_URL,
	scope: ['identify', 'email']
}, function (accessToken, refreshToken, user, done) {
	console.log('USER', user);
	
	user.refreshToken = refreshToken;
	User.findOrCreate({
		slug : user.id
	}, {
		email : user.email,
		avatar : user.avatar,
		name : {
			discord : user.username,
			discriminator : user.discriminator
		},
		updated : new Date()
	}, function(err, result){
		return done(null, user);
	});
});

module.exports.discord = discordStrategy;