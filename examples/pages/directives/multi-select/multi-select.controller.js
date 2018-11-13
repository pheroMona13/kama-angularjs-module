(function () {
    angular
        .module('test')
        .controller('MultiSelectController', MultiSelectController);

    MultiSelectController.$inject = ['ObjectService', '$http', '$scope'];
    function MultiSelectController(ObjectService, $http, $scope) {
        var example = this;

        example.test1 = new ObjectService();
        example.test2 = new ObjectService();

        example.select1 = {
            items: [
                { ID: 1, Name: 'John', LastName: 'Doe' }
                , { ID: 2, Name: 'Jane', LastName: 'Doe' }
            ]
            , bindingObject: example.test1
            , model: 'Users'
            , displayName: (data) => { return `firstname: ${data.Name} - lastname: ${data.LastName}` }
        }
        example.select2 = {
            bindingObject: example.test2
            , model: 'Universities'
            , displayName: ['Name', '-', 'Code']
            , listService: universities
            , options: function () {
                return {
                    PageIndex: 1
                    , PageSize: 10
                }
            }
            , initLoad: true
        }

        example.test1.model.Users = [{ ID: 1 }];
        example.test2.model.Universities = [{ ID: 'b4de4239-b937-4d67-a8c3-95affea56665' }];

        function universities(options) {
            return $http({
                method: 'GET'
                , url: 'http://www.mocky.io/v2/5bc703bf320000cf290b05b0'
                , data: options
            }).then(function (result) {
                return result.data.Data;
            });
        }
    }
})();