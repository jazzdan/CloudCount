define([
  "namespace",

  // Libs
  "use!backbone",
  
  // Modules
  "modules/budget/index",

  // Plugins
  "use!layoutmanager"
],

function(cc, Backbone, Budget) {

  // Shorthand the app
  var app = cc.app;

  // Create a new module
  var Budgets = cc.module();

  Budgets.Model = Budget.Model;

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
      return this.model.toJSON();
    },

  });

  // Budget List
  Budgets.Views.Index = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budgets/list',

    // render function
    render: function(layout) {
      var view = layout(this);

      this.collection.each(function(budget) {
        view.insert("tbody.budgets", new Budgets.Views.Row({
          model: budget
        }));
      });

      return view.render(this.collection);
    }
    
  });

  // Required, return the module for AMD compliance
  return Budgets;

});