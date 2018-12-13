authenticationService.$inject = ['globalService'];
export default function authenticationService(globalService) {
    let service = {
        setCredentials: setCredentials
        , clearCredentials: clearCredentials
        , isAuthenticated: isAuthenticated
    };
    
    return service;

    function setCredentials(responseToken) {
        globalService.set('authorizationData', responseToken);
    }
    function clearCredentials() {
        globalService.remove('authorizationData');
        globalService.remove('currentUser');
        globalService.remove('currentUserPosition');
        globalService.remove('currentUserPositions');
    }
    function isAuthenticated() {
        return (angular.element('input[name="__isAuthenticated"]').attr('value') === 'true');
    }
}