(function () {
    angular
        .module('test')
        .controller('AlertServiceController', AlertServiceController);

    AlertServiceController.$inject = ['alertService'];
    function AlertServiceController(alertService) {
        var example = this;

        example.tab = 1;
        example.alert = alert;

        function alert(type) {
            switch (type) {
                case 'success':
                    alertService.success(example.message, {
                        timeout: example.timeout
                    });
                    break;
                case 'info':
                    alertService.info(example.message, {
                        timeout: example.timeout
                    });
                    break;
                case 'warning':
                    alertService.warning(example.message, {
                        timeout: example.timeout
                    });
                    break;
                case 'error':
                    alertService.error(example.message, {
                        timeout: example.timeout
                    });
                    break;
                case 'unique-success':
                    alertService.success(example.message, {
                        timeout: example.timeout,
                        unique: true
                    });
                    break;
                case 'unique-info':
                    alertService.info(example.message, {
                        timeout: example.timeout,
                        unique: true
                    });
                    break;
                case 'unique-warning':
                    alertService.warning(example.message, {
                        timeout: example.timeout,
                        unique: true
                    });
                    break;
                case 'unique-error':
                    alertService.error(example.message, {
                        timeout: example.timeout,
                        unique: true
                    });
                    break;
            }
        }
    }
})();