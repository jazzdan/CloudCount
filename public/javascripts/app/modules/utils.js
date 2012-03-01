define([
  "namespace",

  // Libs
  "use!backbone",

  // Plugins
  "use!layoutmanager"
],

function(cc, Backbone) {

  // Shorthand the app
  var app = cc.app;

  // Create a new module
  var Utils = cc.module();

  /**
   * Refresh Control Bar
   */
  Utils.Views.RefreshBar = Backbone.LayoutManager.View.extend({

    // view template
    template: "utils/controlbar-refresh",

    // wrapper tag
    tagName: "div"
  });

  /**
   * Budget Control Bar
   */
  Utils.Views.BudgetBar = Utils.Views.RefreshBar.extend({

    // view template
    template: "utils/controlbar-budget",

  });

  /**
   * Modal Dialog
   */
  Utils.Views.Modal = Backbone.LayoutManager.View.extend({

    // view template
    template: 'utils/modal',

    // view events
    events: {
      'click [data-action]': 'action',
    },

    // button actions
    action: function (e) {

      // halt the event
      e.preventDefault();
      e.stopPropagation();

      // get the action
      var action = $(e.target).data('action');

      // fire an action event
      this.trigger(action);

    },

    // render the modal
    render: function(manage) {

      var view = manage(this);

      // insert the content into the modal
      this.content = new this.options.content;
      view.insert(".modal-body", this.content);

      // render the modal
      return view.render();

    },

    // serialize function
    serialize: function () {

      // this/that
      var that = this;

      // return serialized object
      return {
        title: that.options.title || 'Modal',
        action: that.options.action || 'Ok',
        close: that.options.close || 'Close'
      };
    }

  })

  // Required, return the module for AMD compliance
  return Utils;

});