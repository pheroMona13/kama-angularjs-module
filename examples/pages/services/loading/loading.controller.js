(function () {
    angular
        .module('test')
        .controller('LoadingController', LoadingController);

    LoadingController.$inject = ['loadingService'];
    function LoadingController(loadingService) {
        var example = this;

        example.tab = 1;

        example.loading = loading;

        function loading() {
            loadingService.show();
            loadingService.hide(example.timeout);
        }
    }
})();