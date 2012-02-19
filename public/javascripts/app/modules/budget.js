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

  Budget.Model = Backbone.Model.extend();

  // Budget List
  Budget.Views.Shell = Backbone.LayoutManager.View.extend({
    template: 'budget/shell',

    tagName: 'div',
    
    events: {
      'click .section-nav': 'section_nav'
    },
    
    section_nav: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var tar = $(e.target);
      var section = $('.' + tar.data('section'));
      if(!section.hasClass('active')){
        $('.active').removeClass('active');
        section.addClass('active');
      }
    }
    
  });

  // Required, return the module for AMD compliance
  return Budget;

});