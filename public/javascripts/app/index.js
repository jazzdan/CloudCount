// Set the require.js configuration for your application.
require.config({

    /**
     * Paths
     *
     * paths specified for the modul loader
     *
     * @var object
     */
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

    /**
     * Use
     *
     * depenency management with Use plugin
     *
     * @var object
     */
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
    "modules/dashboard/index"

], function (cc, jQuery, Backbone, LayoutManager, Utils, Budgets, Budget) {

    "use strict";

    // Treat the jQuery ready function as the entry point to the application.
    // Inside this function, kick-off all initialization, everything up to this
    // point should be definitions.
    jQuery(function ($) {

        var Router,
            app = cc.app,
            main_render = function (el) {
                $("#main").html(el);
            };

        /**
         * Router
         *
         * handles all client-side navigation
         */
        Router = Backbone.Router.extend({

            /**
             * Use Layout
             *
             * simple layout swapping/caching
             *
             * @param  string name
             * @return layout
             */
            useLayout: function (name) {

                // Create the new layout and set it as current.
                this.currentLayout = new Backbone.LayoutManager({
                    template: name
                });

                // return the current layout
                return this.currentLayout;
            },

            /**
             * Routes
             *
             * defines valid application routes
             *
             * @var object
             */
            routes: {
                "": "index",
                "budget/:id": "budget",
                "budget/:id/:tab": "budget"
            },

            /**
             * Index
             *
             * route to app's index
             *
             * @return undefined
             */
            index: function () {

                var main = this.useLayout("main");

                app.budgets = new Budgets.Collection();

                app.current_budget = undefined;

                app.budgets.fetch().then(function () {

                    main.setViews({
                        // ".controlbar": new Utils.Views.RefreshBar(),
                        ".canvas": new Budgets.Views.Index({ collection: app.budgets })
                    });

                    main.render(main_render);
                });

            },

            /**
             * Budget
             *
             * route to a budget
             *
             * @param  number    id
             * @param  string    t
             * @return undefined
             */
            budget: function (id, t) {

                var budget,
                    set_render,
                    tab = t || 'budget',
                    main = this.useLayout("main");

                /**
                 * Set Render
                 *
                 * render the view
                 *
                 * @param  model     budget
                 * @return undefined
                 */
                set_render = function (budget) {

                    main.setViews({
                        // '.controlbar': new Utils.Views.BudgetBar(),
                        ".canvas": new Budget.Views.Index({
                            tab: tab,
                            model: budget
                        })
                    });

                    main.render(main_render);
                };

                if (app.budgets === undefined) {
                    app.budgets = new Budgets.Collection();
                }

                if (app.budgets.length === 0) {

                    budget = new Budgets.Model({ '_id': id });

                    app.current_budget = budget;

                    budget.refresh({

                        /**
                         * Error
                         *
                         * performed on unsuccessful fetch
                         *
                         * @param  model     model
                         * @param  object    response
                         * @return undefined
                         */
                        error: function (model, response) {
                            console.log('FAIL: count not get budget: ');
                            console.log(response);
                        },

                        /**
                         * Success
                         *
                         * performed on successful fetch
                         *
                         * @param  object    response
                         * @param  model     model
                         * @return undefined
                         */
                        success: function (model, resp) {
                            app.budgets.add(model);
                            set_render(model);
                        }

                    });

                } else {

                    budget = app.budgets.get(id);

                    app.current_budget = budget;

                    budget.refresh({

                        /**
                         * Error
                         *
                         * performed on unsuccessful fetch
                         *
                         * @param  model     model
                         * @param  object    response
                         * @return undefined
                         */
                        error: function (collection, response) {
                            console.log('FAIL: could not fetch collection:');
                            console.log(response);
                        },

                        /**
                         * Success
                         *
                         * performed on successful fetch
                         *
                         * @param  object    response
                         * @param  model     model
                         * @return undefined
                         */
                        success: function (model) {
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