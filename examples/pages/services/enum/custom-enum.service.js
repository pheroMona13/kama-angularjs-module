(function () {
    angular
        .module('test')
        .factory('customEnumService', customEnumService);

    customEnumService.$inject = ['enumService'];
    function customEnumService(enumService) {
        enumService.SampleEnum = { '1': 'تست 1', '2': 'تست 2' };

        return enumService;
    }
})();