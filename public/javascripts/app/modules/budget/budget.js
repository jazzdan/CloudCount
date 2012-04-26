define([

    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",
    "modules/budget/line",

    // Plugins
    "use!layoutmanager"

], function (cc, Backbone, Utils, Line) {

    "use strict";

    // Shorthand the app
    var app = cc.app,
        Budget = cc.module(); // Create a new module

    app.models.Line = Utils.Models.Validated.extend({

        idAttribute: '_id',

        rules: {
            'type': 'required',
            'line_number': 'required',
            'name': 'required',
            'subtotal': 'required'
        },

        initialize: function (opts) {
            var that = this;
            this.budget = app.current_budget;
            this.budget_id = this.budget.get('_id');
        },

        url: function () {
            var id = this.get('_id');
            return '/budgets/' + this.budget_id + '/lines/' + (id || 'create');
        }

    });

    app.collections.Lines = Backbone.Collection.extend({

        model: app.models.Line,

        comparator: function (line) {
            return line.get("line_number");
        },

        initialize: function (models, opts) {
            this.type = opts.type;
            this.budget = opts.budget;
            this.budget_id = opts.budget.get('_id');
        },

        url: function () {
            var type = this.type || '';
            return '/budgets/' + this.budget_id + '/lines/' + type;
        }

    });

    /**
     * Details
     */
    Budget.Views.Details = Backbone.LayoutManager.View.extend({

        template: 'budget/budget/details',

        serialize: function () {
            var data = app.current_budget.toJSON();

            data.starts = Utils.Date.for_humans(data.starts);
            data.ends = Utils.Date.for_humans(data.ends);

            return data;
        }

    });

    /**
     * Lines
     */
    Budget.Views.Lines = Line.Views.List;

    /**
     * Index
     */
    Budget.Views.Index = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budget/budget/index',

        events: {
            'click .seesaw': 'seesaw'
        },

        views: {},

        initialize: function (opts) {
            var that = this;
            this.budget = opts.budget;
            this.budget_id = opts.budget_id;

            this.views['#details'] = new Budget.Views.Details();
            this.views['#income'] = new Budget.Views.Lines({
                title: 'incomes',
                collection: that.budget.income
            });
            this.views['#expenses'] = new Budget.Views.Lines({
                title: 'expenses',
                collection: that.budget.expenses
            });
        },

        seesaw: function (e) {
            var target = $(e.target),
                container = target.closest('.seesaw');

            if (!container.hasClass('up')) {
                $('.up', this.$el).removeClass('up').removeClass('span8').addClass('span4');
                container.removeClass('span4').addClass('up').addClass('span8');
            }
        }

    });


    // Required, return the module for AMD compliance
    return Budget;

});