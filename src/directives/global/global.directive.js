kamaGlobal.$inject = ['$rootScope', 'globalService'];
export default function kamaGlobal($rootScope, globalService) {
    var directive = {
        link: link,
        templateUrl: '/src/directives/global/global.directive.html',
        restrict: 'EA',
        scope: {
            item: '@item'
            , property: '@?property'
        }
    };

    return directive;

    function link(scope, element, attrs) {
        var setValue = _setValue;

        setValue();

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            setValue();
        });

        function _setValue() {
            var value = globalService.get(scope.item);

            if (value && scope.property)
                value = value[scope.property];

            if (!value)
                scope.value = '';
            else
                scope.value = value;
        }
    }
}