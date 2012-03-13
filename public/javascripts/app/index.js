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
        uploader: "../libs/uploader",

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

        uploader: {
            deps: ["jquery"]
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
    "use!layoutmanager",

    // Modules
    "modules/utils",
    "modules/budgets",
    "modules/budget/index"
], function (cc, jQuery, Backbone, LayoutManager, Utils, Budgets, Budget) {

    "use strict";

    // Treat the jQuery ready function as the entry point to the application.
    // Inside this function, kick-off all initialization, everything up to this
    // point should be definitions.
    jQuery(function ($) {

        // Shorthand the application namespace
        var Router,
            app = cc.app,
            main_render = function (el) {
                $("#main").html(el);
            };

        // Defining the application router, you can attach sub routers here.
        Router = Backbone.Router.extend({
            // Super-simple layout swapping and reusing
            useLayout: function (name) {

                // Create the new layout and set it as current.
                this.currentLayout = new Backbone.LayoutManager({
                    template: name,
                });

                // return the current layout
                return this.currentLayout;

            },

            // routes definition
            routes: {
                "": "index",
                "budget/:id": "budget",
                "budget/:id/:tab": "budget"
            },

            // ROUTE: index
            index: function () {

                var main = this.useLayout("main");

                // fetch some data
                app.budgets = new Budgets.Collection();

                // update budgets
                app.budgets.fetch().then(function () {
                    // Set all the views
                    main.setViews({
                        ".controlbar": new Utils.Views.RefreshBar(),
                        ".canvas": new Budgets.Views.Index({ collection: app.budgets })
                    });

                    // Render to the page
                    main.render(main_render);
                });

            },

            // ROUTE: budget
            budget: function (id, tab) {

                // vars
                var budget,
                    set_render,
                    tab = tab || 'budget',
                    main = this.useLayout("main");

                set_render = function (budget) {
                    // Set all the views
                    main.setViews({
                        '.controlbar': new Utils.Views.BudgetBar(),
                        ".canvas": new Budget.Views.Index({
                            tab: tab,
                            model: budget
                        })
                    });

                    // Render to the page
                    main.render(main_render);
                };

                // fetch the collection if it isn't there
                if (app.budgets === undefined) {
                    app.budgets = new Budgets.Collection();
                }

                if (app.budgets.length === 0) {

                    // fetch the budget from the server
                    budget = new Budgets.Model({ '_id': id });

                    // update the budget
                    budget.fetch({

                        // on success, update the view
                        success: function (model, resp) {
                            // add the newly retrieved model to the collection
                            app.budgets.add(model);
                            // render the views
                            set_render(model);
                        }

                    });

                } else {

                    // fetch the budget from the collection
                    budget = app.budgets.get(id);

                    // update the budget
                    budget.fetch({

                        // on success, update the view
                        success: function (model) {
                            // render the views
                            set_render(model);
                        }

                    });

                }

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
        $(document).on("click", "a:not([data-bypass])", function (evt) {
            // Get the anchor href and protcol
            var href = $(this).attr("href"),
                protocol = this.protocol + "//";

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