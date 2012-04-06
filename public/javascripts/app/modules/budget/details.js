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
        Details = cc.module(); // Create a new module

    /**
     * Index View
     */
    Details.Views.Index = Backbone.LayoutManager.View.extend({

        // view template
        template: 'budget/details/index',

        // initialize
        initialize: function (opts) {

            // set the budget
            this.budget = opts.budget;

        },

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