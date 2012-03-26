/*!
 * backbone.keyboard.js v0.2.1
 * Copyright 2012, Colby Rabideau (@colbyrabideau)
 * backbone.keyboard.js may be freely distributed under the MIT license.
 */
(function (window) {

    // environment variables
    var Backbone = window.Backbone,
        _ = window._,
        $ = window.$;

    // define Keyboard
    var Keyboard = Backbone.view.extend({

        clean: function () {
            alert('clean keyboard events');
        }

    });

    // attach the global keyboard, and View to Backbone
    Backbone.KeyboardView = Keyboard;
    Backbone.Keyboard = new Keyboard();

}(this));