define([
    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",
    "modules/budget/details",
    "modules/budget/attachments",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone, Utils, Details, Attachments) {

    "use strict";

    // Shorthand the app
    var app = cc.app,
        Budget = cc.module(); // Create a new module

    /**
     * Model
     *    The Budget Model
     */
    Budget.Model = Utils.Models.Validated.extend({

        // set the id to a mongo style _id
        idAttribute: '_id',

        // validation rules
        rules: {
            'title': 'required',
            'description': 'required',
            'rolls': 'required',
            'starts': ['required', 'date'],
            'ends': ['required', 'date']
        },

        // initialize the model
        initialize: function () {

            var that = this;

            this.bind('change:starts', function (model, value, opts) {
                that.parse_date('starts');
            });

            this.bind('change:ends', function (model, value, opts) {
                that.parse_date('ends');
            });

        },

        // parses date from 
        parse_date: function (key) {
            var value = this.get(key),
                s,
                date,
                parsed;

            if (typeof value === 'string') {
                s = value.split('-');
                // note to self... months are 0 -> 11 :(
                date = new Date(s[0], parseInt(s[1]) - 1, s[2]);
                parsed = {};
                parsed[key] = date.getTime();
                this.set(parsed, {silent: true});
            }
            
        },

        // model url
        url: function () {
            var id = this.get('_id');
            return '/budgets/' + ((id) ? id : 'create');
        }

    });

    /**
     * Budget Form
     */
    Budget.Views.Form = Backbone.LayoutManager.View.extend({

        // form template
        template: 'budgets/form',

        // initialize form
        initialize: function () {

            _.bindAll(this, 'show_errors');

            this.model = new Budget.Model();

            this.model.bind('error', this.show_errors);

        },

        // form is valid?
        isValid: function () {
            var has_errors;

            this.model.set(this.extract());

            has_errors = this.model.has_errors();

            return !has_errors;
        },

        // show errors
        show_errors: function () {

            var that = this;

            that.clear_errors();

            _.each(this.model.errors, function (error) {
                var field = $('.' + error.key, that.$el);
                field.addClass('error');
            });

        },

        // clear field errors
        clear_errors: function () {
            $('.error', this.$el).removeClass('error');
        },

        // extract form data
        extract: function () {
            var fields,
                data,
                model;

            fields = $('.field', this.$el);
            data = {};

            _.each(fields, function (field) {
                var field = $(field);
                data[field.data('attr')] = field.val();
            });

            return data;

        },

        save: function () {
            return (this.isValid()) ? this.model.save() : false;
        }

    });

    /**
     * Nav
     *    Pill style navigation for switching tabs
     */
    Budget.Views.Nav = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budget/nav',

        // initialize
        initialize: function (opts) {
            // set the sections and current section
            this.section = opts.section || 'budget';
            this.sections = this.parse_sections(opts.sections);
        },

        // serialize for rendering
        serialize: function () {
            var data = {};

            data.section = this.section;
            data.sections = this.sections;

            return data;
        },

        /* Helper functions */
        parse_sections: function (sections) {
            var res = [];

            _.each(sections, function (sec) {
                res.push({
                    name: sec,
                    proper: sec.charAt(0).toUpperCase() + sec.slice(1)
                });
            });

            return res;
        }

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
    Budget.Views.Details = Details.Views.Index;

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
                        budget_id: that.model.get('_id'),
                        budget: that.model
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

        // sections
        sections: [ 'budget', 'details', 'attachments', 'notes', 'audit' ],

        // initialize
        initialize: function (opts) {

            var that = this,
                tab = opts.tab || 'budget',
                section = $(tab),
                view = opts.tab.charAt(0).toUpperCase() + opts.tab.slice(1);

            // set the current section
            this.section = tab;

            // set our nested views
            this.views = {};
            this.views['.nav'] = new Budget.Views.Nav({
                section: that.section,
                sections: that.sections
            });
            this.views['.section.' + tab] = new Budget.Views[view]({
                budget_id: that.model.get('_id')
            });

        },

        // serialize for rendering
        serialize: function () {
            var that = this,
                data = this.model.toJSON();

            // serialize the sections and current sections
            data.section = this.section;
            data.sections = this.sections;

            return data;
        },

    });

    /**
     * Handlebars Helper
     */

    // helper for determining if a section is active
    Handlebars.registerHelper('active', function (section, active) {
        var res = '';

        if (section === active) {
            res = 'active';
        }

        return res;
    });

    // Required, return the module for AMD compliance
    return Budget;

});