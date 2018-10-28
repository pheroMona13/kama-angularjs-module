kamaDisplayEnum.$inject = ["enumService"];
export default function kamaDisplayEnum(enumService) {
  let directive = {
    link: link,
    template: `{{enumObject[model]}}`,
    restrict: "EA",
    scope: {
      model: "=model",
      enum: "@enum"
    }
  };

  return directive;

  function link(scope, element, attrs) {
    scope.enumObject = enumService[scope.enum];
  }
}
