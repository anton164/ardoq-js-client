var Backbone = require("backbone");
module.exports = Backbone.Model.extend({
  setIfDiff: function(key, val) {
    if (this.attributes[key] !== val) {
      this._set(key, val);
    }
  },
  initialize: function(props) {
    this.oldSave = this.save;
    this.save = this._save;
    this._set = this.set;
    //this.set = this.setIfDiff;
    if (this.localInit) {
      this.localInit(props);
    }
  },
  _save: function(obj, prop) {
    var that = this;
    if (this.saving) {
      return false;
    }
    this.saving = true;
    this.once("sync", function() {
      that.saving = false;
    });
    if (obj) {
      this.oldSave(obj, prop);
    } else if (this.isNew() || this.hasChanged()) {
      this.oldSave(obj, prop);
    }
  }
});