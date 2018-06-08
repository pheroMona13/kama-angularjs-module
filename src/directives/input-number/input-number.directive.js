kamaInputNumber.$inject = ['alertService'];
export default function kamaInputNumber(alertService) {
    var directive = {
        link: link,
        templateUrl: '/src/directives/input-number/input-number.directive.html',
        restrict: 'EA',
        scope: {
            model: '=model',
            unit: '@?unit',
            min: '=?min',
            max: '=?max',
            start: '=?start',
            step: '=?step'
        }
    };
    return directive;

    function link(scope, element, attrs) {

        scope.start = scope.start || 0;
        scope.step = scope.step || 1;
        scope.isNumber = angular.isNumber;
        scope.increase = increase;
        scope.decrease = decrease;

        function increase() {
            if (!scope.model && typeof (scope.model) != 'number')
                scope.model = scope.start;

            if (scope.max && scope.model + scope.step > scope.max) {
                alertService.error('حداکثر مقدار مجاز ' + scope.max + ' است');
                return;
            }

            scope.model += scope.step;
        }
        function decrease() {
            if (!scope.model && typeof (scope.model) != 'number')
                scope.model = scope.start;

            if (scope.min && scope.model - scope.step < scope.min) {
                alertService.error('حداقل مقدار مجاز ' + scope.min + ' است');
                return;
            }

            scope.model -= scope.step;
        }

    }
}