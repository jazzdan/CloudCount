define([

    "namespace",

    // Libs
    "use!backbone",

    // modules
    "modules/utils",

    // Plugins
    "use!layoutmanager"

], function (cc, Backbone, Utils) {

    "use strict";

    var app = cc.app,
        Sublines = cc.module();

    Sublines.Views.Transactions = Backbone.LayoutManager.View.extend({

        template: 'line/transactions'

    });

    /**
     * List
     *
     * represents a collection of sublines
     */
    Sublines.Views.List = Utils.Views.List.extend({

        template: 'line/subline',

        initialize: function (opts) {
            this.model = opts.model;
        }

    });

    return Sublines;

});