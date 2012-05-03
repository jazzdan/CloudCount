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
     * Details
     *
     * Budget details
     */
    Budget.Views.Details = Utils.Views.Base.extend({

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
    Budget.Views.Index = Utils.Views.Base.extend({

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