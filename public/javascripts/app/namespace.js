define([
    // Libs
    "jquery",
    "use!underscore",
    "use!backbone",

    // Plugins
    "use!layoutmanager"
], function ($, _, Backbone) {

    "use strict";

    Backbone.LayoutManager.configure({

        /**
         * Paths
         *
         * set base template paths
         *
         * @var object
         */
        paths: {
            layout: "http://" + document.location.host + "/public/javascripts/app/templates/layouts/",
            template: "http://" + document.location.host + "/public/javascripts/app/templates/"
        },

        /**
         * Fetch 
         *
         * retrieves templates
         *
         * @param  string   path
         * @return function
         */
        fetch: function (path) {

            var done = this.async(),
                JST = window.JST = window.JST || {};

            path = path + ".hbs";

            // Should be an instant synchronous way of getting the template, if it
            // exists in the JST object.
            if (JST[path]) {
                return done(JST[path]);
            }

            $.get(path, function (contents) {
                var tmpl = Handlebars.compile(contents);
                JST[path] = tmpl;
                done(tmpl);
            });
        },

        /**
         * Render
         *
         * renders a template
         *
         * @param  function template
         * @param  object   context
         * @return string
         */
        render: function (template, context) {
            return template(context);
        }

    });

    return {
        // Create a custom object with a nested Views object
        module: function (additionalProps) {
            return _.extend({ Views: {} }, additionalProps);
        },

        // Keep active application instances namespaced under an app object.
        app: _.extend({
            models: {},
            collections: {}
        }, Backbone.Events)
    };

});