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

        // validation errors
        errors: undefined,

        // validation rules
        rules: {
            'title': 'required',
            'roll': 'required',
            'starts': ['required', 'date'],
            'ends': ['required', 'date']
        },

        // validations
        validations: {
            'date': {
                exp: /^[0-3]?\d-[01]?\d-\d{4}$/,
                msg: ':key is not a valid date (dd-mm-yyyy).'
            },
            'email': {
                exp: /^[\w]+@[\w]+\.[\w]{3}$/,
                msg: ':key is not a valid email.'
            },
            'required': {
                exp: /[^\s]+/,
                msg: ':key is required.'
            },
            'url': {
                exp: /^([\w]{2,4}):\/\/([\w]+.[\w]+)(\/[\w]*)*(\?([\w]+=[\w]*)*)?$/,
                msg: ':key is not a url.'
            }
        },

        // validate model
        validate: function (attrs) {

            // variables
            var that = this,
                errors = [];

            // validate all attibutes and get errors
            errors = _.reduce(attrs, function (errors, val, key) {
                
                // test given key with given value
                var res = that.test(key, val);

                // if there's an error, store it 
                if (res) {
                    errors.push({ 
                        key: key,
                        error: res
                    });
                }
                return errors;
            }, []);

            // set the model errors
            this.errors = errors;

            // if there are errors return them
            return (errors.length > 0) ? errors : undefined;
        },

        // tests a key:value pair
        test: function (key, val) {

            // variable
            var that = this,
                rules,
                test_rule,
                error;

            // test a rule
            test_rule = function (rule) {
                var v = that.validations[rule];

                if (!v) {

                    // if the rule is undefined throw an exception
                    throw 'Validation rule "' + rule + '" is not defined.';

                } else if (!v.exp.test(val)) {

                    // format and return the error
                    return that.format_message(v.msg, key);

                }
            };

            // get the rules specified for this key
            rules = this.rules[key];

            if (typeof rules === 'string') {

                // if theres only one rule just execute it
                error = test_rule(rules);

                // if theres an error wrap it in an array
                if (error) {
                    error = [error];
                }

            } else if (rules instanceof Array) {

                // get array of errors
                error = _.reduce(rules, function (memo, rule) {
                    var error = test_rule(rule);
                    if (error) {
                        memo.push(error);
                    }
                    return memo;
                }, []);

                // if its empty return undefined
                if (error.length === 0) {
                    error = undefined;
                }

            }

            return error;

        },

        // format an error message
        format_message: function (msg, key) {

            // uppercase the key
            var field = key[0].toUpperCase() + key.slice(1);

            // format and return the message
            return msg.replace(':key', field);

        },

        // model url
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

        // sections
        sections: [ 'budget', 'description', 'attachments', 'notes', 'audit' ],

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