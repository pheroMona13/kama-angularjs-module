export default function kamaPermission() {
    var directive = {
        link: link
        , restrict: 'A'
        , scope: {
            command: '@command'
        }
    };

    return directive;

    function link(scope, element, attrs) {
        // check if permission object exists and command is in it
        if (true) {
            // remove the element
            element.remove();
        }
    }
}