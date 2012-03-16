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