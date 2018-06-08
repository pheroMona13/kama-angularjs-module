kamaInput.$inject = ['$timeout', 'toolsService'];
export default function kamaInput($timeout, toolsService) {
    var directive = {
        link: link
        , template: `<span class="kama-input-info" title="{{errorMessage}}" data-toggle='tooltip' data-placement="right"
              ng-show="validate() == false">i</span>
        <i class="fa fa-calendar kama-input-focus" aria-hidden="true"
           ng-show="type == 'date'"
           ng-click="focus()"></i>
        <i class="fa fa-close kama-input-clear-icon" aria-hidden="true" title="پاک کردن"
           ng-show="type == 'date' && model"
           ng-click="clear()"></i>

        <input type="text"
               class="form-control kama-input"
               ng-hide="disabled"
               ng-model="model"
               ng-class="{'border-green': validate(), 'border-red': validate() == false}"
               ng-readonly="readonly"
               kama-format-view="{{type}}"
               kama-prevent="{{preventPattern}}"
               id="{{identifier}}"
               maxlength="{{maxlength}}" />

        <span ng-show="disabled" class="kama-input-colon">:</span>
        <span ng-show="disabled" class="form-value">{{model}}</span>`
        , restrict: 'E'
        , scope: {
            model: '=model'
            , type: '@type'

            , disabled: '=?disabled'
            , errorMessage: '@?errorMessage'
            , identifier: '@?identifier'
            , maxlength: '@?maxlength'
            , preventPattern: '@?preventPattern'
            , readonly: '=?readonly'
            , validator: '=?validator'
        }
    };

    return directive;

    function link(scope, element, attrs) {
        let defaultDatepickerFormat = {
            nextButtonIcon: "fa fa-arrow-circle-right"
            , previousButtonIcon: "fa fa-arrow-circle-left"
            , buttonsColor: "#2a3f54"
            , markToday: true
            , markHolidays: true
            , highlightSelectedDay: true
            , sync: true
            , gotoToday: true
        }
        scope.maxlength = scope.maxlength || 524288;
        scope.identifier = scope.identifier || toolsService.randomString(10);
        scope.clear = clear;
        scope.focus = focus;
        scope.validate = validate;

        switch (scope.type) {
            case 'nationalCode':
                scope.validator = toolsService.validate.nationalCode;
                scope.errorMessage = 'کد ملی وارد شده اشتباه است';
                scope.preventPattern = 'letter';
                scope.maxlength = 10;
                break;

            case 'legalNationalCode':
                scope.validator = toolsService.validate.legalNationalCode;
                scope.errorMessage = 'شناسه ملی وارد شده اشتباه است';
                scope.preventPattern = 'letter';
                scope.maxlength = 11;
                break;

            case 'date':
                scope.readonly = true;
                $timeout(function () {
                    // init datepicker
                    kamaDatepicker(scope.identifier, defaultDatepickerFormat);
                });
                break;
        }

        function clear() {
            scope.model = null;
        }
        function focus() {
            $('#' + scope.identifier).focus();
        }
        function validate() {
            if (scope.model && typeof scope.validator == 'function')
                return scope.validator(scope.model);
        }
    }
}