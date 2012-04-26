define([
    "namespace",

    // Libs
    "use!backbone",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone) {

    "use strict";

        // Shorthand the app
    var app = cc.app,
        // Create a new module
        Utils = cc.module();

    Utils.Models = {};

    /**
     * Validated Model
     *      models with easy to define validation
     */
    Utils.Models.Validated = Backbone.Model.extend({

        // validation errors
        errors: undefined,

        // model has errors?
        has_errors: function () {
            return this.errors.length > 0;
        },

        // validation rules
        rules: {},

        // validations
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
                exp: /[^\s]+/,
                msg: ':key is required.'
            },
            'url': {
                exp: /^([\w]{2,4}):\/\/([\w]+\.[\w]+)(\/[\w]*)*(\?([\w]+=[\w]*)*)?$/,
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
                        value: val,
                        errors: res
                    });
                }
                return errors;
            }, []);

            // set the model errors
            this.errors = errors;

            console.log('errors:');
            console.log(errors);

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

        }

    });

    /**
     * Budget Form
     */
    Utils.Views.Form = Backbone.LayoutManager.View.extend({

        // initialize form
        initialize: function () {

            _.bindAll(this, 'show_errors');

            this.model = new this.base_model();

            this.model.bind('error', this.show_errors);

        },

        hydrate: function () {
            var that = this,
                fields = $('.field', this.$el);

            _.each(fields, function (field) {
                var $field = $(field),
                    key = $field.data('attr'),
                    value;

                if (key === 'starts' || key === 'ends') {
                    value = (function () {
                        var date = new Date(that.model.get(key));
                        return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
                    }());
                } else {
                    value = that.model.get(key);
                }

                $field.val(value);
            });
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
                var $field = $(field);
                data[$field.data('attr')] = $field.val();
            });

            return data;

        },

        save: function () {
            return (this.isValid()) ? this.model.save() : false;
        }

    });

    /**
     * List View
     *      has selectable rows
     */
    Utils.Views.List = Backbone.LayoutManager.View.extend({

        // events hash
        events: {
            'click tbody tr': 'select'
        },

        // select event
        select: function (e) {
            // find the row from the event target
            var el = $(e.target).closest('tr');

            // if its already selected, unselect it
            if (el.hasClass('selected')) {
                el.removeClass('selected');
            } else { // otherwise, clear any selections and select it
                $('.selected', this.$el).removeClass('selected');
                el.addClass('selected');
            }
        }

    });

    /**
     * Refresh Control Bar
     */
    Utils.Views.RefreshBar = Backbone.LayoutManager.View.extend({

        // view template
        template: "utils/controlbar-refresh",

        // wrapper tag
        tagName: "div"

    });

    /**
     * Budget Control Bar
     */
    Utils.Views.BudgetBar = Utils.Views.RefreshBar.extend({

        // view template
        template: "utils/controlbar-budget"

    });

    /**
     * Modal Dialog
     */
    Utils.Views.Modal = Backbone.LayoutManager.View.extend({

        // view template
        template: 'utils/modal',

        // view events
        events: {
            'click [data-action]': 'action'
        },

        // button actions
        action: function (e) {

            // halt the event
            e.preventDefault();
            e.stopPropagation();

            // get the action
            var action = $(e.target).data('action');

            // fire an action event
            this.trigger(action);

        },

        // render the modal
        render: function (manage) {

            var view = manage(this);

            // insert the content into the modal
            this.content = new this.options.content({ parent: this });
            view.insert(".modal-body", this.content);

            // render the modal
            return view.render();

        },

        show: function (type) {
            $('#' + type).show();
        },

        hide: function (type) {
            $('#' + type).hide();
        },

        // serialize function
        serialize: function () {

            // this/that
            var that = this;

            // return serialized object
            return {
                title: that.options.title || 'Modal',
                action: that.options.action || 'Ok',
                close: that.options.close || 'Close'
            };
        }

    });

    // Required, return the module for AMD compliance
    return Utils;

});