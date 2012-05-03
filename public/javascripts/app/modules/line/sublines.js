define([

    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",
    "modules/data",

    // Plugins
    "use!layoutmanager"

], function (cc, Backbone, Utils, Data) {

    "use strict";

    var app = cc.app,
        Sublines = cc.module();

    Sublines.Views.Transactions = Utils.Views.Base.extend({

        /**
         * Template
         *
         * relative path to template
         *
         * @var string
         */
        template: 'line/transactions'

    });

    Sublines.Views.Form = Utils.Views.Form.extend({

        /**
         * Template
         *
         * Relative path to view template 
         *
         * @var string
         */
        template: 'line/subline-form',

        /**
         * Initialize
         *
         * View constructor
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {

            this.base_model = Data.Models.Subline;

            _.bindAll(this, 'show_errors');

            this.model = new this.base_model({ line: opts.line });

            this.model.bind('error', this.show_errors);

        },

        /**
         * Serialize
         *
         * Package the view's data for rendering
         *
         * @return object
         */
        serialize: function () {
            var data = {};
            return data;
        }

    });

    Sublines.Views.Row = Utils.Views.Base.extend({

        tagName: 'tr',

        /**
         * Template
         *
         * relative path to template
         *
         * @var string
         */
        template: 'line/row',

        events: {
            'click .delete': 'delete_subline'
        },

        delete_subline: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm("Are you sure you want to delete this line?")) {
                this.model.destroy();
            }
        },

        /**
         * Initialize
         *
         * constructor
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {
            _.bindAll(this, 'delete_subline');
            this.line = opts.line;
            this.model = opts.model;
        },

        /**
         * Serialize
         *
         * package the data for rendering
         *
         * @return object
         */
        serialize: function () {
            var data = this.model.toJSON();

            data.parent_number = this.line.get('line_number');
            data.number = data.line_number.toString();
            data.subtotal = Utils.Str.price(data.subtotal);

            return data;
        }

    });

    /**
     * List
     *
     * represents a collection of sublines
     */
    Sublines.Views.List = Utils.Views.List.extend({

        /**
         * Template
         *
         * relative path to template
         *
         * @var string
         */
        template: 'line/subline',

        events: {
            // inherited
            'click tbody tr': 'select',
            // new
            'click .new': 'new_subline'
        },

        /**
         * New Subline
         *
         * flow for creating a new subline
         *
         * @param  event     e
         * @return undefined
         */
        new_subline: function (e) {

            var that = this,
                modal,
                close_modal;

            e.preventDefault();
            e.stopPropagation();

            modal = this.view('.tmp', new Utils.Views.Modal({
                title: 'New Subline',
                action: 'Save',
                content: Sublines.Views.Form,
                content_options: {
                    line: that.line
                }
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

                console.log('confirming');

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
         * constructor
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {
            this.collection = opts.collection;
            this.line = opts.line;
        },

        /**
         * Render
         *
         * builds the view for display
         *
         * @param  function layout
         * @return object
         */
        render: function (layout) {
            var that = this,
                view = layout(this);

            this.collection.each(function (subline) {
                view.insert("tbody.sublines", new Sublines.Views.Row({
                    model: subline,
                    line: that.line,
                    budget: that.budget
                }));
            });

            return view.render();
        }

    });

    return Sublines;

});