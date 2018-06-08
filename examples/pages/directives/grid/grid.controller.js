(function () {
    angular
        .module('test')
        .controller('GridController', GridController);

    GridController.$inject = ['ObjectService', '$http'];
    function GridController(ObjectService, $http) {
        var example = this;

        example.test = new ObjectService();
        example.test.grid = {
            bindingObject: example.test
            , initLoad: true
            , columns: [
                { name: 'Name', displayName: 'نام دانشگاه/مرکز آموزشی' }
                //, { name: 'Type', displayName: 'نوع', type: 'enum', source: enumService.UniversityType }
                , { name: 'Enable', displayName: 'فعال' }
            ]
            , displayNameFormat: ['Name']
            , globalSearch: true
            , listService: universities
        }

        function universities(options) {
            return $http({
                method: 'POST'
                , url: 'http://localhost:26089/University/List'
                , data: options
            }).then(function (result) {
                return result.data.Data;
            });
        }
    }
})();