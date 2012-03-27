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

    var Keyboard;

    // define Keyboard
    Keyboard = Backbone.View.extend({

        // event stack hash
        event_stack: {},

        // initialize the view
        initialize: function (options) {

            // the ol' this-that
            var that = this;

            // bind the current scope (for callbacks and the like)
            _.bindAll(this, 'listen', 'fire');

            // set the el to the browser window
            this.el = $(window);

            // bind the keyup event
            this.el.bind('keyup', this.fire);
        },

        // fire key event
        fire: function (event) {

            // variables
            var stack,
                callback,
                key;

            if (this.silent) {
                return;
            }

            // lookup the key
            key = this.lookup(event.keyCode);

            // get the event stack form the event stack hash
            stack = this.event_stack[key];

            // if the stack exists, get the first object
            if (stack) {
                callback = stack[0];
            }

            // if the callback exists, execute it
            if (callback) {
                callback.up(event);
            }

        },

        // apply a key listener
        listen: function (key, callback) {

            // get the stack
            var event_stack = this.event_stack[key];

            // if the stack for this key isn't set, then set it
            if (!event_stack) {
                event_stack = [];
                this.event_stack[key] = event_stack;
            }

            // push the event onto the event stack
            event_stack.unshift({
                up: callback
            });

            // return the object for chaining and such
            return this;
        },

        // lookup semantic name by keyCode
        lookup: function (code) {
            return Keyboard.keycodes[code];
        },

        // clean that shit
        clean: function () {
            window.alert('clean keyboard events');
        },

        silence: function () {
            this.silent = true;
        },

        unsilence: function () {
            this.silent = false;
        },

        // render - throws an exception
        render: function () {
            throw "Global Keyboard view cannot be rendered.";
        }

    }, { // class properties

        // keycode hash
        keycodes: {
              "8": "backspace",
              "9": "tab",
             "13": "enter",
             "16": "shift",
             "17": "ctrl",
             "18": "alt",
             "19": "break",
             "20": "capslock",
             "27": "esc",
             "32": "spacebar",
             "33": "pageup",
             "34": "pagedown",
             "35": "end",
             "36": "home",
             "37": "left",
             "38": "up",
             "39": "right",
             "40": "down",
             "45": "insert",
             "46": "delete",
             "48": "0",
             "49": "1",
             "50": "2",
             "51": "3",
             "52": "4",
             "53": "5",
             "54": "6",
             "55": "7",
             "56": "8",
             "57": "9",
             "65": "a",
             "66": "b",
             "67": "c",
             "68": "d",
             "69": "e",
             "70": "f",
             "71": "g",
             "72": "h",
             "73": "i",
             "74": "j",
             "75": "k",
             "76": "l",
             "77": "m",
             "78": "n",
             "79": "o",
             "80": "p",
             "81": "q",
             "82": "r",
             "83": "s",
             "84": "t",
             "85": "u",
             "86": "v",
             "87": "w",
             "88": "x",
             "89": "y",
             "90": "z",
             "91": "win",
             "92": "_91",
             "93": "select",
             "96": "num0",
             "97": "num1",
             "98": "num2",
             "99": "num3",
            "100": "num4",
            "101": "num5",
            "102": "num6",
            "103": "num7",
            "104": "num8",
            "105": "num9",
            "106": "multiply",
            "107": "add",
            "109": "subtract",
            "110": "decimal",
            "111": "divide",
            "112": "f1",
            "113": "f2",
            "114": "f3",
            "115": "f4",
            "116": "f5",
            "117": "f6",
            "118": "f7",
            "119": "f8",
            "120": "f9",
            "121": "f10",
            "122": "f11",
            "123": "f12",
            "144": "num",
            "145": "scroll",
            "186": "semicolon",
            "187": "equalsign",
            "188": "comma",
            "189": "dash",
            "190": "period",
            "191": "forwardslash",
            "192": "graveaccent",
            "219": "openbracket",
            "220": "backslash",
            "221": "closebracket",
            "222": "singlequote"
        }

    });

    // attach the global keyboard, and View to Backbone
    Backbone.Keyboard = new Keyboard({});

});