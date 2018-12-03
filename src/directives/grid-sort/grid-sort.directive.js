kamaGridSort.$inject = ["toolsService"];
export default function kamaGridSort(toolsService) {
  let directive = {
    link: link,
    template: require("./grid-sort.directive.html"),
    restrict: "E",
    scope: {
      obj: "=",
      columns: "=columns",
      sortBy: "@?sortBy"
    }
  };

  return directive;

  function link(scope, element, attrs) {
    if (!scope.obj) return console.error("KAMA GRID SORT: obj is undefined.");
    if (!scope.columns)
      return console.error("KAMA GRID SORT: columns is undefined.");

    scope.sortBy = scope.sortBy || "SortExp";
    scope.process = process;
    scope.changeOrder = changeOrder;

    scope.columns.map(column => {
      column.id = toolsService.randomString(10);
    });

    function changeOrder(item, state) {
      debugger;
      switch (state) {
        case "up":
          for (let i = 0; i < scope.obj.model[scope.sortBy].length; i++) {
            if (i !== 0 && item.id === scope.obj.model[scope.sortBy][i].id) {
              let temp = scope.obj.model[scope.sortBy][i];
              scope.obj.model[scope.sortBy][i] = scope.obj.model[scope.sortBy][i - 1];
              scope.obj.model[scope.sortBy][i - 1] = temp;
              break;
            }
          }
          break;
        case "down":
          for (let i = 0; i < scope.obj.model[scope.sortBy].length; i++) {
            if (
              item.id === scope.obj.model[scope.sortBy][i].id &&
              i !== scope.obj.model[scope.sortBy].length
            ) {
              let temp = scope.obj.model[scope.sortBy][i];
              scope.obj.model[scope.sortBy][i] = scope.obj.model[scope.sortBy][i + 1];
              scope.obj.model[scope.sortBy][i + 1] = temp;
              break;
            }
          }
          break;
      }
    }
    function process(data = {}) {
      return {
        id: data.id,
        ColumnName: data.name,
        displayName: data.displayName,
        SortOrder: "ASC"
      };
    }
  }
}
