var crypto	 = require('crypto');
var express	 = require('express');
var passport = require('passport');

var mongoose = require('mongoose');

var Customer = mongoose.model('Customer');

module.exports = function(app) {
	var users = require('./controllers/users_controller');
	
	var photos   = require('./controllers/photos_controller');
	var comments = require('./controllers/comments_controller');
	var pages    = require('./controllers/pages_controller');
	
	var customers = require('./controllers/customers_controller');
	var products  = require('./controllers/products_controller');
	var orders    = require('./controllers/orders_controller');
	
	app.use('/static', express.static('./static'));
	app.use('/lib',    express.static('./lib'));
	app.use('/images', express.static('./images'));
	
	app.get('/', function(req, res) {
		if(req.isAuthenticated()) {
			Customer.findOne({ userId: req.user.identifier }).exec(function(err, customer) {
				if(!customer) {
					customers.addCustomer(req.user.identifier);
				}
			});
			
			res.render('index', { username: req.user.displayName,
			                      msg:      'Welcome!' });
		} else {
			req.session.msg = 'Access denied!';
			res.redirect('/login');
		}
	});
	
	app.get('/user', function(req, res) {
		if(req.isAuthenticated()) {
			res.render('user', { msg: req.session.msg });
		} else {
			req.session.msg = 'Access denied!';
			res.redirect('/login');
		}
	});
	
	app.get('/signup', function(req, res) {
		if(req.isAuthenticated()) {
			res.redirect('/');
		}
		
		res.render('signup', { msg: req.session.msg });
	});
	
	app.get('/login', function(req, res) {
		if(req.isAuthenticated()) {
			res.redirect('/');
		}
		
		res.render('login', { msg: req.session.msg });
	});
	
	app.get('/auth/google', passport.authenticate('google'));
	
	app.get('/auth/google/return', passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});
	
	app.post('/signup',			users.signup);
	app.post('/user/update',	users.updateUser);
	app.post('/user/delete',	users.deleteUser);
	app.post('/login',			users.login);
	app.get('/user/profile',	users.getUserProfile);
	
	app.get('/comments', function(req, res) {
		if(req.isAuthenticated()) {
			res.render('photos');
		} else {
			res.redirect('/login');
		}
	});
	
	app.get('/photos',       photos.getPhotos);
	app.get('/photo',        photos.getPhoto);
	app.get('/page',         pages.getPage);
	app.get('/comments/get', comments.getComment);
	
	app.post('/comments/add', function(req, res) {
		if(req.isAuthenticated()) {
			comments.addComment(req, res);
		} else {
			res.json(400, { msg: 'Must be authorized to add a comment.' });
		}
	});
	
	app.get('/shopping', function(req, res) {
		if(req.isAuthenticated()) {
			res.render('shopping');
		} else {
			req.session.msg = 'Access denied!';
			res.redirect('/login');
		}
	});
	
	app.get('/products/get',               products.getProducts);
	app.get('/orders/get',                 orders.getOrders);
	app.post('/orders/add',                orders.addOrder);
	app.get('/customers/get',              customers.getCustomer);
	app.post('/customers/update/shipping', customers.updateShipping);
	app.post('/customers/update/billing',  customers.updateBilling);
	app.post('/customers/update/cart',     customers.updateCart);
}