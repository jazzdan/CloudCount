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
  var Test = cc.module();

  Test.Views.Title = Backbone.LayoutManager.View.extend({
    template: "test/title",

    tagName: "div"
  });

  // Required, return the module for AMD compliance
  return Test;

});