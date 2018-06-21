authenticationService.$inject = ['$cookies', 'globalService'];
export default function authenticationService($cookies, globalService) {
    var service = {
        setCredentials: setCredentials
        , clearCredentials: clearCredentials
        , setPosition: setPosition
        , isAuthenticated: isAuthenticated
    };
    
    return service;

    function setCredentials(responseToken) {
        let expireDate = new Date(responseToken['.expires']);

        globalService.set('authorizationData', responseToken); // does it need to be stored?
        $cookies.put('access-token', responseToken.access_token, { 'expires': expireDate });
    }
    function clearCredentials() {
        globalService.remove('authorizationData');
        globalService.remove('currentUser');
        globalService.remove('currentUserPosition');
        globalService.remove('currentUserPositions');
        $cookies.remove('access-token');
        $cookies.remove('USER-Current-Position-ID');
    }
    function setPosition(position) {
        $cookies.put('USER-Current-Position-ID', position.ID);
    }
    function isAuthenticated() {
        return (angular.element('input[name="__isAuthenticated"]').attr('value') === 'true');
    }
}