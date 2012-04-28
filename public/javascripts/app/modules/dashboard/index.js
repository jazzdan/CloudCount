define([
    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",
    "modules/dashboard/budget",
    "modules/dashboard/details",
    "modules/dashboard/attachments",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone, Utils, Budget, Details, Attachments) {

    "use strict";

    var app = cc.app,
        Dashboard = cc.module(); // Create a new module

    /**
     * Model
     *
     * Dashboard model
     */
    Dashboard.Model = Utils.Models.Validated.extend({

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

            this.income.bind('reset', function () {
                console.log('budget caught income "reset"');
                that.trigger('change');
            });
            this.income.bind('remove', function () {
                that.trigger('change');
            });

            this.expenses.bind('reset', function () {
                console.log('budget caught expenses "reset"');
                that.trigger('change');
            });
            this.expenses.bind('remove', function () {
                that.trigger('change');
            });

            this.refresh();

        },

        refresh: function () {
            this.income.fetch();
            this.expenses.fetch();
        },

        /**
         * Budget
         *
         * calculates the budget from the budget's lines
         *
         * @return number
         */
        budget: function () {
            return this.income.total() + this.expenses.total();
        },

        /**
         * Actual
         *
         * calculates the actual value to date
         *
         * @return number
         */
        actual: function () {
            return 0;
        },

        /**
         * Excess
         *
         * calculates the budget's excess of income'
         *
         * @return number
         */
        excess: function () {
            return this.income.total() - this.expenses.total();
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
    Dashboard.Views.Form = Utils.Views.Form.extend({

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
        base_model: Dashboard.Model

    });

    /**
     * Nav
     *
     * Navigation within budget sections
     */
    Dashboard.Views.Nav = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to view template
         *
         * @var string
         */
        template: 'dashboard/nav',

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
            this.budget = opts.budget;
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
            data.budget_id = this.budget.get('_id');
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
     * Dashboard view
     */
    Dashboard.Views.Budget = Budget.Views.Index;

    /**
     * Details
     *
     * budget details
     */
    Dashboard.Views.Details = Details.Views.Index;

    /**
     * Attachments
     *
     * budget attachments
     */
    Dashboard.Views.Attachments = Attachments.Views.Index;

    /**
     * Notes
     *
     * budget notes
     */
    Dashboard.Views.Notes = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to view template
         *
         * @var string
         */
        template: 'dashboard/notes'

    });

    /**
     * Audits
     *
     * budget's audit trail
     */
    Dashboard.Views.Audit = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to view template
         *
         * @var string
         */
        template: 'dashboard/audit'

    });

    /**
     * Index
     *
     * shell view for budget dashboard
     */
    Dashboard.Views.Index = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to template
         *
         * @var string
         */
        template: 'dashboard/index',

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
                    view = this.view('.section.' + section_class, new Dashboard.Views[proper_name]({
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

            this.views['.nav'] = new Dashboard.Views.Nav({
                section: that.section,
                sections: that.sections,
                budget: that.model
            });

            this.views['.section.' + tab] = new Dashboard.Views[view]({
                budget_id: that.model.get('_id'),
                budget: that.model
            });

            this.model.bind('change', function () {
                that.render();
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
    return Dashboard;

});