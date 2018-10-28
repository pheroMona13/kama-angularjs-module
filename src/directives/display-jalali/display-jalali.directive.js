kamaDisplayJalali.$inject = ["toolsService"];
export default function kamaDisplayJalali(toolsService) {
  let directive = {
    link: link,
    template: `{{convert(model)}}`,
    restrict: "EA",
    scope: {
      model: "=model"
    }
  };

  return directive;

  function link(scope, element, attrs) {
    scope.convert = toolsService.dateToJalali;
  }
}
