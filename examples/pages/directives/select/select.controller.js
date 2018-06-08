(function () {
    angular
        .module('test')
        .controller('SelectController', SelectController);

    SelectController.$inject = ['ObjectService', '$http'];
    function SelectController(ObjectService, $http) {
        var example = this;

        example.test1 = new ObjectService();
        example.test2 = new ObjectService();
        example.select1 = {
            items: [{ ID: 1, Name: 'John', LastName: 'Doe' }, { ID: 2, Name: 'Jane', LastName: 'Doe' }]
            , bindingObject: example.test1
            , parameters: { Name: 'TestName', LastName: 'TestLastName' }
            , displayName: ['Name', 'LastName']
        }
        example.select2 = {
            bindingObject: example.test2
            , parameters: { Name: 'TestName' }
            , listService: universities
            , options: function () {
                return {
                    PageIndex: 1
                    , PageSize: 10
                }
            }
            , initLoad: true
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