define([
  "namespace",

  // Libs
  "use!backbone",

  // modules
  "modules/utils",

  // Plugins
  "use!layoutmanager"
],

function(cc, Backbone, Utils) {

  // Shorthand the app
  var app = cc.app;

  // Create a new module
  var Attachments = cc.module();

  /**
   * Attachment Model
   */
  Attachments.Model = Backbone.Model.extend({

    // set the id to a mongo style _id
    idAttribute: '_id'

  });

  /**
   * Attachments Collection
   */
  Attachments.Collection = Backbone.Collection.extend({

    model: Attachments.Model,

    initialize: function (options) {
      this.budget_id = options.budget_id;
    },

    url: function () {
      return '/budgets/' + this.budget_id + '/attachments';
    }

  });

  /**
   * New Attachment Form
   *    form and logic for uploading attachments
   */
  Attachments.Views.Form = Backbone.LayoutManager.View.extend({

    template: 'budget/attachments/form'

  });

  /**
   * Attachment Row
   */
  Attachments.Views.Row = Backbone.LayoutManager.View.extend({

    template: 'budget/attachments/row',

    tagName: '<tr>'

  });

  /**
   * Attachments
   *    List of downloadable attachments
   */
  Attachments.Views.Index = Backbone.LayoutManager.View.extend({

    // view template
    template: 'budget/attachments/index',

    // view events
    events: {
      'click .upload': 'upload'
    },

    // upload event
    upload: function (e) {

      // halt default link actions
      e.preventDefault();
      e.stopPropagation();

      // render the modal
      var modal = this.view('.tmp', new Utils.Views.Modal({
        title: 'Upload Attachment',
        action: 'Upload',
        content: Attachments.Views.Form
      }));

      // render the modal
      modal.render();

      // bind the modal close event
      modal.bind('close', function () {
        modal.remove();
      });

      // bind the modal confirm event
      modal.bind('confirm', function () {
        alert('Uploaded something!');
        modal.remove();
      });
    },

    initialize: function (options) {
      var that = this;
      this.collection = new Attachments.Collection({ budget_id: that.options.budget_id });

      this.collection.fetch({

        success: function (collection, response) {
          that.render();
        }

      });
    },

    // render function
    render: function(layout) {
      var view = layout(this);

      // render the budgets
      this.collection.each(function(attachment) {
        view.insert("tbody.attachments", new Attachments.Views.Row({
          model: attachment
        }));
      });

      // render the view
      return view.render(this.collection);
    }

  });

  // Required, return the module for AMD compliance
  return Attachments;

});