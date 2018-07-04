(function () {
    angular
        .module('test', ['kama-module', 'ngRoute', 'smart-table'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$qProvider', '$httpProvider'];
    function config($routeProvider, $qProvider, $httpProvider) {
        $routeProvider
            .when('/', { templateUrl: 'pages/home.html' })
            .when('/obsolete', { templateUrl: 'pages/obsolete.html' })
            .when('/no-example', { templateUrl: 'pages/no-example.html' })

            .when('/alert-service', { templateUrl: 'pages/services/alert/alert.html', controller: 'AlertServiceController', controllerAs: 'example' })
            .when('/enum-service', { templateUrl: 'pages/services/enum/enum.html', controller: 'EnumServiceController', controllerAs: 'example' })
            .when('/http-service', { templateUrl: 'pages/services/http/http.html', controller: 'HttpServiceController', controllerAs: 'example' })
            .when('/loading-service', { templateUrl: 'pages/services/loading/loading.html', controller: 'LoadingController', controllerAs: 'example' })

            .when('/error-directive', { templateUrl: 'pages/directives/error/error.html', controller: 'ErrorDirectiveController', controllerAs: 'example' })
            .when('/attachment-directive', { templateUrl: 'pages/directives/attachment/attachment.html', controller: 'AttachmentDirectiveController', controllerAs: 'example' })
            .when('/autofocus', { templateUrl: 'pages/directives/autofocus/autofocus.html' })
            .when('/display-jalali', { templateUrl: 'pages/directives/display-jalali/display-jalali.html', controller: 'DisplayJalaliController', controllerAs: 'example' })
            .when('/format-view', { templateUrl: 'pages/directives/format-view/format-view.html', controller: 'FormatViewController', controllerAs: 'example' })
            .when('/input', { templateUrl: 'pages/directives/input/input.html', controller: 'InputController', controllerAs: 'example' })
            .when('/prevent', { templateUrl: 'pages/directives/prevent/prevent.html' })
            .when('/read-more', { templateUrl: 'pages/directives/read-more/read-more.html' })
            .when('/select', { templateUrl: 'pages/directives/select/select.html', controller: 'SelectController', controllerAs: 'example' })
            .when('/grid', { templateUrl: 'pages/directives/grid/grid.html', controller: 'GridController', controllerAs: 'example' })

            .when('/trust-as-html', { templateUrl: 'pages/filters/trust-as-html/trust-as-html.html' })
    }

    run.$inject = ['customEnumService', 'customHttpService']
    function run(customEnumService, customHttpService) { }
})();