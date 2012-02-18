define([
  "namespace",

  // Libs
  "use!backbone",

  // Plugins
  "use!layoutmanager"
],

function(cc, Backbone) {

  // Shorthand the app
  var app = cc.app;

  // Create a new module
  var Utils = cc.module();

  Utils.Views.ControlBar = Backbone.LayoutManager.View.extend({
    template: "utils/controlbar",

    tagName: "div"
  });

  // Required, return the module for AMD compliance
  return Utils;

});