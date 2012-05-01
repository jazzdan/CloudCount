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
        Sublines = app.module();

    return Sublines;

});