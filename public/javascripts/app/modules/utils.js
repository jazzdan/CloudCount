define([
    "namespace",

    // Libs
    "use!backbone",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone) {

    "use strict";

    var app = cc.app,

        /**
         * Utils
         *
         * Module for useful things: Str, Form, Modal, etc.
         */
        Utils = cc.module();

    /**
     * Models
     *
     * Reusable models abstractions
     */
    Utils.Models = {};

    /**
     * Validated Model
     *
     * models with easy to define validation
     */
    Utils.Models.Validated = Backbone.Model.extend({

        /**
         * Errors
         *
         * Any errors from the last validation
         *
         * @var object|undefined
         */
        errors: undefined,

        /**
         * Has Errors?
         *
         * Returns true if model has more than 0 errors
         *
         * @return bool
         */
        has_errors: function () {
            return this.errors.length > 0;
        },

        /**
         * Rules
         *
         * Validation rules for the model
         *
         * @var object
         */
        rules: {},

        /**
         * Validations
         *
         * Avaliable validation rules
         *
         * @var object
         */
        validations: {
            'date': {
                // validates yyyy-mm-dd || a large int
                exp: /^([0-3]?\d)-[01]?\d-\d{4}$|^(\-?\d{8,})$/,
                msg: ':key is not a valid date (dd-mm-yyyy).'
            },
            'email': {
                exp: /^[\w]+@[\w]+\.[\w]{3}$/,
                msg: ':key is not a valid email.'
            },
            'required': {
                exp: /[\w]+/,
                msg: ':key is required.'
            },
            'url': {
                exp: /^([\w]{2,4}):\/\/([\w]+\.[\w]+)(\/[\w]*)*(\?([\w]+=[\w]*)*)?$/,
                msg: ':key is not a url.'
            }
        },

        /**
         * Validate
         *
         * Validates attributes based on rules hash
         *
         * @param  object          attrs
         * @return array|undefined
         */
        validate: function (attrs) {

            var that = this,
                errors = [];

            errors = _.reduce(attrs, function (errors, val, key) {

                var res = that.test(key, val);

                if (res) {
                    errors.push({
                        key: key,
                        value: val,
                        errors: res
                    });
                }
                return errors;
            }, []);

            this.errors = errors;

            return (errors.length > 0) ? errors : undefined;
        },

        /**
         * Test
         *
         * Tests a key, value validation pair
         *
         * @param  string          key
         * @param  string          val
         * @return array|undefined
         */
        test: function (key, val) {

            var that = this,
                rules,
                test_rule,
                error;

            /**
             * Test Rule
             *
             * Runs validation test
             *
             * @param  string           rule
             * @return string|undefined
             */
            test_rule = function (rule) {
                var v = that.validations[rule];

                if (!v) {
                    throw 'Validation rule "' + rule + '" is not defined.';
                } else if (!v.exp.test(val)) {
                    return that.format_message(v.msg, key);
                }
            };

            rules = this.rules[key];

            if (typeof rules === 'string') {

                error = test_rule(rules);

                if (error) {
                    error = [error];
                }

            } else if (rules instanceof Array) {

                error = _.reduce(rules, function (memo, rule) {
                    var error = test_rule(rule);
                    if (error) {
                        memo.push(error);
                    }
                    return memo;
                }, []);

                if (error.length === 0) {
                    error = undefined;
                }

            }

            return error;

        },

        /**
         * Format Message
         *
         * Formats the error message
         *
         * @param  string msg
         * @param  string key
         * @return string
         */
        format_message: function (msg, key) {
            var field = Utils.Str.upper(key);

            // format and return the message
            return msg.replace(':key', field);

        }

    });

    /**
     * Form
     *
     * Reusable form class
     */
    Utils.Views.Form = Backbone.LayoutManager.View.extend({

        /**
         * Initialize
         *
         * @return undefined
         */
        initialize: function () {

            _.bindAll(this, 'show_errors');

            this.model = new this.base_model();

            this.model.bind('error', this.show_errors);

        },

        /**
         * Hydrate
         *
         * Fills the form fields based on the model
         *
         * @return undefined
         */
        hydrate: function () {
            var that = this,
                fields = $('.field', this.$el);

            _.each(fields, function (field) {
                var $field = $(field),
                    key = $field.data('attr'),
                    value;

                if (key === 'starts' || key === 'ends') {
                    value = Utils.Date.for_humans(that.model.get(key));
                } else {
                    value = that.model.get(key);
                }

                $field.val(value);
            });
        },

        /**
         * Is Valid?
         *
         * Validates the form
         *
         * @return bool
         */
        isValid: function () {
            var has_errors;

            this.model.set(this.extract());

            has_errors = this.model.has_errors();

            return !has_errors;
        },

        /**
         * Show Errors
         *
         * Displays errors in the form
         *
         * @return undefined
         */
        show_errors: function () {

            var that = this;

            that.clear_errors();

            _.each(this.model.errors, function (error) {
                var field = $('.' + error.key, that.$el);
                field.addClass('error');
            });

        },

        /**
         * Clear Errors
         *
         * Clears errors class from all form elements
         *
         * @return undefined
         */
        clear_errors: function () {
            $('.error', this.$el).removeClass('error');
        },

        /**
         * Extract
         *
         * Pulls user input out of the form
         *
         * @return array
         */
        extract: function () {
            var fields,
                data,
                model;

            fields = $('.field', this.$el);
            data = {};

            _.each(fields, function (field) {
                var $field = $(field);
                data[$field.data('attr')] = $field.val();
            });

            return data;

        },

        /**
         * Save
         *
         * Saves the model if all data validates
         *
         * @return bool
         */
        save: function () {
            console.log(this.model);
            return (this.isValid()) ? this.model.save() : false;
        }

    });

    /**
     * List View
     *
     * List with selectable rows
     */
    Utils.Views.List = Backbone.LayoutManager.View.extend({

        /**
         * Events
         *
         * View events hash
         *
         * @var object
         */
        events: {
            'click tbody tr': 'select'
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

            if (el.hasClass('selected')) {
                el.removeClass('selected');
            } else {
                $('.selected', this.$el).removeClass('selected');
                el.addClass('selected');
            }
        }

    });

    /**
     * Refresh Bar
     *
     * View for the refresh bar
     */
    Utils.Views.RefreshBar = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * path to the view template
         *
         * @var string
         */
        template: "utils/controlbar-refresh",

        /**
         * Tag Name
         *
         * tag that should wrap the view
         *
         * @var string
         */
        tagName: "div"

    });

    /**
     * Budget Bar
     *
     * View for the budget control bar
     */
    Utils.Views.BudgetBar = Utils.Views.RefreshBar.extend({

        /**
         * Tag Name
         *
         * tag that should wrap the view
         *
         * @var string
         */
        template: "utils/controlbar-budget"

    });

    /**
     * Modal
     *
     * Reusable modal dialog wrapper
     */
    Utils.Views.Modal = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * path to the view template
         *
         * @var string
         */
        template: 'utils/modal',

        /**
         * Events
         *
         * View events hash
         *
         * @var object
         */
        events: {
            'click [data-action]': 'action'
        },

        /**
         * Action
         *
         * Fires modal control actions
         *
         * @param  event e
         * @return undefined
         */
        action: function (e) {

            e.preventDefault();
            e.stopPropagation();

            var action = $(e.target).data('action');

            this.trigger(action);

        },

        /**
         * Render
         *
         * Renders the modal and then its content
         *
         * @param  function manage
         * @return object
         */
        render: function (manage) {

            var view = manage(this),
                content_options = this.options.content_options || {};

            content_options.modal = this;
            this.content = new this.options.content(content_options);
            view.insert(".modal-body", this.content);

            return view.render();

        },

        /**
         * Show
         *
         * Show something
         *
         * @param  string type
         * @return undefined
         */
        show: function (type) {
            $('#' + type).show();
        },

        /**
         * Hide
         *
         * Hide something
         *
         * @param  string type
         * @return undefined
         */
        hide: function (type) {
            $('#' + type).hide();
        },

        /**
         * Serialize
         *
         * Serializes the model for rendering and the like
         *
         * @return object
         */
        serialize: function () {
            var that = this;

            return {
                title: that.options.title || 'Modal',
                action: that.options.action || 'Ok',
                close: that.options.close || 'Close'
            };
        }

    });

    /**
     * Str
     *
     * A collection of helpful string funcitons
     */
    Utils.Str = {

        /**
         * Title
         *
         * Uppercase the first letter of each word
         *
         * @param  string str
         * @return string
         */
        title: function (str) {
            return str;
        },

        /**
         * Upper
         *
         * Uppercase the first letter of a string
         *
         * @param  string str
         * @return string
         */
        upper: function (str) {
            return str[0].toUpperCase() + str.slice(1);
        },

        /**
         * Price
         *
         * Format a price
         *
         * @param  int    num
         * @return string
         */
        price: function (num) {
            return num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

    };

    /**
     * Date
     *
     * A collection of helpful date funcitons
     */
    Utils.Date = {

        /**
         * Formats
         *
         * A collection of functions for formatting dates
         *
         * @var object
         */
        formats: {

            full: function (date) {
                return date.toLocaleDateString() + ' -- ' + date.toLocaleTimeString();
            },

            dmy: function (date) {
                return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
            }
        },

        /**
         * For Humans
         *
         * Format a timestamp in human readable form
         *
         * @param  int    timestamp
         * @return string
         */
        for_humans: function (timestamp, format) {
            var date = new Date(timestamp);
            return this.formats[format || 'dmy'](date);
        }

    };

    // return the module for AMD compliance
    return Utils;

});