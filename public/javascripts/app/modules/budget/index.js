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
    idAttribute: '_id',

    url: function () {
      return '/budgets/' + this.get('_id');
    }

  });

  /**
   * Nav
   *    Pill style navigation for switching tabs
   */
  Budget.Views.Nav = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budget/nav',

    /* Cleanup */
    cleanup: function () {
      this.remove();
      this.unbind();
    }

  });

  /**
   * Budget
   *    Budget View
   */
  Budget.Views.Budget = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budget/budget',

    /* Cleanup */
    cleanup: function () {
      this.remove();
      this.unbind();
    }

  });

  /**
   * Description
   *    List of recent changes to the budget
   */
  Budget.Views.Description = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budget/description',

    /* Cleanup */
    cleanup: function () {
      this.remove();
      this.unbind();
    }

  });

  /**
   * Attachments (alias)
   *    List of downloadable attachments
   */
  Budget.Views.Attachments = Attachments.Views.Index;

  /**
   * Notes
   *    List of user notes
   */
  Budget.Views.Notes = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budget/notes',

    /* Cleanup */
    cleanup: function () {
      this.remove();
      this.unbind();
    }

  });

  /**
   * Audits
   *    List of recent changes to the budget
   */
  Budget.Views.Audit = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budget/audit',

    /* Cleanup */
    cleanup: function () {
      this.remove();
      this.unbind();
    }

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
      '.section.budget': new Budget.Views.Budget()
    },

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
          section_class = '.' + name,
          section = $(section_class),
          proper_name = name.charAt(0).toUpperCase() + name.slice(1);

      // target isnt already active, activate it
      if(!section.hasClass('active')){

        // if the section view isnt already rendered, render it
        if (!this.views['.section.' + section_class]) {
          var that = this;
          var view = this.view('.section.' + section_class, new Budget.Views[proper_name]({
            budget_id: that.model.get('_id')
          })).render();
        }

        // hide the old one
        $('.active').removeClass('active');

        //show the new one
        section.addClass('active');

        // update the label
        $('.section-label').html(proper_name);

      }

    },

    // serialize for rendering
    serialize: function () {
      return this.model.toJSON();
    },

    /* Cleanup */
    cleanup: function () {
      this.remove();
      this.unbind();
    }

  });

  // Required, return the module for AMD compliance
  return Budget;

});