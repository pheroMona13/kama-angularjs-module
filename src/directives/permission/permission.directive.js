kamaPermission.$inject = ["toolsService"];
export default function kamaPermission(toolsService) {
  let directive = {
    link: link,
    restrict: "A"
  };

  return directive;

  function link(scope, element, attrs) {
    if (!toolsService.checkPermission(attrs.kamaCheckPermission))
      element.remove();
  }
}
