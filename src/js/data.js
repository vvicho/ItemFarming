define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils',
  'ojs/ojknockout',
  'ojs/ojmodule-element',
  'ojs/ojrouter',
  'ojs/ojarraytabledatasource',
  'ojs/ojoffcanvas',
  'ojs/ojbutton',
  'ojs/ojmasonrylayout',
  'ojs/ojswitch'],
        function (oj, ko, moduleUtils) {
          function Data() {
            var self = this;
            self.materials = ko.observableArray([]);
            self.materialSize = ko.observable(0);
            self.materialsNeeded = ko.observable({});
            self.materialNodes = ko.observable();

//            self.materialNodes.subscribe((newVal) => {
//              for (let i in newVal) {
//                let tag = newVal[i];
//                tag.bind("DOMSubtreeModified", function () {
//                  alert('changed');
//                });
//              }
//            });

            self.selectionSet = new Set([]);

            self.items = ko.observableArray([]);
            self.itemSize = ko.observable(0);
            self.itemsOrdered = ko.observable();
            self.selectedItems = {};

            self.itemsOrdered.subscribe((newVal) => {
              let out = {};
              let catKeys = Object.keys(newVal);
              for (let i = 0; i < catKeys.length; i++) {
                let category = catKeys[i];
                let typeKeys = Object.keys(newVal[category]);
                for (let j = 0; j < typeKeys.length; j++) {
                  let type = typeKeys[j];
                  if (out[type] === undefined) {
                    out[type] = ko.observableArray([]);
                    out[type].subscribe(() => {
                      self.selection();
                    });
                  }
                }
              }
              self.selectedItems = out;
              console.log(out);
            });

            self.currentMaterials = ko.observableArray([]);

            self.materials.subscribe((newVal) => {
              let arr = [];
              for (let i in Object.keys(newVal)) {
                let material = newVal[i];
                arr[material.id] = 0;
              }
              console.log(arr);

              self.currentMaterials(arr);
            });

//            window.setTimeout(self.calcAllDiff(), 500);

            self.calcDiff = function (id) {
              let dif = self.materialsNeeded()[id] - self.currentMaterials()[id];
              if (dif > 0)
                return dif;
              else
                return 0;
            };

            self.items.subscribe((newVal) => {
              let items = {};
              for (let i = 0; i < newVal.length; i++) {
                let item = newVal[i];
                if (items[item.category] === undefined) {
                  items[item.category] = {};
                }
                if (items[item.category][item.type] === undefined) {
                  items[item.category][item.type] = [];
                }
                items[item.category][item.type].push(item);
              }

              self.itemsOrdered(items);
              return items;
            });

            self.itemsNeeded = ko.observable();

            self.selection = () => {
              let keys = Object.values(self.selectedItems);
              self.selectionSet = new Set([]);
              for (let i = 0; i < keys.length; i++) {
                let arr = keys[i]();
                for (let n in arr) {
                  self.selectionSet.add(arr[n]);
                }
              }

              self.calculateMaterials(Array.from(self.selectionSet));

            };

            self.calculateMaterials = (items) => {
              let totalMaterials = {};
              for (let i in items) {
                let item = items[i];
                let materials = self.items()[item].materials;
                for (let j in materials) {
                  let material = materials[j];
                  if (totalMaterials[material.id] == undefined) {
                    totalMaterials[material.id] = 0;
                  }
                  totalMaterials[material.id] += material.qty;
                }
              }
              self.materialsNeeded(totalMaterials);
            };

            self.enemies = ko.observableArray([]);
            self.enemySize = ko.observable(0);

            self.locations = ko.observableArray([]);
            self.locationSize = ko.observable(0);



            self.initialLoad = function (obj, objSize, file, observable) {
              $.getJSON('/resources/' + file, (data) => {

              }).done((data) => {
                obj(data);
                objSize(Object.keys(obj()).length);

              }).
                      fail((err) => console.log(err));
//                      always(() => console.log(obj()));
              ;
            };

            self.exportData = (data, txtFile) => {
              var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
              var downloadAnchorNode = document.createElement('a');
              downloadAnchorNode.setAttribute("href", dataStr);
              downloadAnchorNode.setAttribute("download", txtFile + ".json");
              document.body.appendChild(downloadAnchorNode); // required for firefox
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            };

            self.initialLoad(self.materials, self.materialSize, 'materials.json', null);
            self.initialLoad(self.locations, self.locationSize, 'locations.json', null);
            self.initialLoad(self.items, self.itemSize, 'items.json', null);

            self.add = {
              material: (mat) => {
                let out = self.verifyExisting(self.materials, self.materialSize, mat);
                if (out)
                  self.materialSize(self.materialSize() + 1);
                console.log(self.materials());
                return out;
              },
              location: (loc) => {
                let out = self.verifyExisting(self.locations, self.locationSize, loc);
                if (out)
                  self.locationSize(self.locationSize() + 1);
                console.log(self.locations());
                return out;
              },
              item: (item) => {
                let out = self.verifyExisting(self.items, self.itemSize, item);
                if (out)
                  self.itemSize(self.itemSize() + 1);
                console.log(self.items());
                return out;
              },
              enemy: (enemy) => {
                let out = self.verifyExisting(self.enemies, self.enemySize, enemy);
                if (out)
                  self.enemySize(self.enemySize() + 1);
                console.log(self.enemies());
                return out;
              }

            };


            self.remove = {
              material: (mat) => self.materials(self.removeElement(self.materials(), mat)),
              location: (loc) => self.locations(self.removeElement(self.locations(), loc)),
              item: (item) => self.items(self.removeElement(self.items(), item)),
              enemy: (enemy) => self.enemies(self.removeElement(self.enemies(), enemy))
            };

            self.verifyExisting = (obj, objSize, item) => {
              let objects = obj();
              for (let i in objects) {
                let object = objects[i];
                if (Object.values(object).includes(item.name)) {
                  return false;
                }
              }
              item.id = objSize();
//              item.value = objSize();
              objects.push(item);
              obj(objects);
              return true;
            };

            self.removeElement = function (array, element) {
              return array.filter(e => e !== element);
            };


          }





          return new Data();
        }
);

