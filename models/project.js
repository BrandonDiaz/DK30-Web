var mongoose = require('mongoose');
var User     = require('./user');

var ProjectSchema = new mongoose.Schema({
	slug: String,
	goal: {type: String, default: 'Accomplish something incredible.'},
	website  : String,
	download : String,
	category: {type: String, default: 'Other'},
	tags: [String],
	owner: User.schema,
	followers: [mongoose.Schema.Types.ObjectId],
	priority: {type: Number, default: 0},
	card: {
		background: {
			color: {type: String, default: 'default'},
			pattern: {type: String, default: 'none'}
		},
		layers: [{
			type: {type: String, default: 'none'},
			color: {type: String, default: 'default'},
			position: {
				x: {type: Number, default: 0},
				y: {type: Number, default: 0}
			}
		}]
	},
	milestones: {
		weekly: [String],
		result: String
	},
	links: [{
		title: String,
		href: String,
		type: String
	}],
	updates: [{
		created: {type: Date, default: Date.now},
		links: [String],
		content: String
	}],
	views: {
		total: Number,
		list: [String]
	},
	completed: {type: Boolean, default: false},
	visible: {type: Boolean, default: false},
	start: {type: Date, default: Date.now},
	end: {type: Date, default: Date.now},
	created: {type: Date, default: Date.now},
	updated: {type: Date, default: Date.now}
});


ProjectSchema.index({
	'slug' : 1,
	'visible' : 1
});

ProjectSchema.index({
	'visible' : 1,
	'goal' : 'text',
	'tags' : 'text',
	'owner.name.discord' : 'text'
}, {
	weights: {
		'goal' : 3,
		'tags' : 1,
		'owner.name.discord' : 2
	}
});

module.exports = mongoose.model('Project', ProjectSchema);