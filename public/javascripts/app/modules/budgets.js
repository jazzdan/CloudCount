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
     * Budget Form
     */
    Budgets.Views.Form = Backbone.LayoutManager.View.extend({

        // form template
        template: 'budgets/form',

        // initialize form
        initialize: function () {

            _.bindAll(this, 'show_errors');

            this.model = new Budget.Model();

            this.model.bind('error', this.show_errors);

        },

        // form is valid?
        isValid: function () {
            var has_errors;

            this.model.set(this.extract());

            has_errors = this.model.has_errors();

            return !has_errors;
        },

        // show errors
        show_errors: function () {

            var that = this;

            that.clear_errors();

            _.each(this.model.errors, function (error) {
                var field = $('.' + error.key, that.$el);
                field.addClass('error');
            });

        },

        // clear field errors
        clear_errors: function () {
            $('.error', this.$el).removeClass('error');
        },

        // extract form data
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

            return data;

        },

        save: function () {
            return (this.isValid()) ? this.model.save() : false;
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
            var data = this.model.toJSON(),
                starts = new Date(data.starts),
                ends = new Date(data.ends);

            // prettify dates
            data.starts = starts.toLocaleDateString();
            data.ends = ends.toLocaleDateString();

            return data;
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

                if (modal.content.save()) {

                    // refresh collection
                    that.collection.fetch({
                        success: function () {
                            close_modal();
                        },
                        error: function (collection, response) {
                            console.log('FAIL: could not fetch collection');
                            console.log(response);
                        }
                    });

                }

            });

            // bind modal close event
            modal.bind('close', function () {
                close_modal();
            });

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

            // refresh the view if a budget is added
            this.collection.bind('add', function () {
                that.render();
            });

            // refresh the view if the collection is refreshed
            this.collection.bind('reset', function () {
                that.render();
            });

        },

        // keyboard event functions
        keyboard: {
            'enter': 'enter_down'
        },

        // enter-down keyboard event
        enter_down: function (event) {
<<<<<<< HEAD

=======
>>>>>>> did a bunch of stuff...
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

        delete_view: function (key) {
            this.views[key].remove();
            delete this.views[key];
        }

    });

    // Required, return the module for AMD compliance
    return Budgets;

});