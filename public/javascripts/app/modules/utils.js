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

  Utils.Views.RefreshBar = Backbone.LayoutManager.View.extend({
    template: "utils/controlbar-refresh",

    tagName: "div"
  });

  Utils.Views.BudgetBar = Backbone.LayoutManager.View.extend({
    template: "utils/controlbar-budget",

    tagName: "div"
  });

  // Required, return the module for AMD compliance
  return Utils;

});