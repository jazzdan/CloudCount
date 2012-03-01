define([
  "namespace",

  // Libs
  "use!backbone",

  // modules
  "modules/utils",

  // Plugins
  "use!layoutmanager",
  "use!uploadify"
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

    template: 'budget/attachments/form',

    events: {
      'click .cancel a': 'uploadify_cancel'
    },
    
    uploadify_cancel: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var tar = $(e.target).closest('a'),
          script = tar.attr('href').replace('javascript:', '');
      eval(script)();
    },

    render: function (manage) {
      var that = this;
      return manage(that).render();
    },

    uploadify: function () {
      $('#file').uploadify({
        swf: '/public/uploadify/uploadify.swf',
        script: '/uploadify/butts.php',
        cancelImage: '/public/uploadify/uploadify-cancel.png',
        auto: false,
        uploaderType: 'html5',
        buttonText: 'Select File'
      });
    }

  });

  /**
   * Attachment Row
   */
  Attachments.Views.Row = Backbone.LayoutManager.View.extend({

    template: 'budget/attachments/row',

    tagName: 'tr',

    serialize: function () {
      return this.model.toJSON();
    }

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
      modal.render().then(modal.content.uploadify);

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