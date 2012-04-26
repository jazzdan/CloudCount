define([

    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",

    // uploader script
    "uploader",

    // Plugins
    "use!layoutmanager"

], function (cc, Backbone, Utils) {

    "use strict";

    // Shorthand the app
    var app = cc.app,
        Details = cc.module(); // Create a new module

    /**
     * Budget Form
     */
    Details.Views.Form = Utils.Views.Form.extend({

        // form template
        template: 'budgets/form',

        // initialize form
        initialize: function () {

            _.bindAll(this, 'show_errors');

            this.model = app.current_budget;

            this.model.bind('error', this.show_errors);

        }

    });

    /**
     * Index View
     */
    Details.Views.Index = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budget/details/index',

        events: {
            'click .edit': 'edit'
        },

        edit: function (e) {

            // the ol' this-that
            var that = this,
                modal,
                close_modal;

            e.preventDefault();
            e.stopPropagation();

            // render the modal
            modal = this.view('.tmp', new Utils.Views.Modal({
                title: 'Edit Budget',
                action: 'Save',
                content: Details.Views.Form
            }));

            close_modal = function () {
                that.delete_view('.tmp');
                modal.unbind();
            };

            // render the modal
            modal.render().then(function () {
                modal.content.hydrate();
            });

            // bind modal confirm event
            modal.bind('confirm', function () {

                if (modal.content.save()) {

                    // refresh collection
                    that.budget.fetch({
                        success: function () {
                            close_modal();
                        },
                        error: function (collection, response) {
                            console.log('FAIL: could not fetch collection');
                            console.log(response);
                        }
                    });

                }

            });

            // bind modal close event
            modal.bind('close', function () {
                close_modal();
            });

        },

        // initialize
        initialize: function (opts) {

            var that = this;

            // set the budget
            this.budget = opts.budget;

            this.budget.bind("change", function () {
                that.render();
            });

        },

        // serialize for rendering
        serialize: function () {
            var starts,
                ends,
                data = this.budget.toJSON();

            // prettify dates
            starts = new Date(data.starts);
            data.starts = starts.getDate() + '-' + (starts.getMonth() + 1) + '-' + starts.getFullYear();
            ends = new Date(data.ends);
            data.ends = ends.getDate() + '-' + (ends.getMonth() + 1) + '-' + ends.getFullYear();

            return data;
        },

        delete_view: function (key) {
            this.views[key].remove();
            delete this.views[key];
        }

    });

    // return the module for AMD
    return Details;

});