kamaAutofocus.$inject = ['$timeout'];
export default function kamaAutofocus($timeout) {
    var directive = {
        restrict: 'A'
        , link: link
    };

    return directive;

    function link(scope, element, attrs) {
        $timeout(function () { element.focus(); }, 0);
    }
}