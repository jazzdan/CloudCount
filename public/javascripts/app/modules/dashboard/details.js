define([

    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",

    // uploader script
    "uploader",

    // Plugins
    "use!layoutmanager"

], function (cc, Backbone, Utils) {

    "use strict";

    var app = cc.app,
        Details = cc.module(); // Create a new module

    /**
     * Form
     *
     * form for editting budget details
     */
    Details.Views.Form = Utils.Views.Form.extend({

        /**
         * Template
         *
         * relative path to template
         *
         * @var string
         */
        template: 'budgets/form',

        /**
         * Initialize
         *
         * setup the view
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {

            _.bindAll(this, 'show_errors');

            this.model = app.current_budget;

            this.model.bind('error', this.show_errors);

        }

    });

    /**
     * Index
     *
     * Base view for budget details
     */
    Details.Views.Index = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to template
         *
         * @var string
         */
        template: 'dashboard/details/index',

        /**
         * Events
         *
         * event listeners and handlers
         *
         * @var object
         */
        events: {
            'click .edit': 'edit'
        },

        /**
         * Edit
         *
         * flow for editting budget details
         *
         * @param  event     e
         * @return undefined
         */
        edit: function (e) {

            var that = this,
                modal,
                close_modal;

            e.preventDefault();
            e.stopPropagation();

            modal = this.view('.tmp', new Utils.Views.Modal({
                title: 'Edit Budget',
                action: 'Save',
                content: Details.Views.Form
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

            modal.render().then(function () {
                modal.content.hydrate();
            });

            modal.bind('confirm', function () {

                if (modal.content.save()) {

                    that.budget.fetch({
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
         * setup view
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {

            var that = this;

            this.budget = opts.budget;

            this.budget.bind("change", function () {
                that.render();
            });

        },

        /**
         * Serialize
         *
         * package data for rendering
         *
         * @return object
         */
        serialize: function () {
            var data = this.budget.toJSON();
            data.starts = Utils.Date.for_humans(data.starts);
            data.ends = Utils.Date.for_humans(data.ends);
            return data;
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

    // return the module for AMD
    return Details;

});