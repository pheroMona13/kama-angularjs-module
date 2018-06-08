authInterceptorService.$inject = ['$q', '$injector', '$cookies'];
export default function authInterceptorService($q, $injector, $cookies) {
    const service = {
        request: request
        , responseError: responseError
    }

    return service;

    function request(config) {
        config.headers = config.headers || {};

        var authData = $cookies.get('access-token');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData;
        }

        return config;
    }
    function responseError(rejection) {
        if (rejection.status === -1) {
            return _ch(rejection);
        }
        else if (rejection.status === 0) {
            //toastr.serviceUnavailable();
        }
        else if (rejection.status === 500) {
            //toastr.internalServerError(rejection.data);
        }
        else if (rejection.status === 400) {
            //toastr.badRequest(rejection.data.message);
        } else if (rejection.status === 404) {
            //toastr.notFound();
        } else if (rejection.status === 401) {
            if (rejection.data.type === 'AccessDeny') {
                //toastr.unauthorized(rejection.data.message);
            } else {
                return _ch(rejection);
            }
        } else {
            //toastr.statusError(rejection.status, rejection.statusText);
        }

        return $q.reject(rejection);
    }
    function _ch(rejection) {
        var authService = $injector.get("authService");
        var $state = $injector.get("$state");

        var authData = $localStorage['authorizationData'];

        if (authData) {
            if (authData.useRefreshTokens) {
                $state.go('auth.lockme');
                return $q.reject(rejection);
            }
        }
        authService.logOut();
        $state.go('auth.signin');
        return $q.reject(rejection);
    }
}