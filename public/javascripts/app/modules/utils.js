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
  Utils.Views.BudgetBar = Backbone.LayoutManager.View.extend({

    // view template
    template: "utils/controlbar-budget",

  });

  /**
   * Modal Dialog
   */
  Utils.Views.Modal = Backbone.LayoutManager.View.extend({

    // view template
    template: 'utils/modal',

    // serialized object data
    serialize: function () {
      var that = this; // this/that so we can get at the view
      return {
        title: that.options.title || 'Modal',
        action: that.options.action || 'Ok'
      };
    }

  })

  // Required, return the module for AMD compliance
  return Utils;

});