var Backbone = require("backbone");
var Tag = require("../models/tag");
var _tags = Backbone.Collection.extend({
  idAttribute: "_id",
  urlRoot: '/api/tag',
  model: Tag
});
module.exports = new _tags();