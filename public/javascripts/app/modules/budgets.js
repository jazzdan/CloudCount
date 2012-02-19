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
  var Budgets = cc.module();

  Budgets.Model = Backbone.Model.extend();

  Budgets.Collection = Backbone.Collection.extend({

    model: Budgets.Model,

    url: function () {
      return '/budgets';
    }

  });

  Budgets.Views.Row = Backbone.LayoutManager.View.extend({
    template: 'budgets/row',

    tagName: 'tr',
    
    events: {
      'click .delete': 'delete'
    },

    delete: function (e) {
      e.preventDefault();
      alert('delete');
    },
    
    serialize: function() {
      var s = this.model.toJSON();
      s.cid = this.model.cid;
      return s;
    },

  });

  // Budget List
  Budgets.Views.List = Backbone.LayoutManager.View.extend({
    template: 'budgets/list',

    tagName: 'div',
    
    render: function(layout) {
      var view = layout(this);

      this.collection.each(function(budget) {
        view.insert("tbody.budgets", new Budgets.Views.Row({
          model: budget
        }));
      });

      return view.render(this.collection);
    },

    initialize: function () {
      this.collection.bind("reset", function() {
        this.render();
      }, this);
    }
    
  });

  // Required, return the module for AMD compliance
  return Budgets;

});