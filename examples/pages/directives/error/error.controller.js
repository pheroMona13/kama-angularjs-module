(function () {
    angular
        .module('test')
        .controller('ErrorDirectiveController', ErrorDirectiveController);
    
    function ErrorDirectiveController() {
        var example = this;

        example.tab = 1;
        example.displayErrors = displayErrors;

        function displayErrors() {
            example.errors = ['خطای اول', 'خطای دوم', 'خطای سوم', 'خطای چهارم', 'خطای پنجم', 'خطای ششم', 'خطای هفتم'];
        }
    }
})();