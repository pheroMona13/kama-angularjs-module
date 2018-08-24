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
            , displayName: ['Name', 'LastName']
        }
        example.select2 = {
            bindingObject: example.test2
            , model: 'Universities'
            , displayName: ['Name', 'Code']
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
        example.test2.model.Universities = [{ ID: '5d877048-4ce9-4f50-96e2-06bed3d622ee' }];

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