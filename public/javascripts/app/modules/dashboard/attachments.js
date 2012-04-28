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

    var app = cc.app,
        Attachments = cc.module();

    /**
     * Model
     *
     * Attachments model
     */
    Attachments.Model = Backbone.Model.extend({

        /**
         * Id Attribute
         *
         * use a mongo-style _id
         *
         * @var string
         */
        idAttribute: '_id'

    });

    /**
     * Collection
     *
     * Attachments collection
     */
    Attachments.Collection = Backbone.Collection.extend({

        /**
         * Model
         *
         * the model to be collected
         *
         * @var Model
         */
        model: Attachments.Model,

        /**
         * Comparator
         *
         * defines the order of the collection
         * sorted by date modified
         *
         * @param  model  a
         * @param  model  b
         * @return number
         */
        comparator: function (a, b) {
            return b.get('_modified') - a.get('_modified');
        },

        /**
         * Initialize
         *
         * setup the collection
         *
         * @param  array     models
         * @param  object    opts
         * @return undefined
         */
        initialize: function (models, opts) {
            this.budget_id = opts.budget_id;
        },

        /**
         * URL
         *
         * Collection's associated URL
         *
         * @return string
         */
        url: function () {
            return '/budgets/' + this.budget_id + '/attachments';
        }

    });

    /**
     * Form
     *
     * Form for uploading a new attachment
     */
    Attachments.Views.Form = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to the view template
         *
         * @var string
         */
        template: 'dashboard/attachments/form',

        /**
         * Events
         *
         * defines event listeners and handlers
         *
         * @var object
         */
        events: {
            'keyup .info .field': 'validate',
            'focus .info .field': 'validate',
            'blur  .info .field': 'validate'
        },

        /**
         * Validate
         *
         * checks if the form contains valid data
         *
         * @param  event     e
         * @return undefined
         */
        validate: function (e) {
            var re,
                valid,
                tar = $(e.target),
                ctn = tar.closest('.control-group');

            switch (tar.attr('id')) {
            case 'label':
                re = new RegExp('^[A-Za-z0-9_\/-]+$');
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

        /**
         * Check Valid
         *
         * I'm not exactly sure... :(
         *
         * @return undefined
         */
        check_valid: function () {
            if (this.valid.label) {
                this.parent.show('confirm');
            } else {
                this.parent.hide('confirm');
            }
        },

        /**
         * Initialize
         *
         * setup the view
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {

            var that = this,
                position = 0;

            this.parent = opts.modal;

            this.budget = opts.budget;
            this.budget_id = this.budget.get('_id');

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

        /**
         * Next
         *
         * progress the the next step in the upload
         *
         * @return undefined
         */
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

        /**
         * Uploader
         *
         * instantiates the file uploader
         *
         * @return undefined
         */
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

        /**
         * Upload URL
         *
         * files are uploaded to this location
         *
         * @return string
         */
        upload_url: function () {
            return '/budgets/' + this.budget_id + '/attachments/create';
        }

    });

    /**
     * Row
     *
     * inidividual attachment in the list
     */
    Attachments.Views.Row = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to the view template
         *
         * @var string
         */
        template: 'dashboard/attachments/row',

        /**
         * Tag Name
         *
         * defines the view's wrapper tag
         *
         * @var string
         */
        tagName: 'tr',

        /**
         * Events
         *
         * defines event listeners and handlers
         *
         * @var object
         */
        events: {
            'click .delete': 'delete_att',
            'dblclick': 'download'
        },

        /**
         * Delete Att
         *
         * delete an attachment
         *
         * @param  event     e
         * @return undefined
         */
        delete_att: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm("Are you sure you want to delete this attachment?")) {
                this.model.destroy();
            }
        },

        /**
         * Download
         *
         * Downloads an attachment in a new tab/window
         *
         * @return undefined
         */
        download: function () {
            window.open(this.download_url());
        },

        /**
         * Serialize
         *
         * package data for rendering
         *
         * @return object
         */
        serialize: function () {
            var data = this.model.toJSON();

            data.updated = Utils.Date.for_humans(data._modified, 'full');
            data.download = this.download_url();

            return data;
        },

        /**
         * Download URL
         *
         * url for downloading the attachment
         *
         * @return undefined
         */
        download_url: function () {
            return '/attachments/' + this.model.get('_id') + '/show';
        }

    });

    /**
     * Index
     *
     * List of attachments
     */
    Attachments.Views.Index = Utils.Views.List.extend({

        /**
         * Template
         *
         * relative path to view template
         *
         * @var string
         */
        template: 'dashboard/attachments/index',

        /**
         * Events
         *
         * defines event listeners and handlers
         *
         * @var object
         */
        events: {
            // inherited events:
            'click tbody tr': 'select',
            // events:
            'click .upload': 'upload',
            'change .filter-by': 'filter'
        },

        /**
         * Upload
         *
         * flow for uploading a new attachment
         *
         * @param  event     e
         * @return undefined
         */
        upload: function (e) {
            var modal,
                that = this;

            e.preventDefault();
            e.stopPropagation();

            modal = this.view('.tmp', new Utils.Views.Modal({
                title: 'Upload Attachment',
                action: 'Next',
                content: Attachments.Views.Form,
                content_options: {
                    budget: that.budget
                }
            }));

            modal.render();

            modal.bind('close', function () {
                delete that.views['.tmp'];
                modal.unbind();
                that.collection.fetch();
            });

        },

        /**
         * Filter
         *
         * only display attachments with the selected label
         *
         * @param  event     e
         * @return undefined
         */
        filter: function (e) {
            var label = $(e.target).val();

            e.preventDefault();

            if (label !== '') {
                this.filter_by = label;
            } else {
                this.filter_by = '';
            }

            this.render();

            $('.filter-by', this.$el).val(label);

        },

        /**
         * Initialize
         *
         * setup the view
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {
            var that = this;

            _.bindAll(this, 'render', 'upload');

            this.budget = opts.budget;
            this.budget_id = this.budget.get('_id');

            this.filter_by = opts.filter_by || '';

            if (!opts.budget.attachments) {
                opts.budget.attachments = new Attachments.Collection([], {
                    budget_id: that.budget_id
                });
                this.collection = opts.budget.attachments;
                opts.budget.attachments.fetch({

                    success: function () {
                        that.collection.bind('reset', function (col) {
                            that.render();
                        });

                        that.collection.bind('remove', function (col) {
                            that.render();
                        });
                    }

                });
            } else {
                this.collection = opts.budget.attachments;
                that.collection.bind('reset', function (col) {
                    that.render();
                });

                that.collection.bind('remove', function (col) {
                    that.render();
                });
            }
        },

        /**
         * Render
         *
         * builds & displays the view
         *
         * @param  layoutManager layout
         * @return view
         */
        render: function (layout) {
            var that = this,
                view = layout(this),
                collection;

            if (this.filter_by !== '') {
                collection = this.collection.reduce(function (memo, model) {
                    var label = model.get('label'),
                        reg = new RegExp('^' + that.filter_by);
                    if (reg.test(label)) {
                        memo.push(model);
                    }
                    return memo;
                }, []);
            } else {
                collection = this.collection;
            }

            if (collection.length > 0) {

                _.each((collection.models || collection), function (attachment) {

                    view.insert("tbody.attachments", new Attachments.Views.Row({
                        model: attachment
                    }));

                });
            }

            return view.render();
        },

        /**
         * Labels
         *
         * Get labels in the collection
         *
         * @return array
         */
        labels: function () {
            return this.collection.reduce(function (memo, model) {
                var label = model.get('label');
                if (_.indexOf(memo, label) < 0) {
                    memo.push(label);
                }
                return memo;
            }, []);
        },

        /**
         * Serialize
         *
         * package data for rendering
         *
         * @return object
         */
        serialize: function () {
            var data = {};
            data.filter_by = this.filter_by;
            data.labels = this.labels();
            return data;
        },

        /**
         * On Cleanup
         *
         * cleanup events when the view is removed
         *
         * @return undefined
         */
        onCleanup: function () {
            this.collection.unbind('reset', this.render);
            this.collection.unbind('remove', this.render);
        }

    });

    // return the module for AMD compliance
    return Attachments;

});