define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojrouter', 'ojs/ojarraytabledatasource', 'ojs/ojoffcanvas', 'ojs/ojbutton'],
        function (oj, ko, moduleUtils) {
          function Data() {
            var self = this;
            self.materials = ko.observableArray([]);
            self.materialSize = ko.observable(0);

            self.items = ko.observableArray([]);
            self.itemSize = ko.observable(0);

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
                      fail((err) => console.log(err)).
                      always(() => console.log(obj()));
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

