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
        Line = cc.module(); // Create a new module

    /**
     * Budget Form
     */
    Line.Views.Form = Utils.Views.Form.extend({

        // form template
        template: 'budget/budget/line-form',

        initialize: function () {

            this.base_model = app.models.Line;

            _.bindAll(this, 'show_errors');

            this.model = new this.base_model();

            this.model.bind('error', this.show_errors);
        }

    });

    Line.Views.Index = Backbone.LayoutManager.View.extend({

        template: 'budget/budget/lines',

        events: {
            'click .new': 'new_line'
        },

        // new budget event
        new_line: function (e) {

            // the ol' this-that
            var that = this,
                modal,
                close_modal;

            e.preventDefault();
            e.stopPropagation();

            // render the modal
            modal = this.view('.tmp', new Utils.Views.Modal({
                title: 'New Line',
                action: 'Save',
                content: Line.Views.Form
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

        initialize: function (opts) {
            this.title = opts.title;
        },

        serialize: function () {
            var data = {};
            data.title = this.title;
            return data;
        },

        delete_view: function (key) {
            this.views[key].remove();
            delete this.views[key];
        }

    });

    // return the module for AMD
    return Line;

});