export default function kamaError() {
  let directive = {
    template: require("./erro.directive.html"),
    restrict: "E",
    scope: {
      errors: "=errors"
    }
  };

  return directive;
}
