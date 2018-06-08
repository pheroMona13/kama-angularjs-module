ajaxMultiService.$inject = ['$http', '$q', 'toolsService'];
export default function ajaxMultiService($http, $q, toolsService) {
    const service = {
        call: call
    };
    
    return service;
    
    function call(resources) {
        let promises = []
            , res = [];

        angular.forEach(resources,$http, function (resource) {
            promises.push(
                $http.post(resource.controller.name + '/' + resource.action, resource.params).then(
                    function (result) {
                        if (result.data.Success) {
                            result.data.Data = fixResult(result.data.Data);
                        }
                        res.push({ resource: resource, result: result.data });
                    })
            );
        });
        
        return $q.all(promises).then(function () {
            return res;
        });
    }

    function fixResult(data) {
        if (Object.prototype.toString.call(data) === '[object Array]') {
            for (var i = 0; i < data.length; i++) {
                fixObject(data[i]);
            }
        } else
            fixObject(data);

        return data;

        function fixObject(obj) {
            if (Object.prototype.toString.call(obj) === '[object Object]') {
                for (var key in obj) {
                    // fix dates
                    if (typeof obj[key] === 'string' && obj[key].indexOf('/Date(') != -1 && obj[key].indexOf(')/') != -1) {
                        obj[key] = new Date(parseInt(obj[key].substr(6)));
                    }
                }
            }
        }
    }
    function fixParams(params) {
        return toolsService.standardizeNumbers(params);
    }
}

// sample
// var resources = [
//     { controller: modelService.user, params: {}, action: 'List' }
//     , { controller: modelService.user, params: {}, action: 'List' }
// ];
// ajaxMultiService.call(resources).then(function (result) {
//     result // an array containing both resource and result
// });