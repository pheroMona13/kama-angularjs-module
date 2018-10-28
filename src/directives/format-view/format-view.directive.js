kamaFormatView.$inject = ["toolsService", "$filter"];
export default function kamaFormatView(toolsService, $filter) {
  let directive = {
    require: "ngModel",
    restrict: "A",
    link: link
  };

  return directive;

  function link(scope, element, attrs, ngModel) {
    // format text going to user (model to view)
    ngModel.$formatters.unshift(value => {
      if (attrs.kamaFormatView === "date") {
        if (value) return toolsService.dateToJalali(new Date(value));
        else return "";
      } else if (attrs.kamaFormatView === "gregorian") {
        if (value) return new Date(value).toDateString();
        else return "";
      } else if (attrs.kamaFormatView === "money") {
        if (value) return $filter("number")(ngModel.$modelValue);
        else return "";
      } else if (attrs.kamaFormatView === "time") {
        return toolsService.minutesToTime(value);
      } else {
        return value;
      }
    });

    // format text from the user (view to model)
    ngModel.$parsers.unshift(viewValue => {
      if (attrs.kamaFormatView === "date") {
        return toolsService.jalaliToDate(viewValue);
      } else if (attrs.kamaFormatView === "gregorian") {
        return new Date(viewValue);
      } else if (attrs.kamaFormatView === "money") {
        var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, "");
        element.val($filter("number")(plainNumber));
        return plainNumber;
      } else if (attrs.kamaFormatView === "time") {
        return toolsService.timeToMinutes(viewValue);
      } else {
        return viewValue;
      }
    });
  }
}
