define([

    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",
    "modules/budget/index",

    // uploader script
    "uploader",

    // Plugins
    "use!layoutmanager",
    "use!uploadify"

], function (cc, Backbone, Utils, Budget) {

    "use strict";

    // Shorthand the app
    var app = cc.app,
        Details = cc.module(); // Create a new module

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
                content: Budget.Views.Form
            }));

            close_modal = function () {
                that.delete_view('.tmp');
                modal.unbind();
            };

            // render the modal
            modal.render();

            // bind modal confirm event
            modal.bind('confirm', function () {

                if (modal.content.save()) {

                    // refresh collection
                    that.collection.fetch({
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

            // set the budget
            this.budget = opts.budget;

        },

        // serialize for rendering
        serialize: function () {
            var starts,
                ends,
                data = this.budget.toJSON();

            // prettify dates
            starts = new Date(data.starts);
            data.starts = starts.toLocaleDateString();
            ends = new Date(data.ends);
            data.ends = ends.toLocaleDateString();

            return data;
        }

    });

    // return the module for AMD
    return Details;

});