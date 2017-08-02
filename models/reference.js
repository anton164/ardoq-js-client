var Backbone = require("./basicmodel");
module.exports = Backbone.extend({
  idAttribute: "_id",
  urlRoot: '/api/reference',
  reference: true,
  localInit: function() {
    var that = this;
    if (this.isNew() && this.attributes.sourceComp && this.attributes.targetComp) {
      if (this.attributes.sourceComp.isNew()) {
        this.attributes.sourceComp.once("sync", function() {
          console.log(that.attributes);
          that.set("source", that.attributes.sourceComp.id);
          that.checkSave();
        });
      } else {
        this.set("source", this.attributes.sourceComp.id);
        this.checkSave();
      }

      if (this.attributes.targetComp.isNew()) {
        this.attributes.targetComp.once("sync", function() {
          that.set("target", that.attributes.targetComp.id);
          that.checkSave();
        });
      } else {
        this.set("target", this.attributes.targetComp.id);
        this.checkSave();
      }
    }
  },
  checkSave: function() {
    if (this.get("target") && this.get("source")) {
      delete this.attributes.targetComp;
      delete this.attributes.sourceComp;
      this.save();
    }
  }
});
