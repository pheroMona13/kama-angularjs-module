export default function kamaPermission() {
  let directive = {
    link: link,
    restrict: "A"
  };

  return directive;

  function link(scope, element, attrs) {
    let authorized = false;
    if ($rootScope.permissions && $rootScope.permissions.length) {
      for (let i = 0; i < $rootScope.permissions.length; i++) {
        if ($rootScope.permissions[i].Name === attrs.kamaPermission) {
            authorized = true;
            break;
        }
      }
    }

    if (!authorized) element.html("");
  }
}
