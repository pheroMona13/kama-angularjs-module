ajaxService.$inject = ['$http', 'toolsService'];
export default function ajaxService($http, toolsService) {
    const service = {
        get: get
        , save: save
        , remove: remove
        , custom: custom
    };
    
    return service;

    function get(controller, params) {
        return $http.post(controller.name + '/List', fixParams(params)).then(function (result) {
            return result.data;
        });
    }
    function save(controller, params) {
        return $http.post(controller.name + '/Save', fixParams(params)).then(function (result) {
            return result.data;
        });
    }
    function remove(controller, params) {
        return $http.post(controller.name + '/Delete', fixParams(params)).then(function (result) {
            return result.data;
        });
    }
    function custom(controller, params, action) {
        return $http.post(controller.name + '/' + action, fixParams(params)).then(function (result) {
            if (result.data.Success) {
                result.data.Data = fixResult(result.data.Data);
            }
            return result.data;
        });
    }
    function fixResult(data) {
        if (Object.prototype.toString.call(data) === '[object Array]') {
            for (var i = 0; i < data.length; i++) {
                fixObject(data[i]);
            }
        }
        else
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