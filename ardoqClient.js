var Backbone = require("backbone");
var querystring = require('querystring');
var _ = require('underscore');
var https = null;

var _models = require("./collections/models");
var t = require("./models/model");
var Models = new _models();
var _workspaces = require("./collections/workspaces");
var Workspaces = new _workspaces();

module.exports = function(hostname, username, password, token, organization) {
  var org = organization || "demo";
  this.port = hostname.replace(/.*\:(\d+).*/, "$1");
  if (this.port === hostname) {
    this.port = null;
    if (hostname.indexOf("https") > -1) {
      this.port = 443;
    }
  }

  this.origHost = this.host = hostname || 'https://app.ardoq.com';

  this.host = this.host.replace(/^.+\/\/(.*?):*\d*$/, "$1");
  console.log("Connecting to: " + this.host + ", port:" + this.port);
  var that = this;



  function performRequest(endpoint, method, data, success, error) {

    if (that.origHost.indexOf("http:") > -1) {
      https = require("http");
    } else {
      https = require("https");
    }
    var dataString = data ? JSON.stringify(data) : "null";
    var headers = {
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "User-Agent": "ardoq-jsdoc",
      "Connection": "close",
      "Cookie": "organization=" + org,
      "Authorization": "Token token=" + token
    };
    if (method == 'GET') {
      endpoint += data ? '?' + querystring.stringify(data) : "";

    } else {
      headers['Content-Type'] = 'application/json';
      //headers['Content-Length'] = dataString.length;
    }

    var options = {
      hostname: that.host,
      path: endpoint,
      port: that.port,
      method: method,
      headers: headers
    };
    var req = https.request(options, function(res) {
      //res.setEncoding('utf-8');

      var responseString = '';

      res.on('data', function(data) {

        responseString += data;
      });

      res.on('end', function() {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          var responseObject = JSON.parse(responseString);
          success(responseObject);
        } else {
          console.log(res.statusCode + ": " + req.path);
          console.error("Error occured: " + res.statusCode + ": " + responseString);
          console.error("Request was: ", dataString);
          error(responseString);
        }
      });
      res.on('error', function(error) {
        console.log("Error", error);
      });

    });
    if (dataString !== "") {
      req.write(dataString);
    }
    req.end();
  }

  Backbone.sync = function(method, model, opts) {
    var url = model.url ? model.url() : model.urlRoot;
    if (method === "read") {
      performRequest(url, "GET", null, opts.success, opts.error);
    }
    if (method === "create") {
      if (model.attributes.path) {
        console.log("Creating model: " + model.attributes.path + ": " + model.attributes.name);
      }
      performRequest(url, "POST", model.attributes, opts.success, opts.error);
    } else if (method === "update") {
      performRequest(url, "PUT", model.attributes, opts.success, opts.error);
    } else if (method === "delete") {
      performRequest(url, "DELETE", null, opts.success, opts.error);
    }
  };

  this.performRequest = _.bind(performRequest,this);

  this.getModels = function(cb) {
    if (!Models.length) {
      Models.fetch({
        success: function() {
          cb(Models);
        }
      });
    } else {
      cb(Models);
    }
  };
  this.getWorkspaces = function(cb) {
    if (!Workspaces.length) {
      Workspaces.fetch({
        success: function() {
          cb(Workspaces);
        }
      });
    } else {
      cb(Workspaces);
    }
  };

};
