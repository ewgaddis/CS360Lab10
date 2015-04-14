var mongoose = require('mongoose');

var Customer = mongoose.model('Customer');
var Address  = mongoose.model('Address');
var Billing  = mongoose.model('Billing');

exports.getCustomer = function(req, res) {
	if(req.session.user) {
		Customer.findOne({ userId: req.session.username }).exec(function(err, customer) {
			if(!customer) {
				res.json(404, { msg: 'Customer not found.' });
			} else {
				res.json(customer);
			}
		});
	} else {
		req.session.msg = "Access denied!";
		res.redirect('/login');
	}
};

exports.addCustomer = function(username) {
	if(username) {
		var shipping = new Address({
			name:    '',
			address: '',
			city:    '',
			state:   '',
			zip:     ''
		});
		
		var billing = new Billing({
			cartType:    'Visa',
			name:        '',
			number:      '',
			expireMonth: 1,
			expireYear:  2020,
			address:     shipping
		});
			
		var customer = new Customer({
			userId:   username,
			shipping: shipping,
			billing:  billing,
			cart:     []
		});
		
		customer.save(function(err, result) {
			if(!err) {
				return null;
			} else {
				return err.ToString();
			}
		});
	} else {
		return 'Username not given';
	}
};

exports.updateShipping = function(req, res) {
	if(req.session.user) {
		var newShipping = new Address(req.body.updatedShipping);
		
		Customer.update({ userId: req.session.username }, { $set: { shipping: [newShipping.toObject()] } }).exec(function(err, results) {
			if(err || results < 1) {
				res.json(404, { msg: 'Failed to update shipping.' });
			} else {
				res.json({ msg: 'Customer shipping updated.' });
			}
		});
	} else {
		req.session.msg = "Access denied!";
		res.redirect('/login');
	}
};

exports.updateBilling = function(req, res) {
	if(req.session.user) {
		var newBilling = new Billing(req.body.updatedBilling);
		
		Customer.update({ userId: req.session.username }, { $set: { billing: [newBilling.toObject()] } }).exec(function(err, results) {
			if(err || results < 1) {
				res.json(404, { msg: 'Failed to update billing.' });
			} else {
				res.json({ msg: 'Customer billing updated.' });
			}
		});
	} else {
		req.session.msg = "Access denied!";
		res.redirect('/login');
	}
};

exports.updateCart = function(req, res) {
	if(req.session.user) {
		Customer.update({ userId: req.session.username }, { $set: { cart: req.body.updatedCart } }).exec(function(err, results) {
			if(err || results < 1) {
				res.json(404, { msg: 'Failed to update cart.' });
			} else {
				res.json({ msg: 'Customer cart updated.' });
			}
		});
	} else {
		req.session.msg = "Access denied!";
		res.redirect('/login');
	}
};