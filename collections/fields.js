var Backbone = require("backbone");
var Field = require("../models/field");
module.exports = Backbone.Collection.extend({
	idAttribute: "_id",
	urlRoot: '/api/field',
	model: Field
});
