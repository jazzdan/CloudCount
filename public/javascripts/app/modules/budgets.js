define([
    "namespace",

    // Libs
    "use!backbone",

    // Modules
    "modules/budget/index",
    "modules/utils",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone, Budget, Utils) {

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
     * Budget Form
     */
    Budgets.Views.Form = Backbone.LayoutManager.View.extend({

        template: 'budgets/form',

        model: Budget.Model,

        extract: function () {
            var fields,
                data,
                model;

            fields = $('.field', this.$el);
            data = {};

            _.each(fields, function (field) {
                var field = $(field);
                data[field.data('attr')] = field.val();
            });

            return new this.model(data);

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
            'click tbody tr': 'select',
            // events:
            'click .new_budget': 'new_budget'
        },

        // new budget event
        new_budget: function (e) {

            // the ol' this-that
            var that = this,
                modal,
                close_modal;

            e.preventDefault();
            e.stopPropagation();

            // render the modal
            modal = this.view('.tmp', new Utils.Views.Modal({
                title: 'New Budget',
                action: 'Save',
                content: Budgets.Views.Form
            }));

            close_modal = function () {
                that.delete_view('.tmp');
                modal.unbind();
            };

            // render the modal
            modal.render();

            // bind modal confirm event
            modal.bind('confirm', function () {
                var model = modal.content.extract();
                if (model.isValid()) {
                    close_modal();
                } else {
                    alert('invalid submission');
                }
            });

            // bind modal close event
            modal.bind('close', function () {
                close_modal();
            });

        },

        // initialize the vew
        initialize: function () {

            // the ol' this-that
            var that = this;

            // refresh the view if a budget is deleted
            this.collection.bind('remove', function () {
                that.render();
            });

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

        delete_view: function (key) {
            this.views[key].remove();
            delete this.views[key];
        }

    });

    // Required, return the module for AMD compliance
    return Budgets;

});