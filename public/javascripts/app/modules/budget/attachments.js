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

    events: {
      'keyup .info .field': 'validate',
      'focus .info .field': 'validate',
      'blur  .info .field': 'validate'
    },

    validate: function (e) {
      var tar = $(e.target),
          ctn = tar.closest('.control-group');

      switch(tar.attr('id')) {
        case 'label':
          var re = new RegExp('^[A-Za-z0-9_\/-]+$');
          break;
        case 'description':
          var re = new RegExp('^.+$');
          break;
      }
      valid = re.test(tar.val());
      this.valid[tar.attr('id')] = valid;
      if(valid)
        ctn.removeClass('error');
      else
        ctn.addClass('error');

      this.check_valid();
    },

    check_valid: function () {
      if(this.valid.label && this.valid.description)
        this.parent.show('confirm');
      else
        this.parent.hide('confirm');
    },

    initialize: function (opts) {
      FORM = this; 
      var that = this;
      this.parent = opts.parent;
      this.valid = {
        'label': false,
        'description': false
      }
      var position = 0;
      this.parent.bind('confirm', function(){
        if(position == 0)
          that.next();
        else
          that.upload();
      });
    },

    next: function () {
      this.uploader();
      $('.info').hide();
      $('.file').show();
      this.uploader.setParams({
        'label': $('#label').val(),
        'description': $('#description').val()
      });
      this.parent.hide('confirm');
    },

    uploader: function () {
      var that = this;
      this.uploader = new qq.FileUploader({
        element: $('#file')[0],
        action: that.upload_url(),
        debug: true,
        encoding: 'multipart',
        onSubmit: function () {
          $('.file').hide();
          $('.loading').show();
        },
        onComplete: function(id, fileName, responseJSON){
          $('.loading').hide();
          $('.done').show();
        }
      });
    },

    upload_url: function () {
      return '/budgets/' + this.budget_id + '/attachments/create';
    },

  });

  /**
   * Attachment Row
   */
  Attachments.Views.Row = Backbone.LayoutManager.View.extend({

    template: 'budget/attachments/row',

    tagName: 'tr',

    events: {
      'click .delete': 'delete_att',
      'dblclick': 'download'
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
      data['updated'] = date.toLocaleDateString() + ' (' + date.toLocaleTimeString() +')';
      data['download'] = this.download_url();
      return data;
    },

    download_url: function () {
      return '/attachments/' + this.model.get('_id') + '/show';
    },

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
        action: 'Next',
        content: Attachments.Views.Form
      }));

      // render the modal
      modal.render();

      modal.content.budget_id = this.collection.budget_id;

      modal.bind('close', function () {
        delete that.views['.tmp'];
        modal.unbind();
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
    },

    /* Cleanup */
    onCleanup: function () {
      this.collection.unbind('reset', this.render);
      this.collection.unbind('remove', this.render);
    }

  });

  // Required, return the module for AMD compliance
  return Attachments;

});