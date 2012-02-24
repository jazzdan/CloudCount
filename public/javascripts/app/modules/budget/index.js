define([
  "namespace",

  // Libs
  "use!backbone",

  // modules
  "modules/budget/attachments",

  // Plugins
  "use!layoutmanager"
],

function(cc, Backbone, Attachments) {

  // Shorthand the app
  var app = cc.app;

  // Create a new module
  var Budget = cc.module();

  /**
   * Model
   *    The Budget Model
   */
  Budget.Model = Backbone.Model.extend({

    // set the id to a mongo style _id
    idAttribute: '_id'

  });

  /**
   * Nav
   *    Pill style navigation for switching tabs
   */
  Budget.Views.Nav = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budget/nav',

    // view events
    events: {
      'click .section-nav': 'section_nav'
    },

    // navigation event
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

  /**
   * Budget
   *    Budget View
   */
  Budget.Views.Budget = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budget/budget',

  });

  /**
   * Description
   *    List of recent changes to the budget
   */
  Budget.Views.Description = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budget/description',

  });

  /**
   * Notes
   *    List of user notes
   */
  Budget.Views.Notes = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budget/notes',

  });

  /**
   * Audits
   *    List of recent changes to the budget
   */
  Budget.Views.Audit = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budget/audit',

  });
  
  /**
   * Container
   *    encompasses Audits, Nots, Attachments, Description & Budget
   */
  Budget.Views.Index = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budget/index',

    // nested views
    views: {
      '.nav': new Budget.Views.Nav(),
      '.section.description': new Budget.Views.Description(),
      '.section.attachments': new Attachments.Views.Index(),
      '.section.notes': new Budget.Views.Notes(),
      '.section.audit': new Budget.Views.Audit()
    },

    serialize: function () {
      return this.model.toJSON();
    }

  });

  // Required, return the module for AMD compliance
  return Budget;

});