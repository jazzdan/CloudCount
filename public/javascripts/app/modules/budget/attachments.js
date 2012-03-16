define([
    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",

    // uploader script
    "uploader",

    // Plugins
    "use!layoutmanager",
    "use!uploadify"
], function (cc, Backbone, Utils) {

    "use strict";

    // Shorthand the app
    var app = cc.app,
        Attachments = cc.module(); // Create a new module

    /**
     * Attachment Model
     */
    Attachments.Model = Backbone.Model.extend({

        // set the id to a mongo style _id
        idAttribute: '_id',

    });

    /**
     * Attachments Collection
     */
    Attachments.Collection = Backbone.Collection.extend({

        model: Attachments.Model,

        comparator: function (a, b) {
            return b.get('_modified') - a.get('_modified');
        },

        initialize: function (models, options) {
            this.budget_id = options.budget_id;
        },

        url: function () {
            return '/budgets/' + this.budget_id + '/attachments';
        }

    });

    /**
     * New Attachment Form
     *    form and logic for uploading attachments
     */
    Attachments.Views.Form = Backbone.LayoutManager.View.extend({

        template: 'budget/attachments/form',

        events: {
            'keyup .info .field': 'validate',
            'focus .info .field': 'validate',
            'blur  .info .field': 'validate'
        },

        validate: function (e) {
            var re,
                valid,
                tar = $(e.target),
                ctn = tar.closest('.control-group');

            switch (tar.attr('id')) {
            case 'label':
                re = new RegExp('^[A-Za-z0-9_\/-]+$');
                break;
            case 'description':
                re = new RegExp('^.+$');
                break;
            }

            valid = re.test(tar.val());

            this.valid[tar.attr('id')] = valid;

            if (valid) {
                ctn.removeClass('error');
            } else {
                ctn.addClass('error');
            }

            this.check_valid();
        },

        check_valid: function () {
            if (this.valid.label && this.valid.description) {
                this.parent.show('confirm');
            } else {
                this.parent.hide('confirm');
            }
        },

        initialize: function (opts) {

            var that = this,
                position = 0;

            this.parent = opts.parent;

            this.valid = {
                'label': false,
                'description': false
            };

            this.parent.bind('confirm', function () {
                if (position === 0) {
                    that.next();
                } else {
                    that.upload();
                }
            });
        },

        next: function () {
            this.uploader();
            $('.info').hide();
            $('.file').show();
            this.uploader.setParams({
                'label': $('#label').val(),
                'description': $('#description').val()
            });
            this.parent.hide('confirm');
        },

        uploader: function () {
            var that = this;

            this.uploader = new qq.FileUploader({
                element: $('#file')[0],
                action: that.upload_url(),
                debug: true,
                encoding: 'multipart',
                onSubmit: function () {
                    $('.file').hide();
                    $('.loading').show();
                },
                onComplete: function (id, fileName, responseJSON) {
                    $('.loading').hide();
                    $('.done').show();
                }
            });
        },

        upload_url: function () {
            return '/budgets/' + this.budget_id + '/attachments/create';
        },

    });

    /**
     * Attachment Row
     */
    Attachments.Views.Row = Backbone.LayoutManager.View.extend({

        template: 'budget/attachments/row',

        tagName: 'tr',

        events: {
            'click .delete': 'delete_att',
            'dblclick': 'download'
        },

        delete_att: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm("Are you sure you want to delete this attachment?")) {
                this.model.destroy();
            }
        },

        download: function () {
            window.open(this.download_url());
        },

        serialize: function () {
            var data = this.model.toJSON(),
                date = new Date(data._modified);

            data.updated = date.toLocaleDateString() + ' (' + date.toLocaleTimeString() + ')';
            data.download = this.download_url();

            return data;
        },

        download_url: function () {
            return '/attachments/' + this.model.get('_id') + '/show';
        },

    });

    /**
     * Attachments
     *    List of downloadable attachments
     * 
     * @extends Utils:List
     */
    Attachments.Views.Index = Utils.Views.List.extend({

        // view template
        template: 'budget/attachments/index',

        // view events
        events: {
            // inherited events:
            'click tr': 'select',
            // events:
            'click .upload': 'upload',
            'change .filter-by': 'filter'
        },

        // upload event
        upload: function (e) {
            var modal,
                that = this;

            // halt default link actions
            e.preventDefault();
            e.stopPropagation();

            // render the modal
            modal = this.view('.tmp', new Utils.Views.Modal({
                title: 'Upload Attachment',
                action: 'Next',
                content: Attachments.Views.Form
            }));

            // render the modal
            modal.render();

            modal.content.budget_id = this.collection.budget_id;

            modal.bind('close', function () {
                delete that.views['.tmp'];
                modal.unbind();
                that.collection.fetch();
            });

        },

        // filter event
        filter: function (e) {
            var label = $(e.target).val();

            e.preventDefault();

            // if the filter isn't empty, filter
            if (label !== '') {
                this.filter_by = label;
            } else {
                this.filter_by = '';
            }

            // render the view
            this.render();

            // restore the filter value
            //$('.filter-match', this.$el).val(label);

        },

        initialize: function (options) {
            var that = this;

            _.bindAll(this, 'render', 'upload');

            this.filter_by = options.filter_by || '';

            this.collection = new Attachments.Collection([], { budget_id: that.options.budget_id });

            this.collection.bind('reset', function (col) {
                that.render();
            });

            this.collection.bind('remove', function (col) {
                that.render();
            });

            this.collection.fetch();
        },

        // render function
        render: function (layout) {
            var that = this,
                view = layout(this),
                collection;

            // if a filter is set, filter the collection
            if (this.filter_by !== '') {
                collection = this.collection.reduce([], function (memo, model) {
                    var label = model.get('label'),
                        reg = new RegExp('^' + that.filter_by);
                    if (reg.test(label)) {
                        memo.push(model);
                    }
                    return memo;
                });
            } else {
                collection = this.collection;
            }

            if (collection.length > 0) {
                // render the budgets
                _.each((collection.models || collection), function (attachment) {
                    view.insert("tbody.attachments", new Attachments.Views.Row({
                        model: attachment
                    }));
                });
            }

            // render the view
            return view.render();
        },

        // serialize for rendering
        serialize: function () {
            var data = {};

            // filtered by...
            data.filter_by = this.filter_by;

            // get labels for filtering
            data.labels = this.collection.reduce(function (memo, model) {
                var label = model.get('label');

                // if the label isn't there, store it
                if (_.indexOf(memo, label) < 0) {
                    memo.push(label);
                }

                return memo;
            }, []);

            return data;
        },

        /* Cleanup */
        onCleanup: function () {
            this.collection.unbind('reset', this.render);
            this.collection.unbind('remove', this.render);
        }

    });

    // Required, return the module for AMD compliance
    return Attachments;

});