// Set the require.js configuration for your application.
require.config({
  paths: {
    // JavaScript folders
    libs: "../libs",
    plugins: "../plugins",

    // Libraries
    jquery: "../libs/jquery",
    underscore: "../libs/underscore",
    backbone: "../libs/backbone",
    handlebars: "../libs/handlebars",

    // Plugins
    use: "../plugins/use",
    layoutmanager: "../plugins/backbone.layoutmanager",
    bootstrap: "../plugins/bootstrap"
  },

  use: {
    backbone: {
      deps: ["use!underscore", "jquery"],
      attach: "Backbone"
    },

    underscore: {
      attach: "_"
    },
    
    layoutmanager: {
      deps: ["use!backbone", "handlebars"]
    },

    bootstrap: {
      deps: ["jquery"]
    }
  }
});

require([
  "namespace",

  // Libs
  "jquery",
  "use!backbone",

  // Modules
  "modules/utils",
  "modules/budgets",
  "modules/budget/index"
],

function (cc, jQuery, Backbone, Utils, Budgets, Budget) {
  // Treat the jQuery ready function as the entry point to the application.
  // Inside this function, kick-off all initialization, everything up to this
  // point should be definitions.
  jQuery(function($) {

    // Shorthand the application namespace
    var app = cc.app;

    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
      // Super-simple layout swapping and reusing
      useLayout: function(name) {
        var currentLayout = this.currentLayout;

        // If there is an existing layout and its the current one, return it.
        if (currentLayout && currentLayout.options.template == name) {
          return currentLayout;
        }

        // Create the new layout and set it as current.
        this.currentLayout = new Backbone.LayoutManager({
          template: name
        });

        return this.currentLayout;
      },

      // routes definition
      routes: {
        "": "index",
        "budget/:id": "budget"
      },

      // ROUTE: index
      index: function() {
        var main = this.useLayout("main");

        // fetch some data
        app.budgets = new Budgets.Collection();

        // update budgets
        app.budgets.fetch({

          // on success render the views
          success: function (collection, response) {

            // Set all the views
            main.setViews({
              ".controlbar": new Utils.Views.RefreshBar(),
              ".canvas": new Budgets.Views.Index({ collection: app.budgets })
            });

            // Render to the page
            main.render(function(el) {
              $("#main").html(el);
            });

          }

        });

      },

      // ROUTE: budget
      budget: function(id) {

        // set the layout
        var main = this.useLayout("main");

        // fetch the collection if it isn't there
        if(!app.budgets) app.budgets = new Budgets.Collection();

        // refresh the budgets collection
        app.budgets.fetch({

          // on success render the views
          success: function (collection, response) {

            // fetch the budget we need
            var budget = app.budgets.get(id);

            // Set all the views
            main.setViews({
              '.controlbar': new Utils.Views.BudgetBar(),
              ".canvas": new Budget.Views.Index({
                model: budget
              })
            });

            // Render to the page
            main.render(function(el) {
              $("#main").html(el);
            });

          }

        });

      }

    });
    
    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    app.router = new Router();

    // Trigger the initial route and enable HTML5 History API support
    Backbone.history.start({ pushState: true });

    // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router.  If the link has a data-bypass
    // attribute, bypass the delegation completely.
    $(document).on("click", "a:not([data-bypass])", function(evt) {
      // Get the anchor href and protcol
      var href = $(this).attr("href");
      var protocol = this.protocol + "//";

      // Ensure the protocol is not part of URL, meaning its relative.
      if (href.slice(0, protocol.length) !== protocol) {
        // Stop the default event to ensure the link will not cause a page
        // refresh.
        evt.preventDefault();

        // This uses the default router defined above, and not any routers
        // that may be placed in modules.  To have this work globally (at the
        // cost of losing all route events) you can change the following line
        // to: Backbone.history.navigate(href, true);
        app.router.navigate(href, true);
      }
    });
  });
});