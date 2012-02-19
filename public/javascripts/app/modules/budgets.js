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
  var Budgets = cc.module();

  Budgets.Views.List = Backbone.LayoutManager.View.extend({
    template: "budgets/list",

    tagName: "div"
  });

  // Required, return the module for AMD compliance
  return Budgets;

});