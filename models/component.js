var Backbone = require("./basicmodel");
/**
 * A Component represent a page
 * @class Component
 */
module.exports = Backbone.extend({
  idAttribute: "_id",
  urlRoot: '/api/component',
  localInit: function() {
    var that = this;
    if (!this.isNew()) {
      console.log("Loaded: " + this.get("name") + ": " + this.url());
    }
  },
  setParentObject: function(p) {
    this.parentCached = p;
    if (!this.get("parent")) {
      var that = this;
      if (this.parentCached.isNew()) {
        this.parentCached.once("sync", function(parent) {
          that.setIfDiff("parent", that.parentCached.attributes._id);
          that.checkSave();
        });
      } else if (that.parentCached.attributes._id) {
        that.setIfDiff("parent", that.parentCached.attributes._id);
        that.checkSave();
      }
    }
  },
  checkSave: function() {
    //    console.log("Checking if we can save: " + this.attributes.id + " - " + this.attributes.name + ":" + this.getParent(), this.changedAttributes());
    if (this.hasChanged()) {
      //    console.log("Has Changed:" + (!this.parentCached && !this.getParent()));
      if (!this.parentCached && !this.getParent()) {
        //    console.log("No parent for comp.");
        this.save();
      } else if (this.parentCached && this.getParent()) {
        //  console.log("Parent has been set: " + this.getParent().attributes.name);
        this.save();
      } else if (this.get("parent")) {
        //console.log("Has parent: " + this.get("parent"));
        this.save();
      }
    } else {
      //console.log("--- No changes required.");
    }
  },
  getParent: function() {
    var parent = this.get("parent");
    if (parent && this.collection) {
      return this.collection.get("parent");
    }
    return null;
  }
});