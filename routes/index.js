var express = require('express');
var router = express.Router();

var Project = require('../models/project');

router.get('/', function(req, res, next) {
	var filters = {
		'visible' : true
	};
	
	Project.find(filters, function(err, projects){
		res.render('explore', {
			projects : projects
		});
	});
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/faq', function(req, res, next) {
  res.render('faq');
});

module.exports = router;
