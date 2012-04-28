define([
    "namespace",

    // Libs
    "use!backbone",

    // Modules
    "modules/dashboard/index",
    "modules/utils",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone, Budget, Utils) {

    "use strict";

    var app = cc.app,
        Budgets = cc.module();

    /**
     * Model
     *
     * Budget model
     */
    Budgets.Model = Budget.Model;

    /**
     * Collection
     *
     * Budget collection
     */
    Budgets.Collection = Backbone.Collection.extend({

        /**
         * Model
         *
         * model the collection contains
         *
         * @var Model
         */
        model: Budgets.Model,

        /**
         * URL
         *
         * Collection's associated URL
         *
         * @return string
         */
        url: function () {
            return '/budgets';
        }

    });

    /**
     * Row
     *
     * Inidividual budget in the list
     */
    Budgets.Views.Row = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path the to view template
         *
         * @var string
         */
        template: 'budgets/row',

        /**
         * Tag Name
         *
         * defines the view's wrapper tag
         *
         * @var string
         */
        tagName: 'tr',

        /**
         * Events
         *
         * defines event listeners and handlers
         *
         * @var object
         */
        events: {
            'click .delete': 'delete_budget',
            'dblclick': 'edit'
        },

        /**
         * Edit
         *
         * opens the edit budget view
         *
         * @return undefined
         */
        edit: function () {
            $('.edit', this.$el).click();
        },

        /**
         * Delete Budget
         *
         * Deletes the budget from the DB & view
         *
         * @param  event     e
         * @return undefined
         */
        delete_budget: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm("Are you sure you want to delete this budget?")) {
                this.model.destroy();
            }
        },

        /**
         * Serialize
         *
         * package data for rendering
         *
         * @return object
         */
        serialize: function () {
            var data = this.model.toJSON();

            data.starts = Utils.Date.for_humans(data.starts);
            data.ends = Utils.Date.for_humans(data.ends);

            return data;
        }

    });

    /**
     * Index
     *
     * List of budgets
     */
    Budgets.Views.Index = Utils.Views.List.extend({

        /**
         * Template
         *
         * relative path to the view's template
         *
         * @var string
         */
        template: 'budgets/list',

        /**
         * Events
         *
         * defines event listeners and handlers
         *
         * @return undefined
         */
        events: {
            // inherited events:
            'click tbody tr': 'select',
            // events:
            'click .new_budget': 'new_budget'
        },

        /**
         * New Budget
         *
         * flow for creating a new budget
         *
         * @param  event     e
         * @return undefined
         */
        new_budget: function (e) {

            var that = this,
                modal,
                close_modal;

            e.preventDefault();
            e.stopPropagation();

            modal = this.view('.tmp', new Utils.Views.Modal({
                title: 'New Budget',
                action: 'Save',
                content: Budget.Views.Form
            }));

            /**
             * Close Modal
             *
             * removes modal from the view
             *
             * @return undefined
             */
            close_modal = function () {
                that.delete_view('.tmp');
                modal.unbind();
            };

            modal.render();

            modal.bind('confirm', function () {

                if (modal.content.save()) {

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

            modal.bind('close', function () {
                close_modal();
            });

        },

        /**
         * Initialize
         *
         * setup the view
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {

            var that = this;

            this.collection.bind('remove', function () {
                that.render();
            });

            this.collection.bind('add', function () {
                that.render();
            });

            this.collection.bind('reset', function () {
                that.render();
            });
        },

        /**
         * Render
         *
         * builds and displays the view
         *
         * @param  layoutManager layout
         * @return view
         */
        render: function (layout) {

            var view = layout(this);

            this.collection.each(function (budget) {
                view.insert("tbody.budgets", new Budgets.Views.Row({
                    model: budget
                }));
            });

            return view.render(this.collection);
        },

        /**
         * Delete View
         *
         * destroys a nested view
         *
         * @param  string    key
         * @return undefined
         */
        delete_view: function (key) {
            this.views[key].remove();
            delete this.views[key];
        }

    });

    // return the module for AMD compliance
    return Budgets;

});