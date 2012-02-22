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
  var Budget = cc.module();

  Budget.Model = Backbone.Model.extend({

    idAttribute: '_id'

  });

  // Budget List
  Budget.Views.Nav = Backbone.LayoutManager.View.extend({
    template: 'budget/nav',

    events: {
      'click .section-nav': 'section_nav'
    },
    
    section_nav: function (e) {

      // STOP the event!
      e.preventDefault();
      e.stopPropagation();

      // some variables
      var tar = $(e.target),
          name = tar.data('section'),
          section = $('.' + name);

      if(!section.hasClass('active')){

        // hide the old one
        $('.active').removeClass('active');

        //show the new one
        section.addClass('active');

        // update the label
        $('.section-label').html((function(){
          return name.charAt(0).toUpperCase() + name.slice(1);
        })());

      }

    }
    
  });
  
  Budget.Views.Budget = Backbone.LayoutManager.View.extend({
    
    template: 'budget/budget',
    
  });
  
  Budget.Views.Description = Backbone.LayoutManager.View.extend({
    
    template: 'budget/description',
    
  });
  
  Budget.Views.Attachments = Backbone.LayoutManager.View.extend({
    
    template: 'budget/attachments',
    
  });
  
  Budget.Views.Notes = Backbone.LayoutManager.View.extend({
    
    template: 'budget/notes',
    
  });
  
  Budget.Views.Audit = Backbone.LayoutManager.View.extend({
    
    template: 'budget/audit',
    
  });
  
  Budget.Views.BudgetMain = Backbone.LayoutManager.View.extend({
    
    template: 'budget/main',
    
    views: {
    
      '.nav': new Budget.Views.Nav(),
      '.section.description': new Budget.Views.Description(),
      '.section.attachments': new Budget.Views.Attachments(),
      '.section.notes': new Budget.Views.Notes(),
      '.section.audit': new Budget.Views.Audit()
    
    }
    
  });

  // Required, return the module for AMD compliance
  return Budget;

});