define([
    "namespace",

    // Libs
    "jquery",
    "use!underscore",
    "use!backbone",

    // Modules
    "modules/budget/index",
    "modules/utils",

    // Plugins
    "use!layoutmanager"
], function (cc, $, _, Backbone, Budget, Utils) {

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
            if (window.confirm("Are you sure you want to delete this budget?")) {
                this.model.destroy();
            }
        },

        // serialize data for rendering
        serialize: function () {
            return this.model.toJSON();
        }

    });

    /**
     * Budgets Index
     *
     * @extends Utils:List
     */
    Budgets.Views.Index = Utils.Views.List.extend({

        // view template
        template: 'budgets/list',

        // events hash (explicitly delcare it so we don't forget the inherited events
        events: {
            // inherited events:
            'click tbody tr': 'select'
            // events:
        },

        list: 'tbody.budgets',

        // initialize the vew
        initialize: function () {

            _.bindAll(this, 'enter_down');

            // the ol' this-that
            var that = this;

            // initialize keyboard events
            this.initialize_keyboard();

            // refresh the view if a budget is deleted
            this.collection.bind('remove', function () {
                that.render();
            });
        },

        // keyboard event functions
        keyboard: {
            // inherited events
            'k': 'previous_row',
            'j': 'next_row',
            // new events
            'enter': 'enter_down'
        },

        // enter-down keyboard event
        enter_down: function (event) {
            var selected = this.get_selected();
            if (selected !== undefined) {
                selected.edit();
            }
        },

        // render function
        render: function (layout) {

            // the ol' this-that
            var view = layout(this);

            // render the budgets
            this.collection.each(function (budget) {
                view.insert("tbody.budgets", new Budgets.Views.Row({
                    model: budget
                }));
            });

            // render the view
            return view.render(this.collection);
        }

    });

    // Required, return the module for AMD compliance
    return Budgets;

});