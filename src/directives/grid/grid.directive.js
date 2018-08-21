kamaGrid.$inject = ['alertService', 'loadingService', 'toolsService', '$filter'];
export default function kamaGrid(alertService, loadingService, toolsService, $filter) {
    var directive = {
        link: link
        , template: `<div class="kama-grid-top" ng-if="!obj.hideHeader && !obj.readOnly()">
			<a href="" class="btn btn-link" style="text-decoration: none; color: #e0e3e6" ng-click="obj.add()"><i class="fa fa-plus" aria-hidden="true" style="position: relative; top: 2px;"></i> افزودن</a>
		</div>
		<div class="table-responsive kama-grid-table" ng-style="{'margin-left': obj.readOnly() || obj.actions.length * 35}" ng-if="!obj.hideTable">
			<table st-table="displayedItems" st-safe-src="obj.items" class="table table-bordered table-striped">
				<thead>
					<tr>
						<th style="width: 70px">ردیف</th>
						<th ng-repeat="column in obj.columns"
							st-sort="column.name">{{column.displayName}}</th>
						<th ng-if="obj.actions.length && !obj.readOnly()" ng-style="{width: obj.actions.length * 35 + 1}" class="grid-action-header" ng-class="{'with-global-search': obj.globalSearch}">_</th>
					</tr>
					<tr ng-if="obj.globalSearch">
						<th colspan="{{obj.columns.length + 2}}"><input st-search="" st-delay="10" class="form-control" placeholder="جستجو در این صفحه" type="text" /></th>
					</tr>
				</thead>
				<tbody>
					<tr ng-repeat="item in displayedItems">
						<td>{{((obj.pageIndex - 1) * obj.pageSize) + $index + 1}}</td>
						<td ng-repeat="column in obj.columns">
							<span ng-if="!column.subItem" ng-click="column.onclick(item)">
                                <span ng-class="{'link': !!column.onclick}">{{cellValue(item, column)}}</span>
							</span>

							<span ng-if="column.subItem">
								<span ng-repeat="subItem in item[column.subItem]">
									<span ng-if="subItem[column.subItemKey] == column.subItemValue" ng-click="column.onclick(subItem)">
										<span ng-class="{'link': !!column.onclick}">{{cellValue(subItem, column)}}</span>
									</span>
								</span>
							</span>
						</td>
						<td ng-if="obj.actions.length && !obj.readOnly()" ng-style="{ 'width': obj.actions.length * 35 + 1 }" class="grid-action">
							<i ng-repeat="action in obj.actions"
							   ng-click="action.onclick(item)"
							   ng-if="obj.checkActionVisibility === undefined || obj.checkActionVisibility(action.name, item)"
							   class="{{action.class}}"
							   title="{{action.title}}"
							   aria-hidden="true"></i>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="col-xs-12 kama-grid-bottom" ng-if="!obj.hideFooter">
			<div class="col-xs-12 col-sm-4 col-sm-push-4 kama-pagination">
				<a href="" ng-click="obj.previousPage()"><i class="fa fa-chevron-right" aria-hidden="true"></i>قبلی</a>
				|
				صفحه
				<select ng-options="option for option in obj.pageCount" ng-model="obj.pageIndex" ng-change="obj.getlist()"></select>
				از
				{{obj.pageCount.length}}
				|
				<a href="" ng-click="obj.nextPage()">بعدی<i class="fa fa-chevron-left" aria-hidden="true"></i></a>
			</div>
			<div class="col-xs-12 col-sm-8">
				<div class="row">
					<div class="col-xs-6 col-sm-pull-6 kama-total">
						تعداد کل: {{obj.total}}
					</div>
					<div class="col-xs-6 kama-page-size">
						رکورد در صفحه:
						<select ng-options="option for option in obj.pageSizeRange" ng-model="obj.pageSize" ng-change="obj.pageSizeChange()"></select>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="deleteConfirmationModal" tabindex="-1" role="dialog" aria-labelledby="deleteConfirmationLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="deleteConfirmationLabel">تایید حذف</h4>
					</div>
					<div class="modal-body">
						<p>از حذف <strong>{{displayName}}</strong> اطمینان دارید؟</p>
					</div>
					<div class="modal-footer btn-container">
						<button type="button" class="btn btn-danger btn-min-width" data-dismiss="modal" ng-click="obj.confirmRemove()">تایید</button>
						<button type="button" class="btn btn-default btn-min-width" data-dismiss="modal">انصراف</button>
					</div>
				</div>
			</div>
		</div>`
        , restrict: 'E'
        , scope: {
            obj: '='
        }
    };

    return directive;

    function link(scope, element, attrs) {
        if (!scope.obj)
            return console.error('KAMA GRID: obj is undefined.');
        if (!scope.obj.columns)
            return console.error('KAMA GRID: columns is undefined.');
        else if (scope.obj.columns.constructor !== Array)
            return console.error('KAMA GRID: columns should be an array of objects.');
        else if (!scope.obj.columns.length)
            return console.error('KAMA GRID: columns can\'t be an empty array!');

        scope.obj.moduleType = 'grid';
        scope.obj.actions = scope.obj.actions || [
            { title: 'ویرایش', class: 'fa fa-pencil grid-action-blue', onclick: edit, name: 'edit' }
            , { title: 'حذف', class: 'fa fa-close grid-action-red', onclick: remove, name: 'remove' }
        ];
        scope.obj.pageSize = scope.obj.pageSize || 5;
        scope.obj.pageIndex = scope.obj.pageIndex || 1;
        scope.obj.pageSizeRange = scope.obj.pageSizeRange || [5, 10, 20, 50, 100];
        scope.obj.hideHeader = scope.obj.hideHeader || false;
        scope.obj.hideFooter = scope.obj.hideFooter || false;
        scope.obj.displayNameFormat = scope.obj.displayNameFormat || [];
        scope.obj.add = add;
        scope.obj.edit = edit;
        scope.obj.remove = remove;
        scope.obj.confirmRemove = confirmRemove;
        scope.obj.getlist = getlist;
        scope.obj.update = update;
        scope.obj.readOnly = scope.obj.readOnly || function () { return false };
        scope.obj.options = scope.obj.options || function () { return {} }; // should be a function that returns an object
        scope.obj.listService; // should be a promise object
        scope.obj.deleteService; // should be a promise object
        scope.displayName = '';
        scope.deleteBuffer = {};
        scope.obj.previousPage = previousPage;
        scope.obj.nextPage = nextPage;
        scope.obj.pageSizeChange = pageSizeChange;
        scope.cellValue = cellValue;

        Object.defineProperty(scope.obj, 'total', {
            get: function () {
                if (scope.obj.items && scope.obj.items.length > 0)
                    return scope.obj.items[0].Total;
                else
                    return 0;
            }
        });
        Object.defineProperty(scope.obj, 'result', {
            set: function (result) {
                if (result.Success) {
                    scope.obj.items = result.Data;
                    scope.obj.pageCount = Array.apply(null, { length: result.PageCount + 1 }).map(Number.call, Number);
                    scope.obj.pageCount.shift();
                }
            }
        })
        
        if (scope.obj.initLoad) {
            loadingService.show();
            scope.obj.getlist(loadingService.hide);
        }
        else
            scope.obj.pageCount = [1];

        // rename to 'refresh' or 'update' after migration to new system completed
        function getlist(loading) {
            if (loading === false)
                return getItems();
            else {
                loadingService.show();
                return getItems().then(function () {
                    loadingService.hide();
                }).catch(function (error) {
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
            if (scope.obj.pageCount && scope.obj.pageIndex < scope.obj.pageCount.length) {
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
            scope.obj.bindingObject.state = 'add';
            scope.obj.bindingObject.model = {};
            scope.obj.bindingObject.update();

            if (scope.obj.onAdd)
                scope.obj.onAdd();

            if (scope.obj.modal) {
                $('#' + scope.obj.modal).modal('show');
                $('#' + scope.obj.modal).on('shown.bs.modal', function () {
                    $('#' + scope.obj.modal + ' .modal-body').animate({ scrollTop: 0 }, 'fast');
                });
            }
        }
        function edit(item) {
            scope.obj.bindingObject.state = 'edit';
            scope.obj.bindingObject.model = angular.copy(item);
            scope.obj.bindingObject.update();

            if (scope.obj.onEdit)
                scope.obj.onEdit(item);

            if (scope.obj.modal) {
                $('#' + scope.obj.modal).modal('show');
                $('#' + scope.obj.modal).on('shown.bs.modal', function () {
                    $('#' + scope.obj.modal + ' .modal-body').animate({ scrollTop: 0 }, 'fast');
                });
            }
        }
        function remove(item) {
            scope.deleteBuffer = item;
            scope.displayName = '';
            for (let i = 0; i < scope.obj.displayNameFormat.length; i++) {
                scope.displayName += scope.deleteBuffer[scope.obj.displayNameFormat[i]] + ' ';
            }

            element.find('#deleteConfirmationModal').modal('show');
        }
        function confirmRemove() {
            loadingService.show();
            scope.obj.deleteService(scope.deleteBuffer).then(function (result) {
                if ((scope.obj.pageIndex - 1) * scope.obj.pageSize + 1 === scope.obj.total)
                    scope.obj.pageIndex--;

                return getItems();
            }).then(() => {
                if (scope.obj.onDelete)
                    return scope.obj.onDelete();
            }).then(function () {
                loadingService.hide();
                alertService.success('حذف با موفقیت انجام شد');
            }).catch(function (error) {
                loadingService.hide();
                alertService.error(error);
            });
        }
        function update() {
            if (scope.obj.bindingObject.state === 'add') {
                scope.obj.pageIndex = (scope.obj.items.length > 0) ? Math.floor(scope.obj.total / scope.obj.pageSize) + 1 : 1;
                if (!scope.obj.pageCount[scope.obj.pageIndex - 1])
                    scope.obj.pageCount[scope.obj.pageCount.length] = scope.obj.pageIndex;
            }

            if (scope.obj.model && scope.obj.initLoad)
                scope.obj.getlist();
            else
                scope.obj.items.push(angular.copy(scope.obj.bindingObject.model));

            scope.obj.bindingObject.state = 'view';
            scope.obj.bindingObject.model = {};

            if (scope.obj.modal)
                $('#' + scope.obj.modal).modal('hide');
        }
        function getItems() {
            let options = scope.obj.options();
            options.PageSize = scope.obj.pageSize;
            options.PageIndex = scope.obj.pageIndex;

            return scope.obj.listService(options).then(function (items) {
                let pageCount = 1;
                if (items.length && items[0].Total)
                    pageCount = Math.ceil(items[0].Total / scope.obj.pageSize);

                scope.obj.pageCount = Array.apply(null, { length: pageCount + 1 }).map(Number.call, Number);
                scope.obj.pageCount.shift();
                return scope.obj.items = items;
            });
        }
        function cellValue(item, column) {
            let process = column.callback || function(item) { return item };
            switch (column.type) {
                case 'date':
                    return process(toolsService.dateToJalali(item[column.name]));

                case 'enum':
                    return process(column.source[item[column.name]]);

                case 'money':
                    return process($filter('number')(item[column.name]));

                case 'time':
                    if (Object.prototype.toString.call(item[column.name]) === '[object Date]')
                        return process(item[column.name].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                    else
                        return process(toolsService.minutesToTime(item[column.name]));

                default:
                    return process(item[column.name]);
            }
        }
    }
}