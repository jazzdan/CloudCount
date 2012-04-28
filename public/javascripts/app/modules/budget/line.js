define([

    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",

    // uploader script
    "uploader"

], function (cc, Backbone, Utils) {

    "use strict";

    var app = cc.app,
        Line = cc.module();

    /**
     * Form
     *
     * Form modal for creating new lines
     */
    Line.Views.Form = Utils.Views.Form.extend({

        /**
         * Template
         *
         * Relative path to view template 
         *
         * @var string
         */
        template: 'budget/budget/line-form',

        /**
         * Initialize
         *
         * View constructor
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {

            this.base_model = app.models.Line;

            _.bindAll(this, 'show_errors');

            this.model = new this.base_model();

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
            data.type = this.options.type;
            return data;
        }

    });

    /**
     * Line
     *
     * Individual line
     */
    Line.Views.Line = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * Relative path to view template
         *
         * @var string
         */
        template: 'budget/budget/line',

        /**
         * Tag Name
         *
         * Override the default wrapper tag
         *
         * @var string
         */
        tagName: 'tr',

        /**
         * Events
         *
         * Defines event listeners & actions
         *
         * @var object
         */
        events: {
            'click .delete': 'delete_line'
        },

        /**
         * Delete Line
         *
         * Deletes the line from the DB & the View
         *
         * @return undefined
         */
        delete_line: function () {
            if (window.confirm("Are you sure you want to delete this line?")) {
                this.model.destroy();
            }
        },

        /**
         * Initialize
         *
         * Initializes the view
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {
            this.budget = opts.budget;
            this.budget_id = this.budget.get('_id');
        },

        /**
         * Serialize
         *
         * Packages data for rendering
         *
         * @return object
         */
        serialize: function () {
            var data = this.model.toJSON();
            data.subtotal = Utils.Str.price(data.subtotal);
            data.budget_id = this.budget_id;
            return data;
        }

    });

    /**
     * List
     *
     * List of Lines
     */
    Line.Views.List = Utils.Views.List.extend({

        /**
         * Template
         *
         * Relative path to the view template
         *
         * @var string
         */
        template: 'budget/budget/lines',

        /**
         * Events
         *
         * Defines events and handlers
         *
         * @return undefined
         */
        events: {
            // inherited events:
            'click tbody tr': 'select',
            // class events
            'click .new': 'new_line'
        },

        /**
         * New Line
         *
         * Flow for creating a new line
         *
         * @param  event     e
         * @return undefined
         */
        new_line: function (e) {

            // the ol' this-that
            var that = this,
                modal,
                close_modal;

            e.preventDefault();
            e.stopPropagation();

            // render the modal
            modal = this.view('.tmp', new Utils.Views.Modal({
                title: 'New Line',
                action: 'Save',
                content: Line.Views.Form,
                content_options: {
                    type: that.title
                }
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

        /**
         * Initialize
         *
         * Initialize the view
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {
            var that = this;

            this.title = opts.title;
            this.collection = opts.collection;

            this.collection.bind('reset', function () {
                that.render();
            });

            this.collection.bind('remove', function () {
                that.render();
            });

            this.collection.fetch();
        },

        /**
         * Render
         *
         * Constructs and displays the view
         *
         * @param  layoutManager layout
         * @return view
         */
        render: function (layout) {

            var that = this,
                view = layout(this);

            this.collection.each(function (line) {
                view.insert("tbody.lines", new Line.Views.Line({
                    model: line,
                    budget: that.collection.budget
                }));
            });

            // render the view
            return view.render();
        },

        /**
         * Calculate Budget
         *
         * Aggregates the subtotals of a lines
         *
         * @return number
         */
        calculate_budget: function () {
            return this.collection.reduce(function (total, line) {
                return total + parseInt(line.get('subtotal'), 10);
            }, 0);
        },

        /**
         * Serialize
         *
         * Packages data for rendering
         *
         * @return object
         */
        serialize: function () {
            var data = {};
            data.title = Utils.Str.upper(this.title);
            data.budget = Utils.Str.price(this.calculate_budget());
            return data;
        },

        /**
         * Delete View
         *
         * Delete a nested view
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
    return Line;

});