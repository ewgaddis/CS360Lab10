var mongoose = require('mongoose');

var Product = mongoose.model('Product');

exports.getProduct = function(req, res) {
	Product.findOne({ _id: req.query.productId }).exec(function(err, product) {
		if(!product) {
			res.json(404, { msg: 'Photo not found.' });
		} else {
			res.json(product);
		}
	});
};

exports.getProducts = function(req, res) {
	Product.find().exec(function(err, products) {
		if(!products) {
			res.json(404, { msg: 'Products not found.' });
		} else {
			res.json(products);
		}
	});
};

exports.updateProduct = function(productId, instock) {
	Product.update({ _id: productId }, { $set: { instock: instock }}).exec(function(err, results) {});
};