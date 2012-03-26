/*!
 * backbone.keyboard.js v0.2.1
 * Copyright 2012, Colby Rabideau (@colbyrabideau)
 * backbone.keyboard.js may be freely distributed under the MIT license.
 */
define([
    // Libs
    "jquery",
    "use!underscore",
    "use!backbone",

    // Plugins
    "use!layoutmanager"
], function ($, _, Backbone) {

    "use strict";

    // define Keyboard
    var Keyboard = Backbone.View.extend({

        clean: function () {
            alert('clean keyboard events');
        }

    });

    // attach the global keyboard, and View to Backbone
    Backbone.KeyboardView = Keyboard;
    Backbone.Keyboard = new Keyboard();

});