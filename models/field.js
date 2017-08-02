var Backbone = require("./basicmodel");
module.exports = Backbone.extend({
  idAttribute: "_id",
  urlRoot: '/api/field'
});
