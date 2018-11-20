(function () {
    angular
        .module('test')
        .controller('SelectController', SelectController);

    SelectController.$inject = ['ObjectService', '$http'];
    function SelectController(ObjectService, $http) {
        var example = this;

        example.test1 = new ObjectService();
        example.test2 = new ObjectService();
        example.test3 = new ObjectService();

        example.test3.model = { TestID: "b4de4239-b937-4d67-a8c3-95affea56665" };
        example.test3.emptySelect3 = emptySelect3;

        example.select1 = {
            items: [{ ID: 1, Name: 'John', LastName: 'Doe' }, { ID: 2, Name: 'Jane', LastName: 'Doe' }]
            , bindingObject: example.test1
            , parameters: { Name: 'TestName', LastName: 'TestLastName' }
            , displayName: (data) => { return data.Name + ' wow! ' + data.LastName }
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
            , select2: true
        }
        example.select3 = {
            bindingObject: example.test3
            , parameters: { ID: 'TestID', Name: 'TestName' }
            , displayName: ['Name', 'ID']
            , lazy: true
            , listService: universities
            , getService: getOrgan
            , searchBy: 'FirstName'
        }
        
        function universities(options) {
            return $http({
                method: 'GET'
                , url: 'http://www.mocky.io/v2/5bc703bf320000cf290b05b0'
            }).then(function (result) {
                return result.data.Data;
            }).catch(function (error) {
                return error;
            });
        }
        function listOrgans(options) {
            return $http({
                method: 'POST'
                , url: 'http://localhost:3223/Position/List'
            }).then(function (result) {
                return result.data.Data;
            }).catch(function (error) {
                return error;
            });
        }
        function getOrgan(options) {
            return $http({
                method: 'GET'
                , url: 'http://www.mocky.io/v2/5bcde2952f00002c00c85617'
            }).then(function (result) {
                return result.data.Data;
            }).catch(function (error) {
                return error;
            });
        }
        function emptySelect3() {
            example.test3.model.TestID = null;
            example.select3.update();
        }
    }
})();