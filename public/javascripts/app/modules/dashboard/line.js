define([

    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",
    "modules/data",

    // uploader script
    "uploader"

], function (cc, Backbone, Utils, Data) {

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
        template: 'dashboard/budget/line-form',

        /**
         * Initialize
         *
         * View constructor
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {

            this.base_model = Data.Models.Line;

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
    Line.Views.Line = Utils.Views.Base.extend({

        /**
         * Template
         *
         * Relative path to view template
         *
         * @var string
         */
        template: 'dashboard/budget/line',

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
            'click .delete': 'delete_line',
            'dblclick': 'view_line'
        },

        /**
         * Edit
         *
         * opens the edit budget view
         *
         * @return undefined
         */
        view_line: function () {
            $('.view_line', this.$el).click();
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
            data.budget = Utils.Str.price(data.subtotal);
            data.actual = Utils.Str.price(0);
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
        template: 'dashboard/budget/lines',

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
         * Select
         *
         * Selects a row if it isn't already, unselects it if it is
         *
         * @param  event     e
         * @return undefined
         */
        select: function (e) {
            var el = $(e.target).closest('tr');

            if (!this.$el.closest('.seesaw').hasClass('up')) {
                return;
            }

            if (el.hasClass('selected')) {
                el.removeClass('selected');
            } else {
                $('.selected', this.$el).removeClass('selected');
                el.addClass('selected');
            }
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

            if (!this.collection.locked) {
                this.collection.each(function (line) {
                    view.insert("tbody.lines", new Line.Views.Line({
                        model: line,
                        budget: that.collection.budget
                    }));
                });
            }

            return view.render();
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
            data.status = this.collection.status();
            data.title = Utils.Str.upper(this.title);
            data.budget = Utils.Str.price(this.collection.budget_total());
            data.actual = Utils.Str.price(this.collection.actual());
            return data;
        }

    });

    // return the module for AMD compliance
    return Line;

});