/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojmodule-element-utils', 'data',
  'ojs/ojcollapsible', 'ojs/ojinputnumber', 'ojs/ojbutton', 'ojs/ojcheckboxset', 'ojs/ojradioset', 'ojs/ojlabel',
  'ojs/ojswitch'],
        function (oj, ko, $, app, moduleUtils, data) {

          function DashboardViewModel() {
            var self = this;
            self.data = data;

            self.isChecked = ko.observable(false);
            self.isChecked.subscribe((val) => {
              console.log(val);
              self.setItems(val);
            });

            self.toggleSelectAll = () => {
              console.log('is checked ' + self.isChecked());
              self.setItems(self.isChecked());
            }

            self.highlighSelection = function () {
              var boxes = $('.oj-choice-item');
              boxes.each((key, value) => {
                // boxes[key].className = 'oj-choice-item oj-enabled' + (self.isChecked() ? ' oj-selected' : '');

              });
            };

            self.setItems = value => {
              if (value) {
                let types = {};
                for (var category in data.itemsOrdered()) {
                  types = data.extend(types, data.itemsOrdered()[category]);
                }

                for (var type in types) {
                  var arr = [];
                  var idx = 0;
                  for (var i in types[type]) {
                    arr[idx++] = types[type][i].id + '';
                  }
                  data.selectedItems[type](arr);
                }
              } else {
                for (var type in data.selectedItems) {
                  data.selectedItems[type]([]);
                }

              }
              //data.selection();
              self.highlighSelection();
            }



            // Header Config
            self.headerConfig = ko.observable({'view': [], 'viewModel': null});
            moduleUtils.createView({'viewPath': 'views/header.html'}).then(function (view) {
              self.headerConfig({'view': view, 'viewModel': new app.getHeaderModel()})
            })

            self.max = 99;
            self.min = 0;
            self.step = 1;
            self.materialValue = ko.observableArray([]);
            self.itemSelection = ko.observable({});

            self.items = data.itemsOrdered;



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

          $('.oj-inputnumber-input').on('change', function () {
            console.log(this);
          });

          /*
           * Returns a constructor for the ViewModel so that the ViewModel is constructed
           * each time the view is displayed.  Return an instance of the ViewModel if
           * only one instance of the ViewModel is needed.
           */
          return new DashboardViewModel();
        }
);
