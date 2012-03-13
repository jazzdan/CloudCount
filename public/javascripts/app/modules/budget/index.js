define([
    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/budget/attachments",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone, Attachments) {

    "use strict";

    // Shorthand the app
    var app = cc.app,
        Budget = cc.module(); // Create a new module

    /**
     * Model
     *    The Budget Model
     */
    Budget.Model = Backbone.Model.extend({

        // set the id to a mongo style _id
        idAttribute: '_id',

        url: function () {
            return '/budgets/' + this.get('_id');
        }

    });

    /**
     * Nav
     *    Pill style navigation for switching tabs
     */
    Budget.Views.Nav = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budget/nav',

    });

    /**
     * Budget
     *    Budget View
     */
    Budget.Views.Budget = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budget/budget',

    });

    /**
     * Description
     *    List of recent changes to the budget
     */
    Budget.Views.Description = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budget/description',

    });

    /**
     * Attachments (alias)
     *    List of downloadable attachments
     */
    Budget.Views.Attachments = Attachments.Views.Index;

    /**
     * Notes
     *    List of user notes
     */
    Budget.Views.Notes = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budget/notes',

    });

    /**
     * Audits
     *    List of recent changes to the budget
     */
    Budget.Views.Audit = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budget/audit',

    });

    /**
     * Container
     *    encompasses Audits, Nots, Attachments, Description & Budget
     */
    Budget.Views.Index = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budget/index',

        // view events
        events: {
            'click .section-nav': 'section_nav'
        },

        // navigation event
        section_nav: function (e) {

            // STOP the event!
            e.preventDefault();
            e.stopPropagation();

            // some variables
            var view,
                that = this,
                tar = $(e.target),
                name = tar.data('section'),
                section_class = '.' + name,
                section = $(section_class),
                proper_name = name.charAt(0).toUpperCase() + name.slice(1);

            // target isnt already active, activate it
            if (!section.hasClass('active')) {

                // if the section view isnt already rendered, render it
                if (!this.views['.section.' + section_class]) {
                    view = this.view('.section.' + section_class, new Budget.Views[proper_name]({
                        budget_id: that.model.get('_id')
                    })).render();
                }

                // hide the old one
                $('.active').removeClass('active');

                //show the new one
                section.addClass('active');

                // update the label
                $('.section-label').html(proper_name);

            }

        },

        initialize: function (opts) {

            var tab = (opts.tab || 'budget'),
                section = $(tab),
                view = opts.tab.charAt(0).toUpperCase() + opts.tab.slice(1);

            // set our nested views
            this.views = {};
            this.views['.nav'] = new Budget.Views.Nav();
            this.views['.section.' + tab] = new Budget.Views[view]();

            this.section = tab;

        },

        // serialize for rendering
        serialize: function () {
            var that = this,
                data = this.model.toJSON();

            data['section'] = this.section;
            data['sections'] = [ 'budget', 'description', 'attachments', 'notes', 'audit' ];

            return data;
        },

    });

    /**
     * Handlebars Helper
     */
    Handlebars.registerHelper('active', function(section){
        var active = '';

        if (this === section) {
            active = 'active';
        }

        return active;
    });

    // Required, return the module for AMD compliance
    return Budget;

});