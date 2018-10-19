/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore'],
  function(oj) {
    function ControllerViewModel() {
      var self = this;

      self.deleteCallback = function() {
        // Delete toolbar button callback
      }

      self.copyCallback = function() {
        // Copy toolbar button callback
      }

      self.editCallback = function() {
        // Edit toolbar button callback
      }

      self.downloadCallback = function() {
        // Download toolbar button callback
      }

      self.shareCallback = function() {
        // Share toolbar button callback
      }

      // Toolbar setup
      self.toolbarButtonDataSource = [
        {'id': 'delete', 'label': 'Delete', 'iconClasses': 'demo-icon-font demo-garbage-icon-24',
        'clickCallback': self.deleteCallback.bind(this)},
        {'id': 'copy','label': 'Copy', 'iconClasses': 'demo-icon-font demo-copy-icon-24', 
        'clickCallback': self.copyCallback.bind(this)},
        {'id': 'edit','label': 'Edit', 'iconClasses': 'demo-icon-font demo-edit-icon-24', 
        'clickCallback': self.editCallback.bind(this)},
        {'id': 'download','label': 'Download', 'iconClasses': 'demo-icon-font demo-download-icon-24', 
        'clickCallback': self.downloadCallback.bind(this)},
        {'id': 'share','label': 'Share', 'iconClasses': 'demo-icon-font demo-share-icon-16', 
        'clickCallback': self.shareCallback.bind(this)}
      ];

      // Method for adjusting the content area top/bottom paddings to avoid overlap with any fixed regions. 
      // This method should be called whenever your fixed region height may change.  The application
      // can also adjust content paddings with css classes if the fixed region height is not changing between 
      // views.
      self.adjustContentPadding = function () {
        var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
        var contentElem = document.getElementsByClassName('oj-applayout-content')[0];
        var bottomElem = document.getElementsByClassName('oj-applayout-fixed-bottom')[0];

        if (topElem) {
          contentElem.style.paddingTop = topElem.offsetHeight+'px';
        }
        if (bottomElem) {
          contentElem.style.paddingBottom = bottomElem.offsetHeight+'px';
        }
        // Add oj-complete marker class to signal that the content area can be unhidden.
        // See the override.css file to see when the content area is hidden.
        contentElem.classList.add('oj-complete');
      }
    }

    return new ControllerViewModel();
  }
);
