var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/myapp');

require('./models/cart_model.js');

var Product = mongoose.model('Product');

function addProduct(name, imageFile, price, description, instock) {
	var product = new Product({
		name:        name,
		imageFile:   imageFile,
		price:       price,
		description: description,
		instock:     instock
	});
	
	product.save(function(err, results) {
		console.log("Product " + name + " saved.");
	});
}

Product.remove().exec(function() {
	addProduct('Evil Heart', 'EvilHeart.JPG', 15.50, 'An evil heart',   5);
	addProduct('Me',         'Me.JPG',        20.00, 'A picture of me', 1);
});