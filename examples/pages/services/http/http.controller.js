(function () {
    angular
        .module('test')
        .controller('HttpServiceController', HttpServiceController);

    HttpServiceController.$inject = ['httpService'];
    function HttpServiceController(httpService) {
        var example = this;

        example.getPrayerTime = getPrayerTime;

        function getPrayerTime() {
            if (!example.city)
                return;

            example.loading = true;
            httpService.PrayerTime.ByCity(example.city.id).then(function (result) {
                example.loading = false;
                example.response = result;
            }).catch(function () {
                example.loading = false;
            });
        }
    }
})();