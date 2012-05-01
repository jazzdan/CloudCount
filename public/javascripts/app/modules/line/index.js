define([
    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",
    "modules/dashboard/budget",
    "modules/dashboard/details",
    "modules/dashboard/attachments",

    // Plugins
    "use!layoutmanager"
], function (cc, Backbone, Utils, Budget, Details, Attachments) {

    "use strict";

    var app = cc.app,
        Line = cc.module(); // Create a new module


    /**
     * Index
     *
     * shell view for budget dashboard
     */
    Line.Views.Index = Backbone.LayoutManager.View.extend({

        /**
         * Template
         *
         * relative path to template
         *
         * @var string
         */
        template: 'line/index',

        /**
         * Events
         *
         * defines event listeners and handlers
         *
         * @var object
         */
        events: {},

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

            //this.model = opts.model;

            this.views = {};

            //this.model.bind('change', function () {
            //    that.render();
            //});

        },

        /**
         * Serialize
         *
         * package data for rendering
         *
         * @return object
         */
        serialize: function () {
            var that = this,
                data = {};//this.model.toJSON();
            return data;
        }

    });

    // return the module for AMD compliance
    return Line;

});