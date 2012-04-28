define([
    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",
    "modules/budget/budget",
    "modules/budget/details",
    "modules/budget/attachments",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone, Utils, BudgetSubmodule, Details, Attachments) {

    "use strict";

    var app = cc.app,
        Budget = cc.module(); // Create a new module

    /**
     * Model
     *
     * Budget model
     */
    Budget.Model = Utils.Models.Validated.extend({

        /**
         * Id Attribute
         *
         * use mongo-style _id
         *
         * @var string
         */
        idAttribute: '_id',

        /**
         * Rules
         *
         * model validation rules
         *
         * @var object
         */
        rules: {
            'title': 'required',
            'description': 'required',
            'rolls': 'required',
            'starts': ['required', 'date'],
            'ends': ['required', 'date']
        },

        /**
         * Initialize
         *
         * setup the model
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {

            var that = this;

            this.income = new app.collections.Lines([], {
                type: 'incomes',
                budget: that
            });
            this.expenses = new app.collections.Lines([], {
                type: 'expenses',
                budget: that
            });

            this.bind('change:starts', function (model, value, opts) {
                that.parse_date('starts');
            });

            this.bind('change:ends', function (model, value, opts) {
                that.parse_date('ends');
            });

        },

        /**
         * Parse Date
         *
         * handles date conversions
         *
         * @return undefined
         */
        parse_date: function (key) {
            var value = this.get(key),
                s,
                date,
                parsed;

            if (typeof value === 'string') {
                s = value.split('-');
                // note to self... months are 0 -> 11 :(
                date = new Date(s[2], parseInt(s[1], 10) - 1, s[0]);
                parsed = {};
                parsed[key] = date.getTime();
                this.set(parsed, {silent: true});
            }
        },

        /**
         * URL
         *
         * model's associated URL
         *
         * @return string
         */
        url: function () {
            var id = this.get('_id');
            return '/budgets/' + (id || 'create');
        }

    });

    /**
     * Form
     *
     * form for creating new budgets
     */
    Budget.Views.Form = Utils.Views.Form.extend({

        /**
         * Template
         *
         * relative path to the view template
         *
         * @var string
         */
        template: 'budgets/form',

        /**
         * Base Model
         *
         * the model-type the form creates
         *
         * @var Model
         */
        base_model: Budget.Model

    });

    /**
     * Nav
     *
     * Navigation within budget sections
     */
    Budget.Views.Nav = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to view template
         *
         * @var string
         */
        template: 'budget/nav',

        /**
         * Initialize
         *
         * setup the view
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {
            this.section = opts.section || 'budget';
            this.sections = this.parse_sections(opts.sections);
        },

        /**
         * Serialize
         *
         * package the data for rendering
         *
         * @return object
         */
        serialize: function () {
            var data = {};
            data.section = this.section;
            data.sections = this.sections;
            return data;
        },

        /**
         * Parse Sections
         *
         * formats section names
         *
         * @return undefined
         */
        parse_sections: function (sections) {
            return _.map(sections, function (section) {
                return {
                    name: section,
                    proper: Utils.Str.upper(section)
                };
            });
        }

    });

    /**
     * Budget
     *
     * Budget view
     */
    Budget.Views.Budget = BudgetSubmodule.Views.Index;

    /**
     * Details
     *
     * budget details
     */
    Budget.Views.Details = Details.Views.Index;

    /**
     * Attachments
     *
     * budget attachments
     */
    Budget.Views.Attachments = Attachments.Views.Index;

    /**
     * Notes
     *
     * budget notes
     */
    Budget.Views.Notes = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to view template
         *
         * @var string
         */
        template: 'budget/notes'

    });

    /**
     * Audits
     *
     * budget's audit trail
     */
    Budget.Views.Audit = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to view template
         *
         * @var string
         */
        template: 'budget/audit'

    });

    /**
     * Index
     *
     * shell view for budget dashboard
     */
    Budget.Views.Index = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to template
         *
         * @var string
         */
        template: 'budget/index',

        /**
         * Events
         *
         * defines event listeners and handlers
         *
         * @var object
         */
        events: {
            'click .section-nav': 'section_nav'
        },

        /**
         * Section Nav
         *
         * logix for section navigation
         *
         * @param  event     e
         * @return undefined
         */
        section_nav: function (e) {

            var view,
                that = this,
                tar = $(e.target),
                name = tar.data('section'),
                section_class = '.' + name,
                section = $(section_class),
                proper_name = Utils.Str.upper(name);

            e.preventDefault();
            e.stopPropagation();

            if (!section.hasClass('active')) {

                if (!this.views['.section.' + section_class]) {
                    view = this.view('.section.' + section_class, new Budget.Views[proper_name]({
                        budget_id: that.model.get('_id'),
                        budget: that.model
                    })).render();
                }

                $('.active').removeClass('active');

                section.addClass('active');

                $('.section-label').html(proper_name);
            }
        },

        /**
         * Sections
         *
         * list of sections
         *
         * @var array
         */
        sections: [ 'budget', 'details', 'attachments', 'notes', 'audit' ],

        /**
         * Initialize
         *
         * setup the view
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {

            var that = this,
                tab = opts.tab || 'budget',
                section = $(tab),
                view = Utils.Str.upper(opts.tab);

            this.section = tab;

            this.views = {};

            this.views['.nav'] = new Budget.Views.Nav({
                section: that.section,
                sections: that.sections
            });

            this.views['.section.' + tab] = new Budget.Views[view]({
                budget_id: that.model.get('_id'),
                budget: that.model
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
            var that = this,
                data = this.model.toJSON();

            // serialize the sections and current sections
            data.section = this.section;
            data.sections = this.sections;

            return data;
        }

    });

    /**
     * Active
     *
     * handlebars helper for rendering the active section
     *
     * @return string
     */
    Handlebars.registerHelper('active', function (section, active) {
        return (section === active) ? 'active' : '';
    });

    // return the module for AMD compliance
    return Budget;

});