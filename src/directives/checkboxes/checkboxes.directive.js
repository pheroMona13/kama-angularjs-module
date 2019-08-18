kamaCheckboxes.$inject = [];
export default function kamaCheckboxes() {
  let directive = {
    restrict: "E",
    link: link,
    template: require("./checkboxes.directive.html"),
    scope: {
      list: "=list",
      selected: "=selected",
      uniqueId: "@?uniqueId",
      displayName: "@?displayName",
      display: "@?display", // column, tree and table
      columns: "=?columns", // [{ name: binding value name, title: display name }]
      process: "&?process", // function that accepts selected object and returns processed object
      search: "@?search",
      hideHeader: "=?hideHeader",
      hideSelectAll: "=?hideSelectAll",
      hideSearch: "=?hideSearch"
    }
  };

  return directive;

  function link(scope, element, attrs) {
    debugger;
    scope.uniqueId = scope.uniqueId || "ID";
    scope.displayName = scope.displayName || "Name";
    scope.display = scope.display || "column";
    scope.searchObject = {};
    scope.process =
      scope.process ||
      function() {
        return data => {
          return data;
        };
      };
    scope.isSelected = isSelected;
    scope.updateSelection = updateSelection;
    scope.selectAllFiltered = selectAllFiltered;

    function isSelected(obj) {
      if (scope.selected)
        return scope.selected.some(item => {
          return item[scope.uniqueId] === obj[scope.uniqueId];
        });
      else return false;
    }
    function updateSelection($event, selected) {
      let action = $event.target.checked ? "add" : "remove";
      scope.selected = scope.selected || [];

      if (
        action === "add" &&
        !scope.selected.some(item => {
          return item[scope.uniqueId] === selected[scope.uniqueId];
        })
      ) {
        if (scope.display === "tree") {
          let { children, ...selectedObject } = selected;
          scope.selected.push(scope.process()(selectedObject));
        } else scope.selected.push(scope.process()(selected));
      } else if (action === "remove") {
        let selectedIndex = scope.selected.findIndex(item => {
          return item[scope.uniqueId] === selected[scope.uniqueId];
        });
        if (selectedIndex !== -1) scope.selected.splice(selectedIndex, 1);
      }
    }
    function selectAllFiltered(filteredList) {
      if (filteredList && filteredList.length) {
        scope.selected = scope.selected || [];

        filteredList.map(filteredItem => {
          const index = scope.list.findIndex(item => {
            return item[scope.uniqueId] === filteredItem[scope.uniqueId];
          });
          if (
            scope.selected.findIndex(selectedItem => {
              return (
                scope.list[index][scope.uniqueId] ===
                selectedItem[scope.uniqueId]
              );
            }) === -1
          )
            scope.selected.push(scope.list[index]);
        });
      }
    }
  }
}
