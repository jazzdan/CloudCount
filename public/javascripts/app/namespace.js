define([
  // Libs
  "jquery",
  "use!underscore",
  "use!backbone",

  // Plugins
  "use!layoutmanager"
],

function($, _, Backbone) {

  // Customize the LayoutManager
  Backbone.LayoutManager.configure({

    /**
     * template & layout paths
     */
    paths: {
      layout: "http://" + document.location.host + "/public/javascripts/app/templates/layouts/",
      template: "http://" + document.location.host + "/public/javascripts/app/templates/"
    },

    /**
     * Fetch (for retrieving templates)
     */
    fetch: function(path) {

      // automatically append .hbs extension
      path = path + ".hbs";

      // setup and async method
      var done = this.async();

      var JST = window.JST = window.JST || {};

      // Should be an instant synchronous way of getting the template, if it
      // exists in the JST object.
      if (JST[path]) {
        return done(JST[path]);
      }

      // Fetch it asynchronously if not available from JST
      $.get(path, function(contents) {

        // compile the returned template with Handlebars
        var tmpl = Handlebars.compile(contents);

        // store the template for future use
        JST[path] = tmpl;

        // callback the async method
        done(tmpl);
      });
    },

    // render the template
    render: function(template, context) {
      return template(context);
    }

  });
  
  var cleanup = function(){
    alert('cleaning up');
    this.remove();
    this.unbind();
    if (this.onCleanup){
      this.onCleanup();
    }
  }

  Backbone.View.prototype.cleanup = cleanup;
  Backbone.LayoutManager.prototype.cleanup = cleanup;
  Backbone.LayoutManager.View.prototype.cleanup = cleanup;

  return {
    // Create a custom object with a nested Views object
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Keep active application instances namespaced under an app object.
    app: _.extend({}, Backbone.Events)
  };

});