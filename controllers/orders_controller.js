var mongoose = require('mongoose');

var Customer = mongoose.model('Customer');
var Order    = mongoose.model('Order');
var Address  = mongoose.model('Address');
var Billing  = mongoose.model('Billing');

var products = require('./products_controller.js');

exports.getOrder = function(req, res) {
	if(req.isAuthenticated()) {
		Order.findOne({ _id: req.query.orderId }).exec(function(err, order) {
			if(!order) {
				res.json(404, { msg: 'Order not found.' });
			} else {
				res.json(order);
			}
		});
	} else {
		req.session.msg = "Access denied!";
		res.redirect('/login');
	}
};

exports.getOrders = function(req, res) {
	if(req.isAuthenticated()) {
		Order.find({ userId: req.user.identifier }).exec(function(err, orders) {
			if(!orders) {
				res.json(404, { msg: 'Orders not found.' });
			} else {
				res.json(orders);
			}
		});
	} else {
		req.session.msg = "Access denied!";
		res.redirect('/login');
	}
};

exports.addOrder = function(req, res) {
	if(req.isAuthenticated()) {
		var orderShipping = new Address(req.body.updatedShipping);
		var orderBilling  = new Billing(req.body.updatedBilling);
		var orderItems    = req.body.orderItems;
		
		var newOrder = new Order({
			userId:   req.user.identifier,
			items:    orderItems,
			shipping: orderShipping,
			billing:  orderBilling
		});
		
		newOrder.save(function(err, results) {
			if(err) {
				res.json(500, "Failed to save order.");
			} else {
				Customer.update({ userId: req.user.identifier }, { $set: { cart: [] }}).exec(function(err, results) {
					if(err || results < 1) {
						res.json(404, { msg: 'Failed to update cart.' });
					} else {
						for(var i = 0; i < orderItems.length; ++i) {
							var orderItem = orderItems[i];
							
							products.updateProduct(orderItem.product[0]._id, orderItem.product[0].instock - orderItem.quantity);
						}
						
						res.json({ msg: "Order saved." });
					}
				});
			}
		});
	} else {
		req.session.msg = "Access denied!";
		res.redirect('/login');
	}
};