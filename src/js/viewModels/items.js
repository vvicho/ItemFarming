/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojmodule-element-utils', 'data', 'ojs/ojarraydataprovider',
  'ojs/ojbutton', 'ojs/ojinputtext', 'ojs/ojselectcombobox', 'ojs/ojinputnumber'],
        function (oj, ko, $, app, moduleUtils, data, ArrayDataProvider) {

          function ItemsModel() {
            var self = this;
            self.data = data;

            self.max = 10;
            self.min = 1;
            self.step = 1;
            self.materialValue = ko.observable(1);
            self.searchTerm = ko.observable('');

            // Header Config
            self.val = ko.observable('Weapons');
            self.weaponVal = ko.observable('Sora');
            self.armorVal = ko.observable('Armor');
            self.accVal = ko.observable('Accessories');
            self.currMaterial = ko.observableArray([]);
            self.itemType = ko.observable({
              'Weapons': ['Sora', 'Donald', 'Goofy'],
              'Armor': ['Armor'],
              'Accessories': ['Accessories'],
              'Items': ['Items'],
              'Materials': ['Materials']
            });

            self.search = function (event) {
              var trigger = event.type;
              var term;

              if (trigger === "ojValueUpdated") {
                // search triggered from input field
                // getting the search term from the ojValueUpdated event
                term = event['detail']['value'];
                trigger += " event";
              } else {
                // search triggered from end slot
                // getting the value from the element to use as the search term.
                term = document.getElementById("search").value;
                trigger = "click on search button";
              }

              self.searchTerm(term);
            };

            self.materials = data.materials; //data.materials;

            self.selectValOpt = ko.observable({id: "", name: ""});
            self.materialsDP = new ArrayDataProvider(self.materials, {keyAttributes: 'id'});
            ;

            self.items = data.items;

            self.headerConfig = ko.observable({'view': [], 'viewModel': null});
            moduleUtils.createView({'viewPath': 'views/header.html'}).then(function (view) {
              self.headerConfig({'view': view, 'viewModel': new app.getHeaderModel()});
            });

            self.importData = function () {
              data.initialLoad(data.items, data.itemSize, 'items.json', self.items);
            };

            self.exportData = () => {
              data.exportData(data.items(), 'items');
            };

            self.enterKey = () => {
              self.add();
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
              let item = {};
              let name = self.textVal();
              let category = self.val();
              let type;
              switch (category) {
                case "Weapons":
                  type = self.weaponVal();
                  break;
                case "Armor" :
                  type = self.armorVal();
                  break;
                case "Accessories" :
                  type = self.accVal();
                  break;
              }

              item.name = name;
              item.category = category;
              item.type = type;
              item.materials = self.currMaterial();

              console.log(item);

              if (name === null || name === undefined || name === '')
                return;
              let wasAdded = data.add.item(item);
              if (wasAdded) {
                self.textVal('');
//                self.val('');
//                self.weaponVal('');
                self.materialValue(1);

                self.currMaterial([]);
              } else
                console.log(name + ' already exists');
              $('#itemTxt').focus();
              return true;
            };

            self.addMaterial = () => {
              let mat = {};
              if (self.searchTerm() === '')
                return;

              mat.id = self.searchTerm();
              mat.qty = self.materialValue();

              if (!self.verifyMaterial(mat)) {
                console.log('material already added')
                self.clearSearch();
                return;
              }

              self.clearSearch();
              self.searchTerm('');
              self.materialValue(1);


              let aux = self.currMaterial();
              aux.push(mat);
              self.currMaterial(aux);
              $('#search').focus();
              console.log(self.currMaterial());

            };

            self.verifyMaterial = (mat) => {
              let  materials = self.currMaterial();
              for (let i in materials) {
                let material = materials[i];
                if (material.id === mat.id)
                  return false;
              }
              return true;
            };

            self.remove = (id) => {
              if (self.items()[id] === undefined)
                return;
              data.remove.item(id);
              self.items.valueHasMutated();
            };

            self.clearSearch = () => {
              document.getElementById("search").value = '';
            };

            self.removeMaterial = (material) => {
              self.currMaterial(data.removeElement(self.currMaterial(), material));
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
          return new ItemsModel();
        }
);
