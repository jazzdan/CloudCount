define([
    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone, Utils) {

    "use strict";

    // Shorthand the app
    var app = cc.app,
        Budget = cc.module(); // Create a new module

    /**
     * Details
     */
    Budget.Views.Details = Backbone.LayoutManager.View.extend({

        template: 'budget/budget/details',

        serialize: function () {
            var data = app.current_budget.toJSON(),
                starts = new Date(data.starts),
                ends = new Date(data.ends);

            // prettify dates
            data.starts = starts.getDate() + '-' + (starts.getMonth() + 1) + '-' + starts.getFullYear();
            data.ends = ends.getDate() + '-' + (ends.getMonth() + 1) + '-' + ends.getFullYear();

            return data;
        }

    });

    /**
     * Lines
     */
    Budget.Views.Lines = Backbone.LayoutManager.View.extend({

        template: 'budget/budget/lines',

        initialize: function (opts) {
            this.title = opts.title;
        },

        serialize: function () {
            var data = {};
            data.title = this.title;
            return data;
        }

    });

    /**
     * Index
     */
    Budget.Views.Index = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budget/budget/index',

        views: {
            '#details': new Budget.Views.Details(),
            '#income': new Budget.Views.Lines({ title: 'income' }),
            '#expenses': new Budget.Views.Lines({ title: 'expenses' })
        },

        events: {
            'click .seesaw': 'seesaw'
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