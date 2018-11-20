// *** FIX BUG LATER: child select calls getlist for the first time even when it's not required.
// *** FIX BUG LATER: second child binding does not get empty on parent change

kamaSelect.$inject = ["$q", "toolsService", "$timeout"];
export default function kamaSelect($q, toolsService, $timeout) {
  let directive = {
    link: link,
    template: require("./select.directive.html"),
    restrict: "E",
    scope: {
      obj: "="
    }
  };

  return directive;

  function link(scope, element, attrs) {
    if (!scope.obj) return console.error("KAMA SELECT: obj is undefined.");

    scope.change = change;
    scope.customDisplayName = "kamaCustomDisplayName";
    scope.obj.moduleType = "select";
    scope.obj.displayName = scope.obj.displayName || ["Name"];
    scope.obj.uniqueId = scope.obj.uniqueId || "ID";
    scope.obj.minimumInputLength = scope.obj.minimumInputLength || 3;
    scope.obj.options =
      scope.obj.options ||
      function() {
        return {};
      };
    scope.obj.update = update;
    scope.obj.getlist = getlist;
    scope.obj.loadingSelect2 = loadingSelect2;
    scope.obj.initSelect2 = initSelect2;
    scope.obj.setItems = setItems;

    if (scope.obj.lazy) {
      let lazySelect = $(element.find(".kama-lazyselect")[0]).select2({
        allowClear: true,
        dir: "rtl",
        placeholder: "یک مورد را انتخاب کنید",
        escapeMarkup: markup => {
          return markup;
        },
        templateResult: repo => {
          if (repo.loading) return repo.text;

          return `<div style="cursor: pointer">${
            repo[scope.customDisplayName]
          }</div>`;
        },
        templateSelection: repo => {
          return repo[scope.customDisplayName] || repo.text;
        },
        minimumInputLength: scope.obj.minimumInputLength,
        ajax: {
          transport: (params, success, failure) => {
            let searchModel = scope.obj.options();
            searchModel[scope.obj.searchBy] = params.data.term;
            return scope.obj
              .listService(searchModel)
              .then(result => {
                addDisplayName(result);
                return success(result);
              })
              .catch(failure);
          },
          processResults: data => {
            data.map(item => {
              item.id = item.ID;
            });
            return {
              results: data
            };
          }
        }
      });
      lazySelect.on("select2:select", e => {
        scope.selected = e.params.data;
        change(!e.params.fromCode);
      });
      lazySelect.on("select2:unselect", e => {
        scope.selected = {};
        change(true);
      });
      element.find(".kama-select").remove();
      update();
    } else {
      if (Object.prototype.toString.call(scope.obj.items) === "[object Object]")
        scope.obj.items = toolsService.arrayEnum(scope.obj.items);
      if (scope.obj.initLoad) scope.obj.getlist();
      else if (scope.obj.items && scope.obj.items.length)
        addDisplayName(scope.obj.items);
      if (scope.obj.select2) {
        $(element.find(".kama-select")[0]).select2({
          allowClear: true,
          dir: "rtl",
          placeholder: "یک مورد را انتخاب کنید"
        });
      }
      element.find(".kama-lazyselect").remove();
    }

    // get items from api, then call update()
    function getlist(callback) {
      if (scope.obj.select2) {
        setTimeout(() => {
          let select = element.find(".select2-selection__placeholder")[0];
          if (select) select.innerText = "در حال بارگذاری اطلاعات...";
        }, 0);
      }

      let options = scope.obj.options();
      return scope.obj.listService(options).then(items => {
        addDisplayName(items);
        scope.obj.items = items;
        scope.obj.update();
        if (scope.obj.select2) {
          setTimeout(() => {
            let select = element.find(".select2-selection__placeholder")[0];
            if (select) select.innerText = "یک مورد را انتخاب کنید";
          }, 0);
        }
      });
    }

    // set selected item based on bindingObject model, then call change()
    function update() {
      return $q.resolve().then(() => {
        if (scope.obj.lazy) {
          if (
            scope.obj.bindingObject.model[
              scope.obj.parameters[scope.obj.uniqueId]
            ]
          ) {
            setTimeout(() => {
              let select = element.find(".select2-selection__placeholder")[0];
              if (select) select.innerText = "در حال بارگذاری اطلاعات...";
            }, 0);
            let searchModel = {};
            searchModel[scope.obj.uniqueId] =
              scope.obj.bindingObject.model[
                scope.obj.parameters[scope.obj.uniqueId]
              ];
            return scope.obj.getService(searchModel).then(result => {
              addDisplayName([result]);
              let lazySelect = $(element.find(".kama-lazyselect")[0]);
              let option = new Option(
                result[scope.customDisplayName],
                result[scope.obj.uniqueId],
                true,
                true
              );

              lazySelect.append(option).trigger("change");
              lazySelect.trigger({
                type: "select2:select",
                params: {
                  data: result,
                  fromCode: true
                }
              });
              setTimeout(() => {
                let select = element.find(".select2-selection__placeholder")[0];
                if (select) select.innerText = "یک مورد را انتخاب کنید";
              }, 0);
            });
          } else {
            scope.selected = {};
            change();
          }
        } else if (scope.obj.items && scope.obj.items.length > 0) {
          if (!scope.obj.items[0][scope.obj.displayName])
            addDisplayName(scope.obj.items);

          for (let i = 0; i < scope.obj.items.length; i++) {
            if (
              scope.obj.items[i][scope.obj.uniqueId] ===
              scope.obj.bindingObject.model[
                scope.obj.parameters[scope.obj.uniqueId]
              ]
            ) {
              scope.selected = scope.obj.items[i];
              scope.change();
              return;
            }
          }

          scope.selected = {};
          setTimeout(() => {
            element
              .find(".kama-select")
              .val([])
              .trigger("change");
          }, 0);
          scope.change();
        }
      });
    }

    // set values from selected item to bindingObject model based on parameters
    function change(fromView) {
      return $q
        .resolve()
        .then(() => {
          for (let key in scope.obj.parameters) {
            if (scope.selected)
              scope.obj.bindingObject.model[scope.obj.parameters[key]] =
                scope.selected[key];
            else
              scope.obj.bindingObject.model[scope.obj.parameters[key]] = null;
          }
        })
        .then(() => {
          if (scope.obj.select2)
            $timeout(() => {
              element.find(".kama-select").trigger("change");
            }, 0);
          else if (
            scope.obj.lazy &&
            !scope.obj.bindingObject.model[
              scope.obj.parameters[scope.obj.uniqueId]
            ]
          )
            $timeout(() => {
              element
                .find(".kama-lazyselect")
                .val(null)
                .trigger("change");
            }, 0);
        })
        .then(() => {
          if (typeof scope.obj.onChange === "function")
            scope.obj.onChange(scope.selected, {
              isEmpty: !(scope.selected && Object.keys(scope.selected).length),
              fromView: fromView
            });
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
    function loadingSelect2() {
      element.find(".kama-select").select2({
        language: "fa",
        theme: "bootstrap",
        placeholder: "در حال دریافت اطلاعات ..."
      });
    }
    function initSelect2(opts) {
      let options = {
        language: "fa",
        dir: "rtl",
        theme: "bootstrap",
        allowClear: true,
        placeholder: "یک مورد را انتخاب کنید"
      };

      if (opts && opts.modal) options.dropdownParent = $(`#${opts.modal}`);

      element.find(".kama-select").select2(options);
    }
    function setItems(items) {
      addDisplayName(items);
      scope.obj.items = items;
      scope.obj.update();
    }
  }
}
