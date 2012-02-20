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
  "modules/budget"
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

      routes: {
        "": "index",
        "budget/:cid": "budget"
      },

      index: function() {
        var main = this.useLayout("main");

        // fetch some data
        app.budgets = new Budgets.Collection();
        app.budgets.fetch();
        
        BUDGETS_COL = app.budgets;

        // Set all the views
        main.setViews({
          ".controlbar": new Utils.Views.RefreshBar(),
          ".canvas": new Budgets.Views.List({ collection: app.budgets })
        });

        // Render to the page
        main.render(function(el) {
          $("#main").html(el);
        });
      },

      budget: function(cid) {
        var main = this.useLayout("budget");

        budget = app.budgets.getByCid(cid);

        // Set all the views
        main.setViews({
          '.controlbar': new Utils.Views.BudgetBar(),
          '.nav': new Budget.Views.Nav(),
          '.section.budget': new Budget.Views.Budget(),
          '.section.description': new Budget.Views.Description(),
          '.section.attachments': new Budget.Views.Attachments(),
          '.section.notes': new Budget.Views.Notes(),
          '.section.audit': new Budget.Views.Audit()
        });

        // Render to the page
        main.render(function(el) {
          $("#main").html(el);
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