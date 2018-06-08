(function () {
    angular
        .module('test')
        .factory('customHttpService', customHttpService);

    customHttpService.$inject = ['httpService', '$http', '$q'];
    function customHttpService(httpService, $http, $q) {
        httpService.PrayerTime = {};
        httpService.PrayerTime.ByCity = function (cityId) {
            return $http({
                method: 'GET'
                , url: 'https://prayer.aviny.com/api/prayertimes/' + cityId
            }).then(function (result) {
                if (result.status != 200)
                    return $q.reject('خطای ناشناخته')

                return result.data;
            }).catch(function (error) {
                return $q.reject(error);
            });
        }

        return httpService;
    }
})();