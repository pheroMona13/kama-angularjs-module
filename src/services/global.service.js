globalService.$inject = ['$window', '$rootScope'];
export default function globalService($window, $rootScope) {
  var service = {};

  service.get = get;
  service.set = set;
  service.remove = remove;

  return service;

  function get(key) {
    try {
      return changeStringToDate(
        JSON.parse($window.localStorage.getItem(key)) || $rootScope[key]
      );

      function changeStringToDate(item) {
        if (Object.prototype.toString.call(item) === '[object Array]') {
          for (var i = 0; i < item.length; i++) {
            item[i] = changeStringToDate(item[i]);
          }
        } else if (Object.prototype.toString.call(item) === '[object Object]') {
          for (var key in item) {
            if (item.hasOwnProperty(key)) {
              item[key] = changeStringToDate(item[key]);
            }
          }
        } else if (/-date-ms$/.test(item)) {
          item = new Date(parseInt(item));
        }

        return item;
      }
    } catch (e) {
      if (/-date-ms$/.test($window.localStorage.getItem(key))) {
        return new Date(parseInt($window.localStorage.getItem(key)));
      }
      return $window.localStorage.getItem(key);
    }
  }
  function set(key, value) {
    $window.localStorage.setItem(key, JSON.stringify(changeDateToJson(value)));

    function changeDateToJson(item) {
      if (Object.prototype.toString.call(item) === '[object Array]') {
        for (var i = 0; i < item.length; i++) {
          changeDateToJson(item[i]);
        }
      } else if (Object.prototype.toString.call(item) === '[object Object]') {
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
            changeDateToJson(item[key]);
          }
        }
      } else if (Object.prototype.toString.call(item) === '[object Date]') {
        item.toJSON = function () {
          return this.getTime() + '-date-ms';
        };
      }

      return item;
    }
  }
  function remove(key) {
    $window.localStorage.removeItem(key);
  }
}
