define([

    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",
    "modules/dashboard/line",

    // Plugins
    "use!layoutmanager"

], function (cc, Backbone, Utils, Line) {

    "use strict";

    var app = cc.app,
        Budget = cc.module();

    /**
     * Line
     *
     * Line model. Attached to app
     */
    app.models.Line = Utils.Models.Validated.extend({

        /**
         * Id Attribute
         *
         * Set a mongo-style _id
         *
         * @var string
         */
        idAttribute: '_id',

        /**
         * Rules
         *
         * Model validation rules
         *
         * @var object
         */
        rules: {
            'type': 'required',
            'line_number': 'required',
            'name': 'required',
            'subtotal': 'required'
        },

        /**
         * Initialize
         *
         * Setup a new model
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {
            var that = this;
            this.budget = app.current_budget;
            this.budget_id = this.budget.get('_id');
        },

        /**
         * Budget Total
         *
         * returns the budgeted amount for the line
         *
         * @return number
         */
        budget_total: function () {
            return parseFloat(this.get('subtotal'));
        },

        /**
         * Actual
         *
         * returns actual spending to date based on sublines
         *
         * @return number
         */
        actual: function () {
            return 0;
        },

        /**
         * URL
         *
         * The model's url
         *
         * @return string
         */
        url: function () {
            var id = this.get('_id');
            return '/budgets/' + this.budget_id + '/lines/' + (id || 'create');
        }

    });

    /**
     * Lines
     *
     * Lines collection
     */
    app.collections.Lines = Backbone.Collection.extend({

        /**
         * Model
         *
         * Defines the model this collection contains
         *
         * @var Model
         */
        model: app.models.Line,

        /**
         * Comparator
         *
         * Defines the ordering of this collection
         *
         * @param  Model  line
         * @return number
         */
        comparator: function (line) {
            return line.get("line_number");
        },

        /**
         * Initialize
         *
         * Setup the collection
         *
         * @param  array     models
         * @param  object    opts
         * @return undefined
         */
        initialize: function (models, opts) {
            this.type = opts.type;
            this.budget = opts.budget;
            this.budget_id = opts.budget.get('_id');
            this.bind('all', function (name) {
                console.log('lines collection fired "' + name + '"');
            });
        },

        /**
         * Status
         *
         * returns "bad" if total is < actual, else returns "good"
         *
         * @return string
         */
        status: function () {
            var status = this.actual() < this.budget_total();
            return status ? 'good' : 'bad';
        },

        /**
         * Budget
         *
         * Get the total of all lines in the collection
         *
         * @return number
         */
        budget_total: function () {
            return this.reduce(function (total, line) {
                return parseFloat(line.get('subtotal')) + total;
            }, 0);
        },

        /**
         * Actual
         *
         * Get the total of actuals in the collection
         *
         * @return number
         */
        actual: function () {
            return 0;
        },

        /**
         * URL
         *
         * The collection's associated URL
         *
         * @return string
         */
        url: function () {
            var type = this.type || '';
            return '/budgets/' + this.budget_id + '/lines/' + type;
        }

    });

    /**
     * Details
     *
     * Budget details
     */
    Budget.Views.Details = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * Relative path to the view's template
         *
         * @var string
         */
        template: 'dashboard/budget/details',

        /**
         * Initialize
         *
         * setup the view
         *
         * @param  object opts
         * @return undefined
         */
        initialize: function (opts) {
            var that = this;

            this.budget = opts.budget;
        },

        /**
         * Serialize
         *
         * Package data for rendering
         *
         * @return object
         */
        serialize: function () {
            var that = this,
                data = app.current_budget.toJSON();

            data.starts = Utils.Date.for_humans(data.starts);
            data.ends = Utils.Date.for_humans(data.ends);

            data.budget = Utils.Str.price(this.budget.budget_total());
            data.actual = Utils.Str.price(this.budget.actual());
            data.excess = {
                amount: Utils.Str.price(that.budget.excess()),
                status: that.budget.status()
            };

            return data;
        }

    });

    /**
     * Lines
     *
     * List of lines
     */
    Budget.Views.Lines = Line.Views.List;

    /**
     * Index
     *
     * Main budget view
     */
    Budget.Views.Index = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * Relative path to the view's template
         *
         * @var string
         */
        template: 'dashboard/budget/index',

        /**
         * Views
         *
         * defines nested views
         *
         * @var object
         */
        views: {},

        /**
         * Events
         *
         * defines listeners and actions
         *
         * @var object
         */
        events: {
            'click .seesaw': 'seesaw'
        },

        /**
         * Seesaw
         *
         * handler for switching between incomes/expenses
         *
         * @return undefined
         */
        seesaw: function (e) {
            var target = $(e.target),
                container = target.closest('.seesaw');

            if (!container.hasClass('up')) {
                $('.up', this.$el).removeClass('up').removeClass('span8').addClass('span4');
                container.removeClass('span4').addClass('up').addClass('span8');
            }
        },

        /**
         * Initialize
         *
         * Setup the view
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {
            var that = this;

            this.budget = opts.budget;
            this.budget_id = opts.budget_id;

            this.views['#details'] = new Budget.Views.Details({
                budget: that.budget
            });

            this.views['#income'] = new Budget.Views.Lines({
                title: 'incomes',
                collection: that.budget.incomes
            });

            this.views['#expenses'] = new Budget.Views.Lines({
                title: 'expenses',
                collection: that.budget.expenses
            });
        }

    });


    // return the module for AMD compliance
    return Budget;

});