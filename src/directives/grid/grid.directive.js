kamaGrid.$inject = [
  "alertService",
  "loadingService",
  "toolsService",
  "$filter"
];
export default function kamaGrid(
  alertService,
  loadingService,
  toolsService,
  $filter
) {
  let directive = {
    link: link,
    template: require("./grid.directive.html"),
    restrict: "E",
    scope: {
      obj: "="
    }
  };

  return directive;

  function link(scope, element, attrs) {
    if (!scope.obj) return console.error("KAMA GRID: obj is undefined.");
    if (scope.obj.columns && scope.obj.columns.constructor !== Array)
      return console.error("KAMA GRID: columns should be an array of objects.");

    scope.obj.moduleType = "grid";
    scope.obj.actions = scope.obj.actions || [
      {
        title: "ویرایش",
        class: "fa fa-pencil grid-action-blue",
        onclick: edit,
        name: "edit"
      },
      {
        title: "حذف",
        class: "fa fa-close grid-action-red",
        onclick: remove,
        name: "remove"
      }
    ];
    scope.obj.pageSize = scope.obj.pageSize || 5;
    scope.obj.pageIndex = scope.obj.pageIndex || 1;
    scope.obj.pageSizeRange = scope.obj.pageSizeRange || [5, 10, 20, 50, 100];
    scope.obj.hideHeader = scope.obj.hideHeader || false;
    scope.obj.hideFooter = scope.obj.hideFooter || false;
    scope.obj.displayNameFormat = scope.obj.displayNameFormat || [];
    scope.obj.rowClass = scope.obj.rowClass || function () { return '' };
    scope.obj.add = add;
    scope.obj.edit = edit;
    scope.obj.remove = remove;
    scope.obj.confirmRemove = confirmRemove;
    scope.obj.getlist = getlist;
    scope.obj.update = update;
    scope.obj.readOnly =
      scope.obj.readOnly ||
      function() {
        return false;
      };
    scope.obj.options =
      scope.obj.options ||
      function() {
        return {};
      }; // should be a function that returns an object
    scope.obj.listService; // should be a promise object
    scope.obj.deleteService; // should be a promise object
    scope.displayName = "";
    scope.deleteBuffer = {};
    scope.obj.previousPage = previousPage;
    scope.obj.nextPage = nextPage;
    scope.obj.pageSizeChange = pageSizeChange;
    scope.cellValue = cellValue;

    Object.defineProperty(scope.obj, "total", {
      get: () => {
        if (scope.obj.items && scope.obj.items.length > 0)
          return scope.obj.items[0].Total;
        else return 0;
      }
    });
    Object.defineProperty(scope.obj, "result", {
      set: result => {
        if (result.Success) {
          scope.obj.items = result.Data;
          scope.obj.pageCount = Array.apply(null, {
            length: result.PageCount + 1
          }).map(Number.call, Number);
          scope.obj.pageCount.shift();
        }
      }
    });

    if (scope.obj.initLoad) {
      loadingService.show();
      scope.obj.getlist();
    } else scope.obj.pageCount = [1];

    // rename to 'refresh' or 'update' after migration to new system completed
    function getlist(loading) {
      if (loading === false) return getItems();
      else {
        loadingService.show();
        return getItems()
          .then(loadingService.hide)
          .catch(error => {
            loadingService.hide();
            alertService.error(error);
          });
      }
    }
    function previousPage() {
      if (scope.obj.pageIndex > 1) {
        scope.obj.pageIndex--;
        scope.obj.getlist();
      }
    }
    function nextPage() {
      if (
        scope.obj.pageCount &&
        scope.obj.pageIndex < scope.obj.pageCount.length
      ) {
        scope.obj.pageIndex++;
        scope.obj.getlist();
      }
    }
    function pageSizeChange() {
      if (scope.obj.items.length) {
        scope.obj.pageIndex = 1;
        scope.obj.getlist();
      }
    }
    function add() {
      if (!scope.obj.preventDefaultAdd) {
        scope.obj.bindingObject.state = "add";
        scope.obj.bindingObject.model = {};
        scope.obj.bindingObject.update();
      }

      if (scope.obj.onAdd) scope.obj.onAdd();
      if (scope.obj.modal) openModal();
    }
    function edit(item) {
      if (!scope.obj.preventDefaultEdit) {
        scope.obj.bindingObject.state = "edit";
        scope.obj.bindingObject.model = angular.copy(item);
        scope.obj.bindingObject.update();
      }

      if (scope.obj.onEdit) scope.obj.onEdit(item);
      if (scope.obj.modal) openModal();
    }
    function remove(item) {
      scope.deleteBuffer = item;
      scope.displayName = "";
      for (let i = 0; i < scope.obj.displayNameFormat.length; i++) {
        scope.displayName +=
          scope.deleteBuffer[scope.obj.displayNameFormat[i]] + " ";
      }

      element.find(".grid-delete-confirmation-modal").modal("show");
    }
    function confirmRemove() {
      loadingService.show();
      scope.obj
        .deleteService(scope.deleteBuffer)
        .then(result => {
          if (
            (scope.obj.pageIndex - 1) * scope.obj.pageSize + 1 ===
            scope.obj.total
          )
            scope.obj.pageIndex--;

          return getItems();
        })
        .then(() => {
          if (scope.obj.onDelete) return scope.obj.onDelete();
        })
        .then(() => {
          loadingService.hide();
          alertService.success("حذف با موفقیت انجام شد");
        })
        .catch(error => {
          loadingService.hide();
          alertService.error(error);
        });
    }
    function update() {
      if (scope.obj.bindingObject.state === "add") {
        scope.obj.pageIndex =
          scope.obj.items.length > 0
            ? Math.floor(scope.obj.total / scope.obj.pageSize) + 1
            : 1;
        if (!scope.obj.pageCount[scope.obj.pageIndex - 1])
          scope.obj.pageCount[scope.obj.pageCount.length] = scope.obj.pageIndex;
      }

      if (scope.obj.model && scope.obj.initLoad) scope.obj.getlist();
      else scope.obj.items.push(angular.copy(scope.obj.bindingObject.model));

      scope.obj.bindingObject.state = "view";
      scope.obj.bindingObject.model = {};

      if (scope.obj.modal) $(`#${scope.obj.modal}`).modal("hide");
    }
    function getItems() {
      let options = scope.obj.options();
      options.PageSize = scope.obj.pageSize;
      options.PageIndex = scope.obj.pageIndex;

      return scope.obj.listService(options).then(items => {
        let pageCount = 1;
        if (items.length && items[0].Total)
          pageCount = Math.ceil(items[0].Total / scope.obj.pageSize);

        scope.obj.pageCount = Array.apply(null, { length: pageCount + 1 }).map(
          Number.call,
          Number
        );
        scope.obj.pageCount.shift();
        return (scope.obj.items = items);
      });
    }
    function cellValue(item, column) {
      let process =
        column.callback ||
        function(item) {
          return item;
        };
      switch (column.type) {
        case "date":
          return process(toolsService.dateToJalali(item[column.name]));

        case "enum":
          return process(column.source[item[column.name]]);

        case "money":
          return process($filter("number")(item[column.name]));

        case "time":
          if (
            Object.prototype.toString.call(item[column.name]) ===
            "[object Date]"
          )
            return process(
              item[column.name].toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              })
            );
          else return process(toolsService.minutesToTime(item[column.name]));

        default:
          return process(item[column.name]);
      }
    }
    function openModal() {
      $(`#${scope.obj.modal}`).modal("show");
      $(`#${scope.obj.modal}`).on("shown.bs.modal", () => {
        $(`#${scope.obj.modal} .modal-body`).animate({ scrollTop: 0 }, "fast");
      });
    }
  }
}
