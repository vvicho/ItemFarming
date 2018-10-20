/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojmodule-element-utils', 'data',
  'ojs/ojbutton', 'ojs/ojinputtext'],
        function (oj, ko, $, app, moduleUtils, data) {

          function AboutViewModel() {
            var self = this;
            self.data = data;

            // Header Config

            self.materials = data.materials;

            self.headerConfig = ko.observable({'view': [], 'viewModel': null});
            moduleUtils.createView({'viewPath': 'views/header.html'}).then(function (view) {
              self.headerConfig({'view': view, 'viewModel': new app.getHeaderModel()});
            });

            self.importData = function () {
              data.initialLoad(data.materials, data.materialSize, 'materials.json', self.materials);
            };

            self.exportData = () => {
              let matArray = [];
              console.log(data.materials());
              for (let i in data.materials()) {
                let material = data.materials()[i];
                let mat = {};
                mat.id = material.id;
                mat.value = material.id;
                mat.name = material.name;
                mat.label = material.name;
                matArray.push(mat);
              }
              data.exportData(matArray, 'materials');
            };

//            $(document).keyup(function (event) {
//              var keycode = event.keyCode;
//              console.log(keycode);
//              if (keycode == '13') {
//                self.add();
//              }
//            });

            self.textVal = ko.observable('');

            self.add = function (event) {
              var name = self.textVal();
              if (name === null || name === undefined || name === '')
                return;
              var wasAdded = data.add.material({"name": name});
              if (wasAdded) {
                self.textVal('');
              } else
                console.log(name + ' already exists');
              $('#locationTxt').focus();
              return true;
            };

            self.remove = (mat) => {
              data.remove.material(mat);
            };

            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information.

            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * This method might be called multiple times - after the View is created
             * and inserted into the DOM and after the View is reconnected
             * after being disconnected.
             */
            self.connected = function () {
              // Implement if needed
            };

            /**
             * Optional ViewModel method invoked after the View is disconnected from the DOM.
             */
            self.disconnected = function () {
              // Implement if needed
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
            self.transitionCompleted = function () {
              // Implement if needed
            };
          }

          /*
           * Returns a constructor for the ViewModel so that the ViewModel is constructed
           * each time the view is displayed.  Return an instance of the ViewModel if
           * only one instance of the ViewModel is needed.
           */
          return new AboutViewModel();
        }
);
