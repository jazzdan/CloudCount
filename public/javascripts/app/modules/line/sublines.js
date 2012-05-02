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

        /**
         * Template
         *
         * relative path to template
         *
         * @var string
         */
        template: 'line/transactions'

    });

    Sublines.Views.Form = Utils.Views.Form.extend();

    Sublines.Views.Row = Backbone.View.extend({

        /**
         * Template
         *
         * relative path to template
         *
         * @var string
         */
        template: 'line/row',

        /**
         * Initialize
         *
         * constructor
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {
            this.model = opts.model;
        },

        /**
         * Serialize
         *
         * package the data for rendering
         *
         * @return object
         */
        serialize: function () {
            var data = this.model.toJSON();
            return data;
        }

    });

    /**
     * List
     *
     * represents a collection of sublines
     */
    Sublines.Views.List = Utils.Views.List.extend({

        /**
         * Template
         *
         * relative path to template
         *
         * @var string
         */
        template: 'line/subline',

        /**
         * Initialize
         *
         * constructor
         *
         * @param  object    opts
         * @return undefined
         */
        initialize: function (opts) {
            this.model = opts.model;
        },

        /**
         * Render
         *
         * builds the view for display
         *
         * @param  function layout
         * @return object
         */
        render: function (layout) {
            var view = layout(this);

            this.collection.each(function (subline) {
                view.insert("tbody.sublines", new Sublines.Views.Row({
                    model: subline
                }));
            });

            return view.render();
        }

    });

    return Sublines;

});