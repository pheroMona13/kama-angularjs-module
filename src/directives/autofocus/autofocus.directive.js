kamaAutofocus.$inject = ["$timeout"];
export default function kamaAutofocus($timeout) {
  let directive = {
    restrict: "A",
    link: link
  };

  return directive;

  function link(scope, element, attrs) {
    $timeout(() => {
      element.focus();
    }, 0);
  }
}
