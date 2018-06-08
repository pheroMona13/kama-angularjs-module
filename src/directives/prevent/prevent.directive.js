kamaPrevent.$inject = ['alertService'];
export default function kamaPrevent(alertService) {
    var directive = {
        require: 'ngModel'
        , restrict: 'A'
        , link: link
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
        element.on('keypress', function (event) {
            let pattern = attrs.kamaPrevent;
            let input = String.fromCharCode(!event.charCode ? event.which : event.charCode);

            if (event.charCode == 13) {
                // global exceptions
                // 13: enter key
                return;
            }

            switch (pattern) {
                case 'number':
                    if (/[0-9]/.test(input)) {
                        event.preventDefault();
                        alertService.error('در این فیلد مجاز به ورود اعداد نیستید', { unique: true });
                    }
                    break;
                case 'letter':
                    if (!/[0-9]/.test(input)) {
                        event.preventDefault();
                        alertService.error('در این فیلد فقط مجاز به ورود اعداد هستید', { unique: true });
                    }
                    break;
                case '!persian':
                    if (!/[\u0600-\u06FF ]/.test(input) || /[،؛؟]/.test(input)) {
                        event.preventDefault();
                        alertService.error('در این فیلد فقط مجاز به ورود حروف فارسی هستید', { unique: true });
                    }
                    break;
                default:
                    if (pattern) {
                        pattern = new RegExp(pattern);
                        if (pattern.test(input)) {
                            event.preventDefault();
                            alertService.error('کاراکتر وارد شده غیرمجاز است', { unique: true });
                        }
                    }
            }
        });
    }
}