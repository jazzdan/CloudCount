define([
    "namespace",

    // Libs
    "use!backbone",

    // Modules
    "modules/budget/index",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone, Budget) {

    "use strict";

    // Shorthand the app
    var app = cc.app,
        Budgets = cc.module(); // Create a new module

    /**
     * Budget Modal (from Budget module)
     */
    Budgets.Model = Budget.Model;

    /**
     * Budgets Collection
     */
    Budgets.Collection = Backbone.Collection.extend({

        // set the collection's model
        model: Budgets.Model,

        // set the collection URL
        url: function () {
            return '/budgets';
        }

    });

    /**
     * Budget Row
     */
    Budgets.Views.Row = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budgets/row',

        // wrapper tag
        tagName: 'tr',

        // events
        events: {
            'click .delete': 'delete_budget'
        },

        // delete budget event
        delete_budget: function (e) {
            e.preventDefault();
            alert('delete');
        },

        // serialize data for rendering
        serialize: function () {
            return this.model.toJSON();
        },

    });

    /**
     * Budgets Index
     */
    Budgets.Views.Index = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budgets/list',

        // render function
        render: function (layout) {
            var view = layout(this);

            // render the budgets
            this.collection.each(function (budget) {
                view.insert("tbody.budgets", new Budgets.Views.Row({
                    model: budget
                }));
            });

            // render the view
            return view.render(this.collection);
        },

    });

    // Required, return the module for AMD compliance
    return Budgets;

});