kamaInput.$inject = ["$timeout", "toolsService", "$rootScope"];
export default function kamaInput($timeout, toolsService, $rootScope) {
    let directive = {
        link: link,
        template: require("./input.directive.html"),
        restrict: "E",
        scope: {
            model: "=model",
            type: "@type",

            disabled: "=?disabled",
            errorMessage: "@?errorMessage",
            identifier: "@?identifier",
            maxlength: "@?maxlength",
            preventPattern: "@?preventPattern",
            readonly: "=?readonly",
            validator: "=?validator",
            position: "@?position",
            parentId: "@?parentId",
            onChange: "=?onChange",
        }
    };

    return directive;

    function link(scope, element, attrs) {
        let defaultDatepickerFormat = $rootScope.defaultDatepickerFormat || {
            previousButtonIcon: "fa fa-arrow-circle-right",
            nextButtonIcon: "fa fa-arrow-circle-left",
            buttonsColor: "#2a3f54",
            swapNextPrev: true,
            markToday: true,
            markHolidays: true,
            highlightSelectedDay: true,
            sync: true,
            gotoToday: true,
            pastYearsCount: 100,
            futureYearsCount: 50,
            position: scope.parentId
                ? "auto"
                : scope.position
                    ? scope.position
                    : "bottom",
            parentId: scope.parentId
        };

        scope.maxlength = scope.maxlength || 524288;
        scope.identifier = scope.identifier || toolsService.randomString(10);
        scope.onChange = scope.onChange || function () { };
        scope.clear = clear;
        scope.focus = focus;
        scope.validate = validate;

        switch (scope.type) {
            case "nationalCode":
                scope.validator = toolsService.validate.nationalCode;
                scope.errorMessage = "کد ملی وارد شده اشتباه است";
                scope.preventPattern = "letter";
                scope.maxlength = 10;
                break;

            case "legalNationalCode":
                scope.validator = toolsService.validate.legalNationalCode;
                scope.errorMessage = "شناسه ملی وارد شده اشتباه است";
                scope.preventPattern = "letter";
                scope.maxlength = 11;
                break;

            case "date":
                scope.readonly = true;
                $timeout(() => {
                    // init datepicker
                    kamaDatepicker(scope.identifier, defaultDatepickerFormat);
                });
                break;
        }

        function clear() {
            scope.model = null;
        }
        function focus() {
            $(`#${scope.identifier}`).focus();
        }
        function validate() {
            if (scope.model && typeof scope.validator === "function")
                return scope.validator(scope.model);
        }
    }
}
