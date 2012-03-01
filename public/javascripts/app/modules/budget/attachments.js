define([
  "namespace",

  // Libs
  "use!backbone",

  // modules
  "modules/utils",

  // uploader script
  "uploader",

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
    idAttribute: '_id', 

  });

  /**
   * Attachments Collection
   */
  Attachments.Collection = Backbone.Collection.extend({

    model: Attachments.Model,

    comparator: function (a, b) {
      return b.get('_modified') - a.get('_modified');
    },

    initialize: function (models, options) {
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

  });

  /**
   * Attachment Row
   */
  Attachments.Views.Row = Backbone.LayoutManager.View.extend({

    template: 'budget/attachments/row',

    tagName: 'tr',

    events: {
      'click .delete': 'delete_att',
      'dblclick td': 'download'
    },

    delete_att: function (e) {
      e.preventDefault();
      e.stopPropagation();
      if(confirm("Are you sure you want to delete this attachment?"))
        this.model.destroy();
    },

    download: function () {
      window.open(this.download_url());
    },

    serialize: function () {
      var data = this.model.toJSON(),
          date = new Date(data._modified);
      data['updated'] = date.toLocaleDateString();
      data['download'] = this.download_url();
      return data;
    },

    download_url: function () {
      return '/attachments/' + this.model.get('_id') + '/show';
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
      var that = this;

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

      modal.bind('close', function () {
        delete that.views['.tmp'];
        that.collection.fetch();
      });

    },

    initialize: function (options) {
      var that = this;

      _.bindAll(this, 'render', 'upload');

      this.collection = new Attachments.Collection([], { budget_id: that.options.budget_id });

      this.collection.bind('reset', function(col) {
        that.render();
      });

      this.collection.bind('remove', function(col) {
        that.render();
      });

      this.collection.fetch();

    },

    // render function
    render: function(layout) {
      var view = layout(this);

      if (this.collection.length > 0) {
        // render the budgets
        this.collection.each(function(attachment) {
          view.insert("tbody.attachments", new Attachments.Views.Row({
            model: attachment
          }));
        });
      }

      // render the view
      return view.render();
    }

  });

  // Required, return the module for AMD compliance
  return Attachments;

});