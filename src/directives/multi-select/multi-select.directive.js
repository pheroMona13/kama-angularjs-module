kamaMultiSelect.$inject = ["$timeout"];
export default function kamaMultiSelect($timeout) {
  let directive = {
    link: link,
    template: require("./multi-select.directive.html"),
    restrict: "E",
    scope: {
      obj: "="
    }
  };

  return directive;

  function link(scope, element, attrs) {
    if (!scope.obj) return console.error("KAMA SELECT: obj is undefined.");

    scope.selected = [];
    scope.change = change;
    scope.customDisplayName = "kamaCustomDisplayName";
    scope.obj.moduleType = "multi-select";
    scope.obj.displayName = scope.obj.displayName || ["Name"];
    scope.obj.uniqueId = scope.obj.uniqueId || "ID";
    scope.obj.options =
      scope.obj.options ||
      function() {
        return {};
      };
    scope.obj.update = update;
    scope.obj.getlist = getlist;
    scope.obj.setItems = setItems;

    let selectElement = $(element.find("select")[0]).select2({
      multiple: true,
      dir: "rtl",
      placeholder: "یک یا چند مورد را انتخاب کنید",
      closeOnSelect: false
    });
    if (scope.obj.items && scope.obj.items.length)
      addDisplayName(scope.obj.items);
    if (scope.obj.initLoad) scope.obj.getlist();
    else scope.obj.update();

    // get items from api, then call update()
    function getlist(callback) {
      let options = scope.obj.options();
      return scope.obj.listService(options).then(items => {
        addDisplayName(items);
        scope.obj.items = items;
        scope.obj.update();
      });
    }
    function addDisplayName(data) {
      if (typeof scope.obj.displayName === "function") {
        for (let i = 0; i < data.length; i++) {
          data[i][scope.customDisplayName] = scope.obj.displayName(data[i]);
        }
      } else if (scope.obj.displayName.length === 1) {
        scope.customDisplayName = scope.obj.displayName[0];
      } else if (scope.obj.displayName.length > 1) {
        for (let i = 0; i < data.length; i++) {
          data[i][scope.customDisplayName] = "";

          for (let j = 0; j < scope.obj.displayName.length; j++) {
            if (data[i].hasOwnProperty(scope.obj.displayName[j])) {
              data[i][scope.customDisplayName] +=
                data[i][scope.obj.displayName[j]] + " ";
            } else {
              data[i][scope.customDisplayName] +=
                scope.obj.displayName[j] + " ";
            }
          }
        }
      }
    }
    function change(fromView) {
      scope.obj.bindingObject.model[scope.obj.model] = scope.selected;
      if (typeof scope.obj.onChange === "function")
        scope.obj.onChange(scope.selected, {
          isEmpty: !(scope.selected && scope.selected.length),
          fromView: fromView
        });
    }
    function update() {
      let selectedValues = [];

      if (
        scope.obj.items &&
        scope.obj.items.length &&
        scope.obj.bindingObject.model[scope.obj.model] &&
        scope.obj.bindingObject.model[scope.obj.model].length
      ) {
        for (let i = 0; i < scope.obj.items.length; i++) {
          const item = scope.obj.items[i];

          for (
            let j = 0;
            j < scope.obj.bindingObject.model[scope.obj.model].length;
            j++
          ) {
            const value = scope.obj.bindingObject.model[scope.obj.model][j];

            if (item[scope.obj.uniqueId] === value[scope.obj.uniqueId])
              selectedValues.push(item);
          }
        }
      }

      scope.selected = selectedValues;
      scope.obj.bindingObject.model[scope.obj.model] = selectedValues;

      $timeout(() => {
        selectElement
          .val(
            selectedValues.map(val => {
              return val[scope.obj.uniqueId];
            })
          )
          .trigger("change");
      });
    }
    function setItems(items) {
      addDisplayName(items);
      scope.obj.items = items;
      scope.obj.update();
    }
  }
}
