/*!
 * backbone.keyboard.js v0.1.0
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

        initialize: function (options) {

            this.el = $(window);

            this.el.bind('keyup', function () {
                console.log('window.keyup - ' + event.keyCode);
            });

            this.el.bind('keydown', function (event) {
                console.log('window.keydown - ' + event.keyCode);
            });
        },

        clean: function () {
            window.alert('clean keyboard events');
        },

        render: function () {
            throw "Global Keyboard view cannot be rendered.";
        }

    });

    // attach the global keyboard, and View to Backbone
    Backbone.KeyboardView = Keyboard;
    Backbone.Keyboard = new Keyboard({});

});