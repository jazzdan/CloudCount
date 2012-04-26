define([

    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",

    // uploader script
    "uploader"

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

        initialize: function (opts) {

            this.base_model = app.models.Line;

            _.bindAll(this, 'show_errors');

            this.model = new this.base_model();

            this.model.bind('error', this.show_errors);

        },

        serialize: function () {
            var data = {};
            data.type = this.options.type;
            return data;
        }

    });

    Line.Views.Line = Backbone.LayoutManager.View.extend({

        template: 'budget/budget/line',

        tagName: 'tr',

        events: {
            'click .delete': 'delete_line'
        },

        delete_line: function () {
            if (window.confirm("Are you sure you want to delete this line?")) {
                this.model.destroy();
            }
        },

        serialize: function () {
            var data = this.model.toJSON();
            data.subtotal = Utils.Str.price(data.subtotal);
            return data;
        }

    });

    Line.Views.Index = Utils.Views.List.extend({

        template: 'budget/budget/lines',

        events: {
            // inherited events:
            'click tbody tr': 'select',
            // class events
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
                content: Line.Views.Form,
                content_options: {
                    type: that.title
                }
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
            var that = this;

            this.title = opts.title;
            this.collection = opts.collection;

            this.collection.bind('reset', function () {
                that.render();
            });

            this.collection.bind('remove', function () {
                that.render();
            });

            this.collection.fetch();
        },

        // render function
        render: function (layout) {

            var view = layout(this);

            this.collection.each(function (line) {
                view.insert("tbody.lines", new Line.Views.Line({
                    model: line
                }));
            });

            // render the view
            return view.render();
        },

        serialize: function () {
            var data = {};
            data.title = Utils.Str.upper(this.title);
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