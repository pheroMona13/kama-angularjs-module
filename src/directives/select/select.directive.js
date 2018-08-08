// *** FIX BUG LATER: child select calls getlist for the first time even when it's not required.
// *** FIX BUG LATER: second child binding does not get empty on parent change
// *** FIX BUG LATER: select2 default state shows unselect button.

kamaSelect.$inject = ['$q', 'alertService', 'toolsService'];
export default function kamaSelect($q, alertService, toolsService) {
    var directive = {
        link: link
        , template: `<select class="form-control kama-select" style="width: 100%"
                ng-options="item[obj.displayName] for item in obj.items"
                ng-model="selected"
                ng-change="change(true)"
                ng-disabled="obj.checkDisability && obj.checkDisability()">
            <option value="" selected="selected"></option>
        </select>

        <script>
            /*
                select2 bugs:
                    1. because angular ng-options create an empty option select2 selects
                       that empty option by default and unselect x shows up.
                    2. if depentent select didn't fill on init, when parent select a value
                       and child calls it's getlist method, nothing get selected.

                both issues have nothing to do with select2 directly.
                until these bugs get fixed use default html select.
            */
            if (true || /iP(od|hone)/i.test(window.navigator.userAgent) || /IEMobile/i.test(window.navigator.userAgent) || /Windows Phone/i.test(window.navigator.userAgent) || /BlackBerry/i.test(window.navigator.userAgent) || /BB10/i.test(window.navigator.userAgent) || /Android.*Mobile/i.test(window.navigator.userAgent)) {
                //console.log('Your browser does not support select2');
            } else {
                $('.kama-select').select2({
                    theme: "bootstrap",
                    allowClear: true,
                    dir: "rtl",
                    placeholder: "یک مورد را انتخاب کنید"
                });
            }
        </script>`
        , restrict: 'EA'
        , scope: {
            obj: '='
        }
    };

    return directive;

    function link(scope, element, attrs) {
        if (!scope.obj)
            return console.error('KAMA SELECT: obj is undefined.');

        scope.change = change;
        scope.obj.moduleType = 'select';
        scope.obj.displayName = scope.obj.displayName || ['Name'];
        scope.obj.uniqueId = scope.obj.uniqueId || 'ID';
        scope.obj.options = scope.obj.options || function () { return {} };
        scope.obj.update = update;
        scope.obj.getlist = getlist;
        scope.obj.loadingSelect2 = loadingSelect2;
        scope.obj.initSelect2 = initSelect2;
        scope.obj.setItems = setItems;

        if (Object.prototype.toString.call(scope.obj.items) === '[object Object]')
            scope.obj.items = toolsService.arrayEnum(scope.obj.items);
        if (scope.obj.initLoad)
            scope.obj.getlist();
        else if (scope.obj.items && scope.obj.items.length)
            addDisplayName(scope.obj.items);

        // get items from api, then call update()
        function getlist(callback) {
            let options = scope.obj.options();
            
            return scope.obj.listService(options).then(function (items) {
                addDisplayName(items);
                scope.obj.items = items;
                scope.obj.update();
            });
        }

        // set selected item based on bindingObject model, then call change()
        function update() {
            if (scope.obj.items && scope.obj.items.length > 0) {
                if (!scope.obj.items[0][scope.obj.displayName])
                    addDisplayName(scope.obj.items);

                for (let i = 0; i < scope.obj.items.length; i++) {
                    if (scope.obj.items[i][scope.obj.uniqueId] == scope.obj.bindingObject.model[scope.obj.parameters[scope.obj.uniqueId]]) {
                        scope.selected = scope.obj.items[i];
                        scope.change();
                        return;
                    }
                }

                scope.selected = {};
                setTimeout(function () { element.find('.kama-select').val([]).trigger('change'); }, 0);
                scope.change();
            }
        }

        // set values from selected item to bindingObject model based on parameters
        function change(fromView) {
            return $q.resolve().then(function () {
                for (let key in scope.obj.parameters) {
                    if (scope.selected)
                        scope.obj.bindingObject.model[scope.obj.parameters[key]] = scope.selected[key];
                    else
                        scope.obj.bindingObject.model[scope.obj.parameters[key]] = null;
                }
            }).then(function () {
                if (typeof (scope.obj.onChange) === 'function')
                    scope.obj.onChange(scope.selected, {
						isEmpty: !(scope.selected && Object.keys(scope.selected).length)
						, fromView: fromView
					});
            });
        }

        function addDisplayName(data) {
            if (scope.obj.displayName.length > 1) {
                for (let i = 0; i < data.length; i++) {
                    data[i][scope.obj.displayName] = '';

                    for (let j = 0; j < scope.obj.displayName.length; j++) {
                        if (data[i].hasOwnProperty(scope.obj.displayName[j])) {
                            data[i][scope.obj.displayName] += data[i][scope.obj.displayName[j]] + ' ';
                        }
                        else {
                            data[i][scope.obj.displayName] += scope.obj.displayName[j] + ' ';
                        }
                    }
                }
            }
        }
        function loadingSelect2() {
            element.find('.kama-select').select2({
                language: "fa"
                , theme: "bootstrap"
                , placeholder: "در حال دریافت اطلاعات ..."
            });
        }
        function initSelect2(opts) {
            let options = {
                language: "fa"
                , dir: "rtl"
                , theme: "bootstrap"
                , allowClear: true
                , placeholder: "یک مورد را انتخاب کنید"
            };

            if (opts && opts.modal)
                options.dropdownParent = $('#' + opts.modal);

            element.find('.kama-select').select2(options);
        }
        function setItems(items) {
			addDisplayName(items);
			scope.obj.items = items;
			scope.obj.update();
		}
    }
}