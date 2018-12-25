kamaPrevent.$inject = ["alertService"];
export default function kamaPrevent(alertService) {
  let directive = {
    require: "ngModel",
    restrict: "A",
    link: link
  };

  return directive;

  function link(scope, element, attrs, ngModel) {
    element.on("keypress", function(event) {
      let pattern = attrs.kamaPrevent;
      
      let input = String.fromCharCode(
        !event.charCode ? event.which : event.charCode
      );

      // global exceptions
      // 13: enter key
      // only 13 has issues w/ firefox 64 and earlier
      if (
        [9, 13, 16, 17, 18, 27, 123].indexOf(event.which) !== -1 ||
        [9, 13, 16, 17, 18, 27, 123].indexOf(event.keyCode) !== -1
      )
        return;

      switch (pattern) {
        case "number":
          if (/[0-9]/.test(input)) {
            event.preventDefault();
            alertService.error("در این فیلد مجاز به ورود اعداد نیستید", {
              unique: true
            });
          }
          break;
        case "letter":
          if (!/[0-9]/.test(input)) {
            event.preventDefault();
            alertService.error("در این فیلد فقط مجاز به ورود اعداد هستید", {
              unique: true
            });
          }
          break;
        case "!persian":
          if (!/[\u0600-\u06FF ]/.test(input) || /[،؛؟]/.test(input)) {
            event.preventDefault();
            alertService.error(
              "در این فیلد فقط مجاز به ورود حروف فارسی هستید",
              { unique: true }
            );
          }
          break;
        default:
          if (pattern) {
            pattern = new RegExp(pattern);
            if (pattern.test(input)) {
              event.preventDefault();
              alertService.error("کاراکتر وارد شده غیرمجاز است", {
                unique: true
              });
            }
          }
      }
    });
  }
}
