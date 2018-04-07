var express        = require('express');
var path           = require('path');
var hbs            = require('hbs');
var mongoose       = require('mongoose');
var favicon        = require('serve-favicon');
var markdown       = require('markdown').markdown;
var logger         = require('morgan');
var session        = require('express-session');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var lessMiddleware = require('less-middleware');

var passport = require('passport');
var refresh  = require('passport-oauth2-refresh');
var strategies = require('./strategies');

var index    = require('./routes/index');
var projects = require('./routes/projects');
var users    = require('./routes/users');

var User = require('./models/user');

var app = express();

// Make Google Analytics ID available to views.
app.locals.ga_id = process.env.GA_ID

// Initialize Passport for authentication.
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(strategies.discord);
refresh.use(strategies.discord);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: process.env.SESSION_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());

// Make the current User available in the local scope.
app.use(function(req, res, next) {
	if (req.user && req.user.id) {
		User.findOne({
			slug : req.user.id
		}, function(err, result){
			res.locals.user = result;
			next();
		});
	} else {
		next();
	}
});

// Establish the Mongo Connection via Mongoose
// mongodb://username:password@host:port/database
var mongo_uri = process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;

if (process.env.DB_USER && process.env.DB_PASS) {
	mongo_uri = process.env.DB_USER + ':' + process.env.DB_PASS + '@' + mongo_uri;
}

mongoose.connect('mongodb://' + mongo_uri);

// Set up Handlebars for templating
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

hbs.registerHelper('join', function(list){
	return list.join(', ');
});

hbs.registerHelper('ternary', function(condition, yes, no){
	return condition ? yes : no;
});

hbs.registerHelper('markdown', function(text){
	return markdown.toHTML(text);
});

hbs.registerHelper('math', function (value_1, operator, value_2) {
	value_1 = parseFloat(value_1);
	value_2 = parseFloat(value_2);
	
	return {
		'+': value_1 + value_2,
		'-': value_1 - value_2,
		'*': value_1 * value_2,
		'/': value_1 / value_2,
		'%': value_1 % value_2
	}[operator];
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Load up the routes.
app.use('/', index);
app.use('/projects', projects);
app.use('/users', users);

// Catch 404 and forward to error handler.
app.use(function (req, res, next) {
	var err    = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handler.
app.use(function (err, req, res, next) {
	// Set locals, only providing error in development.
	res.locals.message = err.message;
	res.locals.error   = req.app.get('env') === 'development' ? err : {};
	
	// Render the error page.
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;