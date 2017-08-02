var Backbone = require("backbone");
var Workspace = require("../models/workspace");
module.exports = Backbone.Collection.extend({
  idAttribute: "_id",
  urlRoot: '/api/workspace',
  model: Workspace
});