var Backbone = require("./basicmodel");

var Components = require("../collections/components");
Components.uniqueCollection = [];
var Tags = require("../collections/tags");
var References = require("../collections/references");

/**
 * Workspace contains all data about a given workspace.
 * @Class Workspace
 */
module.exports = Backbone.extend({
  idAttribute: "_id",
  urlRoot: '/api/workspace',
  /**
   * @method getComponents
   * @return {Component} A collection of components
   */
  getComponents: function() {
    return Components.where({
      rootWorkspace: this.id
    });
  },
  getTags: function() {
    return Tags.where({
      rootWorkspace: this.id
    });
  },
  getReferences: function() {
    return References.where({
      rootWorkspace: this.id
    });
  },

  addTag: function(data) {
    return this.add(data, Tags);
  },
  addReference: function(data) {
    return this.add(data, References);
  },
  addComponent: function(data) {
    return this.add(data, Components);
  },

  getReferenceCollection: function() {
    return References;
  },
  getComponentCollection: function() {
    return Components;
  },
  add: function(data, collection) {
    data.rootWorkspace = this.id;
    var c = new collection.model(data);

    collection.add(c);
    return c;
  },

  load: function(cb) {
    var ag = Backbone.extend({
      urlRoot: this.url() + "/aggregated"
    });
    this.aggregatedSpace = new ag();
    var that = this;
    this.aggregatedSpace.fetch({
      success: function(model) {
        Components.add(model.attributes.components);
        References.add(model.attributes.references);
        Tags.add(model.attributes.tags);
        cb(that);
      }
    });
  }
});