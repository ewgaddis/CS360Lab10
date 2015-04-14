var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressSchema = new Schema({
	name:    String,
	address: String,
	city:    String,
	state:   String,
	zip:     String
}, { _id: false });

mongoose.model('Address', AddressSchema);

var BillingSchema = new Schema({
	cardType:    { type: String, enum: ['Visa', 'MasterCard', 'Amex'] },
	name:        String,
	number:      String,
	expireMonth: Number,
	expireYear:  Number,
	address:     [AddressSchema]
}, { _id: false });

mongoose.model('Billing', BillingSchema);

var ProductSchema = new Schema({
	name:        String,
	imageFile:   String,
	description: String,
	price:       Number,
	instock:     Number
});

mongoose.model('Product', ProductSchema);

var ProductQuantitySchema = new Schema({
	quantity: Number,
	product:  [ProductSchema]
}, { _id: false });

mongoose.model('ProductQuantity', ProductQuantitySchema);

var OrderSchema = new Schema({
	userId:    String,
	items:     [ProductQuantitySchema],
	shipping:  [AddressSchema],
	billing:   [BillingSchema],
	status:    { type: String, default: "Pending" },
	timestamp: { type: Date, default: Date.now }
});

mongoose.model('Order', OrderSchema);

var CustomerSchema = new Schema({
	userId:   { type: String, unique: true, required: true },
	shipping: [AddressSchema],
	billing:  [BillingSchema],
	cart:     [ProductQuantitySchema]
});

mongoose.model('Customer', CustomerSchema);