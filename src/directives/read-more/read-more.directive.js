kamaReadMore.$inject = ["toolsService", "$interval", "$timeout"];
export default function kamaReadMore(toolsService, $interval, $timeout) {
  var directive = {
    link: link,
    templateUrl: require("./read-more.directive.html"),
    restrict: "E",
    scope: {
      text: "=text"
    }
  };

  return directive;

  function link(scope, element, attrs) {
    scope.id = toolsService.randomString(10);
    scope.openModal = openModal;

    // temp fix
    scope.sampleText = scope.text
      ? scope.text.split(" ", 6).join(" ") + "..."
      : "";
    let promise = $interval(() => {
      scope.sampleText = scope.text
        ? scope.text.split(" ", 6).join(" ") + "..."
        : "";
    }, 1000);
    $timeout(() => {
      $interval.cancel(promise);
    }, 5000);

    function openModal() {
      $(`#${scope.id}`).modal("show");
    }
  }
}
