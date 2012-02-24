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
   * New Attachment Form
   *    form and logic for uploading attachments
   */
  Attachments.Views.Form = Backbone.LayoutManager.View.extend({

    template: 'budget/attachments/form'

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
    }

  });

  // Required, return the module for AMD compliance
  return Attachments;

});