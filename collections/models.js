var Backbone = require("backbone");
var Model = require("../models/model");
module.exports = Backbone.Collection.extend({
	idAttribute: "_id",
	urlRoot: '/api/model',
	model: Model
});