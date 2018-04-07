var express   = require('express');
var striptags = require('striptags');
var cache     = require('express-redis-cache')();
var router    = express.Router();

var Project = require('../models/project');

router.get('/new', function (req, res, next) {
	// TODO: We'll want to limit the number of active projects, something like 10.
	var slug    = res.locals.user.slug + '-' + Date.now();
	var project = new Project({
		'slug': slug,
		'owner': res.locals.user,
		'card.layers': new Array(5).fill({}, 0),
		'milestones.weekly': new Array(4).fill('', 0),
		'start': Date.now(),
		'end': Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 Days
	});
	
	project.save(function (err) {
		if (err) {
			res.redirect('/error');
			return false;
		}
		
		res.redirect('/projects/' + slug);
	});
});

// This returns cards via AJAX for display in a .listing element.
// TODO: Quarantine these types of things into separate routes.
router.get('/list/:page', function (req, res, next) {
	var count   = 9;
	var filters = {
		'visible': true
	};
	
	// Paginate and return markup for insertion.
	Project.find(filters).skip((count * req.params.page)).limit(count).exec(function (err, projects) {
		res.render('projects-list', {
			layout: false,
			projects: projects
		});
	});
});

// Return a modal edit form for a project.
router.get('/:slug/edit', function (req, res, next) {
	Project.findOne({
		'slug': req.params.slug
	}, function (err, project) {
		if (err || !project || !(res.locals.user && res.locals.user.slug == project.owner.slug)) {
			res.redirect('/error/404');
			return false;
		}
		
		// These properties control how the card partial renders.
		project.static   = true;
		project.cardOnly = true;
		
		res.render('projects-edit', {
			layout: 'modal',
			project: project
		});
	});
});

// Edit form posts here to update a project
router.post('/:slug/edit', function (req, res, next) {
	var update = {
		'goal': req.body.goal,
		'description': req.body.description,
		'category': req.body.category,
		'visible': req.body.visible == 'true',
		'card.background.color': req.body['card[background][color]'],
		'card.background.pattern': req.body['card[background][pattern]'],
		'milestones.weekly.0': req.body['milestones[weekly][0]'],
		'milestones.weekly.1': req.body['milestones[weekly][1]'],
		'milestones.weekly.2': req.body['milestones[weekly][2]'],
		'milestones.weekly.3': req.body['milestones[weekly][3]'],
		'tags': req.body.tags
	};
	
	// Tags are always stored as an array, but displayed as a string when editing.
	update.tags = update.tags.split(',').map(function (tag) {
		return tag.trim();
	});
	
	Project.findOne({
		'slug': req.params.slug
	}, function (err, project) {
		// Check if they own this project, or kick them out.
		if (err || !project || !(res.locals.user && res.locals.user.slug == project.owner.slug)) {
			res.redirect('/error');
			return false;
		}
		
		Project.update({
			'slug': req.params.slug
		}, update, function (err) {
			if (err) {
				res.redirect('/error');
				return false;
			}
			
			// Everything good? Kick them back to the project page.
			// TODO: Set up global notifications to display success/error messages.
			res.redirect('/projects/' + req.params.slug);
		});
	});
});

router.post('/:slug/update', function (req, res, next) {
	var update = {
		'content': striptags(req.body.content),
		'media': req.body.media
	};
	
	console.log('');
	
	if (!update.content) {
		res.redirect('/projects/' + req.params.slug);
		return false;
	}
	
	Project.findOne({
		'slug': req.params.slug
	}, function (err, project) {
		// Check if they own this project, or kick them out.
		if (err || !project || !(res.locals.user && res.locals.user.slug == project.owner.slug)) {
			res.redirect('/error');
			return false;
		}
		
		Project.update({
			'slug': req.params.slug
		}, {
			'$push': {
				'updates': update
			}
		}, function (err) {
			if (err) {
				res.redirect('/error');
				return false;
			}
			
			// Everything good? Kick them back to the project page.
			res.redirect('/projects/' + req.params.slug);
		});
	});
});

// Display a project's details.
router.get('/:slug', function (req, res, next) {
	var prompts = [
		'What did you accomplish today?',
		'Hey there, what have you been working on?'
	];
	
	Project.findOne({
		'slug': req.params.slug
	}, function (err, project) {
		var isOwner = res.locals.user && res.locals.user.slug == project.owner.slug;
		
		if (err || !project || (!project.visible && !isOwner)) {
			res.redirect('/error/404');
			return false;
		}
		
		project.static   = true;
		project.cardOnly = true;
		
		// Updates are stored chronologically, but the feed is reverse chronological.
		project.updates.reverse();
		
		if (isOwner) {
			// Enabling this will display the edit button and update form.
			project.editable = true;
		}
		
		res.render('projects-detail', {
			project: project,
			isOwner: isOwner,
			prompt: prompts[Math.floor(Math.random() * prompts.length)]
		});
	});
});

module.exports = router;