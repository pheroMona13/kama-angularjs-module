// *** FIX BUG LATER: child select calls getlist for the first time even when it's not required.
// *** FIX BUG LATER: second child binding does not get empty on parent change
// *** FIX BUG LATER: select2 default state shows unselect button.

kamaSelect.$inject = ['$q', 'toolsService', '$timeout'];
export default function kamaSelect($q, toolsService, $timeout) {
    var directive = {
        link: link
        , template: `
        <select class="form-control kama-select" style="width: 100%"
                ng-options="item[obj.displayName] for item in obj.items"
                ng-model="selected"
                ng-change="change(true)"
                ng-disabled="obj.checkDisability && obj.checkDisability()">
            <option value="" selected="selected"></option>
        </select>

        <select class="form-control kama-lazyselect"></select>

        <script>
            /*
                select2 bugs:
                    1. because angular ng-options create an empty option select2 selects
                       that empty option by default and unselect x shows up.
                    2. if depentent select didn't fill on init, when parent select a value
                       and child calls it's getlist method, nothing get selected.

                both issues have nothing to do with select2 directly.
                until these bugs get fixed use default html select.
            
            if (true || /iP(od|hone)/i.test(window.navigator.userAgent) || /IEMobile/i.test(window.navigator.userAgent) || /Windows Phone/i.test(window.navigator.userAgent) || /BlackBerry/i.test(window.navigator.userAgent) || /BB10/i.test(window.navigator.userAgent) || /Android.*Mobile/i.test(window.navigator.userAgent)) {
                //console.log('Your browser does not support select2');
            } else {
                $('.kama-select').select2({
                    theme: "bootstrap",
                    allowClear: true,
                    dir: "rtl",
                    placeholder: "یک مورد را انتخاب کنید"
                });
            }*/
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
        
        if (scope.obj.lazy) {
            let lazySelect = $(element.find('.kama-lazyselect')[0]).select2({
                allowClear: true
                , dir: 'rtl'
                , placeholder: 'یک مورد را انتخاب کنید'
                , escapeMarkup: function (markup) { return markup; }
                , templateResult: function(repo) {
                    if (repo.loading)
                        return repo.text;
                        
                    return '<div style="cursor: pointer">' + repo[scope.obj.displayName] + '</div>';
                }
                , templateSelection: function(repo) {
                    return repo[scope.obj.displayName] || repo.text;
                }
                , minimumInputLength: 4
                , ajax: {
                    transport: function (params, success, failure) {
                        var searchModel = {};
                        searchModel[scope.obj.searchBy] = params.data.term;
                        return scope.obj.listService(searchModel).then(function (result) {
                            addDisplayName(result);
                            return success(result);
                        }).catch(function (error) {
                            failure(error);
                        });
                    }
                    , processResults: function (data) {
                        data.map(function(i) { i.id = i.ID });
                        return {
                            results: data
                        };
                    }
                }
            });
            lazySelect.on('select2:select', function(e) {
                scope.selected = e.params.data;
                change();
            });
            lazySelect.on('select2:unselect', function(e) {
                scope.selected = {};
                change();
            });
            element.find('.kama-select').remove();
            update();
        }
        else {
            if (Object.prototype.toString.call(scope.obj.items) === '[object Object]')
                scope.obj.items = toolsService.arrayEnum(scope.obj.items);
            if (scope.obj.initLoad)
                scope.obj.getlist();
            else if (scope.obj.items && scope.obj.items.length)
                addDisplayName(scope.obj.items);
            if (scope.obj.select2) {
                $(element.find('.kama-select')[0]).select2({
                    allowClear: true
                    , dir: 'rtl'
                    , placeholder: 'یک مورد را انتخاب کنید'
                });
            }
            element.find('.kama-lazyselect').remove();
        }

        // get items from api, then call update()
        function getlist(callback) {
            if (scope.obj.select2) {
                setTimeout(() => {
                    element.find('.select2-selection__placeholder')[0].innerText = 'در حال بارگذاری اطلاعات...';
                }, 0);
            }

            let options = scope.obj.options();
            return scope.obj.listService(options).then(function (items) {
                addDisplayName(items);
                scope.obj.items = items;
                scope.obj.update();
                if (scope.obj.select2) {
                    setTimeout(() => {
                        element.find('.select2-selection__placeholder')[0].innerText = 'یک مورد را انتخاب کنید';
                    }, 0);
                }
            });
        }

        // set selected item based on bindingObject model, then call change()
        function update() {
            return $q.resolve().then(function() {
                if (scope.obj.lazy) {
                    if (scope.obj.bindingObject.model[scope.obj.parameters[scope.obj.uniqueId]]) {
                        setTimeout(function() {
                            element.find('.select2-selection__placeholder')[0].innerText = 'در حال بارگذاری اطلاعات...';
                        }, 0);
                        let searchModel = {};
                        searchModel[scope.obj.uniqueId] = scope.obj.bindingObject.model[scope.obj.parameters[scope.obj.uniqueId]];
                        return scope.obj.getService(searchModel).then(function (result) {
                            addDisplayName([result]);
                            var lazySelect = $(element.find('.kama-lazyselect')[0]);
                            var option = new Option(result[scope.obj.displayName], result[scope.obj.uniqueId], true, true);
                            
                            lazySelect.append(option).trigger('change');
                            lazySelect.trigger({
                                type: 'select2:select',
                                params: {
                                    data: result
                                }
                            });
                            setTimeout(function() {
                                element.find('.select2-selection__placeholder')[0].innerText = 'یک مورد را انتخاب کنید';
                            }, 0);
                        })
                    }
                    else {
                        scope.selected = {};
                        change();
                    }
                }
                else if (scope.obj.items && scope.obj.items.length > 0) {
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
            });
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
            }).then(()=>{
                if (scope.obj.select2)
                    $timeout(function() { element.find('.kama-select').trigger('change') }, 0);
                else if (scope.obj.lazy && !scope.obj.bindingObject.model[scope.obj.parameters[scope.obj.uniqueId]])
                    $timeout(function() { element.find('.kama-lazyselect').val(null).trigger('change') }, 0);
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