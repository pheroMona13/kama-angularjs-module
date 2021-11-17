kamaCheckboxes.$inject = [];
export default function kamaCheckboxes() {
  let directive = {
    restrict: 'E',
    link: link,
    template: require('./checkboxes.directive.html'),
    scope: {
      list: '=list',
      selected: '=selected',
      uniqueId: '@?uniqueId',
      displayName: '@?displayName',
      display: '@?display', // column, tree and table
      columns: '=?columns', // [{ name: binding value name, title: display name }]
      process: '&?process', // function that accepts selected object and returns processed object
      search: '@?search',
      hideHeader: '=?hideHeader',
      hideSearch: '=?hideSearch',
      selectAll: '=?selectAll',
    },
  };

  return directive;

  function link(scope, element, attrs) {
    scope.uniqueId = scope.uniqueId || 'ID';
    scope.displayName = scope.displayName || 'Name';
    scope.display = scope.display || 'column';
    scope.searchObject = {};
    scope.process =
      scope.process ||
      function () {
        return (data) => {
          return data;
        };
      };
    scope.isSelected = isSelected;
    scope.updateSelection = updateSelection;
    scope.toggleAll = toggleAll;

    function isSelected(obj) {
      if (scope.selected)
        return scope.selected.some((item) => {
          return item[scope.uniqueId] === obj[scope.uniqueId];
        });
      else return false;
    }
    function updateSelection($event, selected) {
      let action = $event.target.checked ? 'add' : 'remove';
      scope.selected = scope.selected || [];

      if (
        action === 'add' &&
        !scope.selected.some((item) => {
          return item[scope.uniqueId] === selected[scope.uniqueId];
        })
      ) {
        if (scope.display === 'tree') {
          let { children, ...selectedObject } = selected;
          scope.selected.push(scope.process()(selectedObject));
        } else scope.selected.push(scope.process()(selected));
      } else if (action === 'remove') {
        let selectedIndex = scope.selected.findIndex((item) => {
          return item[scope.uniqueId] === selected[scope.uniqueId];
        });
        if (selectedIndex !== -1) scope.selected.splice(selectedIndex, 1);
      }
    }
    function toggleAll($event) {
      $event.target.checked
        ? (scope.selected =
            scope.display === 'tree'
              ? [...flatten(scope.list)]
              : [...scope.list])
        : (scope.selected.length = 0);

      function flatten(items) {
        const flat = [];

        items.forEach((item) => {
          const { children, ...itemWithoutChildren } = item;

          flat.push(itemWithoutChildren);
          if (item.children && item.children.length) {
            flat.push(...flatten(item.children));
          }
        });

        return flat;
      }
    }
  }
}
