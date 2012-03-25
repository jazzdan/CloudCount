define([
    "namespace",

    // Libs
    "use!backbone",
    "keyboard",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone) {

    //"use strict";

        // Shorthand the app
    var app = cc.app,
        // Create a new module
        Utils = cc.module();

    /**
     * Keyboard Events
     *      implements keyboard events
     */
    Utils.Views.Keyboard = Backbone.LayoutManager.View.extend({

        // initialize view
        initialize: function () {

            _.bindAll(this, 'initialize_keyboard');

            // initialize keyboard events
            this.initialize_keyboard()

        },

        // keyboard event hash
        keyboard: {},

        // initlialize keyboard events
        initialize_keyboard: function () {

            var that = this;

            // initialize all keyboard events
            _.each(that.keyboard, function (val, key) {

                var clean,
                    down,
                    up;

                if (_.isString(val)) {
                    down = val;
                } else {
                    down = val.down;
                    up = val.up;
                }

                var clean = KeyboardJS.bind.key(key, that[down], that[up]);

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
        },

        // initialize the view
        initialize: function () {

            // initialize keyboard events
            this.initialize_keyboard()

        },

    });

    /**
     * Refresh Control Bar
     */
    Utils.Views.RefreshBar = Backbone.LayoutManager.View.extend({

        // view template
        template: "utils/controlbar-refresh",

        // wrapper tag
        tagName: "div",

    });

    /**
     * Budget Control Bar
     */
    Utils.Views.BudgetBar = Utils.Views.RefreshBar.extend({

        // view template
        template: "utils/controlbar-budget",

    });

    /**
     * Modal Dialog
     */
    Utils.Views.Modal = Backbone.LayoutManager.View.extend({

        // view template
        template: 'utils/modal',

        // view events
        events: {
            'click [data-action]': 'action',
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
        },

    });

    // Required, return the module for AMD compliance
    return Utils;

});