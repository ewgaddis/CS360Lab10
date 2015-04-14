var express         = require('express');
var bodyParser		= require('body-parser');
var cookieParser	= require('cookie-parser');
var expressSession	= require('express-session');
var passport        = require('passport');
var GoogleStrategy  = require('passport-google').Strategy;

var mongoStore	= require('connect-mongo')({session: expressSession});
var mongoose	= require('mongoose');

require('./models/users_model.js');
require('./models/comments_model.js');
require('./models/photo_model.js');
require('./models/page_model.js');
require('./models/cart_model.js');

var conn = mongoose.connect('mongodb://localhost/myapp');

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new GoogleStrategy({
	returnURL: 'http://localhost/auth/google/return',
	realm:     'http://localhost/'
}, function(identifier, profile, done) {
	process.nextTick(function() {
		profile.identifier = identifier;
		return done(null, profile);
	});
}));

var app = express();

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(bodyParser());
app.use(cookieParser());
app.use(expressSession({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());

require('./routes')(app);
app.listen(80);