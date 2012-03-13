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
            'click .delete': 'delete',
            'dblclick': 'edit'
        },

        edit: function () {
            $('.edit', this.$el).click();
        },

        // delete budget event
        delete: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (confirm("Are you sure you want to delete this budget?")) {
                this.model.destroy();
            }
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

        // events hash
        events: {
            'click tr': 'select'
        },

        // select event
        select: function (e) {
            // find the row from the event target
            var el = $(e.target).closest('tr');

            // catch the event
            e.stopPropagation();

            // select the row (if it isn't already)
            if (!el.hasClass('selected')) {
                $('.selected').removeClass('selected');
                el.addClass('selected');
            }
        },

        // initialize the vew
        initialize: function () {
            var that = this;

            // refresh the view if a budget is deleted
            this.collection.bind('remove', function () {
                that.render();
            });
        },

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