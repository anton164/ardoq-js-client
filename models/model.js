var Backbone = require("./basicmodel");
var _ = require("underscore");
module.exports = Backbone.extend({
  idAttribute: "_id",
  urlRoot: '/api/model',
  getTypeById: function(name) {
    if (!this._flattenedModel) {
      this.fixModel();
    }
    return this._flattenedModel[name];
  },
  getTypeByName: function(name) {
    if (!this._flattenedModel) {
      this.fixModel();
    }
    var foundType;
    _.each(this._flattenedModel, function(type, key) {
      if (type.name === name) {
        foundType = key;
        return;
      }
    });
    return foundType;
  },
  getAllTypes: function() {
    if (!this._flattenedModel) {
      this.fixModel();
    }
    return this._flattenedModel;
  },
  getTypeByComponent: function(comp) {
    var parent = comp.getParent();
    var modelList = this.get("root");
    if (parent) {
      modelList = this.getTypeById(parent.getTypeId()).children;
    }
    var modelType = modelList[comp.get("typeId")] || this.getFirstModelType(modelList);
    return modelType;
  },
  getComponentTypes: function(comp) {
    var parent = comp.getParent();
    var modelList = this.get("root");
    if (parent) {
      var type = this.getTypeById(parent.getTypeId());
      modelList = (type) ? type.children : null;
      if (!modelList) {
        modelList = [];
      }
    }
    return modelList;
  },
  resetModel: function() {
    this.fixModel();
  },
  getReferenceTypeByName: function(name) {
    var refTypes = this.get("referenceTypes");
    var foundType = 0;
    _.each(refTypes, function(ref, key) {
      if (ref.name === name) {
        foundType = key;
      }
    });
    return parseInt(foundType, 10);
  },
  fixModel: function(children) {
    var that = this;
    var localChildren = (children) ? children.children : this.attributes.root;
    if (!children) {
      this._flattenedModel = {};
      this._parentList = {};

    }
    var index = 1;
    _.each(localChildren, function(model, key) {
      if (!that._flattenedModel[key]) {
        //console.log("Fixing key: ", key);
        that._parentList[key] = localChildren;
        that._flattenedModel[key] = model;
        model.index = index++;
        that.fixModel(model);
      } else {
        throw new RangeError("Model already contains type of name: " + key);
      }
    });
  },
  getParentType: function(typeId) {
    return this._parentList[typeId];
  },
  removeChild: function(typeId) {
    var parent = this.getParentType(typeId);
    if (parent) {
      var children = (parent.children) ? parent.children : parent;
      delete children[typeId];
      this.trigger('change');
    }
  },
  allowedToLinkFrom: function(comp) {
    return true;
  },
  allowedToLinkTo: function(from, to) {
    var i = 0;
    if (from && to) {
      var linkList = this.getTypeByComponent(from).canLinkTo;
      if (_.isString(linkList)) {
        return linkList === to.getTypeId();
      } else if (linkList) {
        for (i; i < linkList.length; i++) {
          if (linkList[i] === to.getTypeId()) {
            return true;
          }
        }
      }
    }
    return false;
  }
});
