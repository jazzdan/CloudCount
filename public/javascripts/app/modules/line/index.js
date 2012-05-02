define([
    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",
    "modules/line/sublines",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone, Utils, Sublines) {

    "use strict";

    var app = cc.app,
        Line = cc.module(); // Create a new module

    /**
     * Index
     *
     * shell view for budget dashboard
     */
    Line.Views.Index = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to template
         *
         * @var string
         */
        template: 'line/index',

        /**
         * Events
         *
         * defines event listeners and handlers
         *
         * @var object
         */
        events: {},

        /**
         * Views
         *
         * defines event listeners and handlers
         *
         * @var object
         */
        views: {},

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

            this.model = opts.model;

            console.log(Sublines);

            this.model.bind('change', function () {
                that.render();
            });

            this.update_transactions();

        },

        /**
         * Update Transactions
         *
         * asychronously fetches transactions and refreshes the view
         *
         * @return undefined
         */
        update_transactions: function () {
            var that = this;
            that.model.sublines.fetch({
                success: function () {
                    that.setViews({
                        '.sublines': new Sublines.Views.List({
                            collection: that.model.sublines
                        })
                    });
                    console.log(that.model);
                    that.render();
                }
            });
        },

        /**
         * Next
         *
         * returns the next line in the parent collection
         *
         * @return Line
         */
        next: function () {
            var index = this.model.collection.indexOf(this.model) + 1;
            if (this.model.collection.length <= index) {
                index = 0;
            }
            return this.model.collection.at(index);
        },

        /**
         * Previous
         *
         * returns the previous line in the parent collection
         *
         * @return Line
         */
        previous: function () {
            var index = this.model.collection.indexOf(this.model) - 1;
            if (index < 0) {
                index = this.model.collection.length - 1;
            }
            return this.model.collection.at(index);
        },

        /**
         * Serialize
         *
         * package data for rendering
         *
         * @return object
         */
        serialize: function () {
            var that = this,
                data = this.model.toJSON();

            data.proper_type = Utils.Str.upper(data.type);
            data.next_id = this.next().get('_id');
            data.previous_id = this.previous().get('_id');
            data.budget_id = this.model.budget_id;
            data.budget_name = this.model.budget.get('title');

            data.budget_total = Utils.Str.price(this.model.budget_total());
            data.actual = Utils.Str.price(this.model.actual());

            return data;
        }

    });

    // return the module for AMD compliance
    return Line;

});