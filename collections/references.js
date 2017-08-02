var Backbone = require("backbone");
var Reference = require("../models/reference");
var Components = require("./components");
var _references = Backbone.Collection.extend({
  idAttribute: "_id",
  urlRoot: '/api/reference',
  model: Reference,
  componentMap: {},
  initialize: function() {
    var that = this;
    this.on("add", function(ref) {
      var sourceId = ref.attributes.sourceComp ? ref.attributes.sourceComp.cid : Components.get(ref.get("source")).cid;
      var targetId = ref.attributes.targetComp ? ref.attributes.targetComp.cid : Components.get(ref.get("target")).cid;
      that.componentMap[sourceId + ref.get("type") + targetId] = ref;
    });
  },
  getRef: function(sourceComp, targetComp, type) {
    return this.componentMap[sourceComp.cid + type + targetComp.cid];
  }

});

module.exports = new _references();