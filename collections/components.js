var Backbone = require("backbone");
var Component = require("../models/component");
var _components = Backbone.Collection.extend({
  idAttribute: "_id",
  urlRoot: '/api/component',
  model: Component,
  compNames: []
});
module.exports = new _components();