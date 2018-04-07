var express  = require('express');
var passport = require('passport');
var cache    = require('express-redis-cache')();
var router   = express.Router();

var User = require('../models/user');
var Project = require('../models/project');

router.get('/auth/discord', passport.authenticate('discord'));
router.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/users/' + req.user.id);
});

router.get('/auth/signout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// Display a User's profile.
router.get('/:slug', function(req, res) {
	User.findOne({
		'slug' : req.params.slug
	}, function(err, profile){
		if (err || !profile) {
			res.redirect('/error/404');
			return false;
		}
		
		var isOwner  = res.locals.user && res.locals.user.slug == profile.slug;
		var find     = {
			'owner.slug' : profile.slug
		}
		
		if (!isOwner) {
			find['visible'] = true;
		}
		
		Project.find(find, function(err, projects){
			res.render('users-detail', {
				profile  : profile,
				projects : projects,
				isOwner  : isOwner
			});
		});
	});
});

module.exports = router;