define([
    "namespace",

    // Libs
    "jquery",
    "use!underscore",
    "use!backbone",
    "keyboard",

    // Plugins
    "use!layoutmanager"
], function (cc, $, _, Backbone) {

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
                exp: /^(\d{4}-[01]?\d-[0-3]?\d)$|^(\-?\d{8,})$/,
                msg: ':key is not a valid date (yyyy-mm-dd).'
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
                        value: val,
                        errors: res
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

        }

    });

    /**
     * Keyboard Events
     *      implements keyboard events
     */
    Utils.Views.Keyboard = Backbone.LayoutManager.View.extend({

        // initialize view
        initialize: function () {

            _.bindAll(this, 'initialize_keyboard');

            // initialize keyboard events
            this.initialize_keyboard();

        },

        // keyboard event hash
        keyboard: {},

        // initlialize keyboard events
        initialize_keyboard: function () {

            var that = this;

            // initialize all keyboard events
            _.each(that.keyboard, function (callback, key) {

                var clean = Backbone.Keyboard.listen(key, that[callback]);

                that.keyboard_cleanups.push(clean);

            });

        },

        // array of keyboard event clear functions
        keyboard_cleanups: [],

        // clear all object key events
        cleanup_keyboard: function () {
            _.each(this.keyboard_cleanups, function (val) {
                val.clear();
            });
        },

        // cleanup function
        cleanup: function () {
            // always execute onCleanup
            this.onCleanup();
            this.cleanup_keyboard();
        }

    });

    /**
     * List View
     *      has selectable rows
     */
    Utils.Views.List = Utils.Views.Keyboard.extend({

        // events hash
        events: {
            'click tbody tr': 'select'
        },

        // list identifier
        list: 'list',

        // select event
        select: function (e) {
            // find the row from the event target
            var el = $(e.target).closest('tr');

            // if its already selected, unselect it
            if (el.hasClass('selected')) {
                el.removeClass('selected');
                this.$selected = undefined;
            } else { // otherwise, clear any selections and select it
                $('.selected', this.$el).removeClass('selected');
                el.addClass('selected');
                this.$selected = el;
            }
        },

        // get the view object of the selected element
        get_selected: function () {
            var that = this;
            return _.find(this.views[this.list], function (view) {
                if (view.$el && that.$selected) {
                    return view.$el[0] === that.$selected[0];
                } else {
                    return false;
                }
            });
        },

        $selected: undefined,

        // initialize the view
        initialize: function () {

            // initialize keyboard events
            this.initialize_keyboard();

        },

        // keyboard event functions
        keyboard: {
            'k': 'previous_row',
            'j': 'next_row'
        },

        previous_row: function (event, keys, combo) {
            alert('previous_row');
            return false;
        },

        next_row: function () {
            alert('next_row');
            return false;
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