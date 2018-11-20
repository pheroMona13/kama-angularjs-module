authInterceptorService.$inject = ["$q", "$timeout", "globalService"];
export default function authInterceptorService($q, $timeout, globalService) {
  const service = {
    request: request,
    responseError: responseError
  };

  return service;

  function request(config) {
    let authorizationData = globalService.get("authorizationData");
    config.headers = config.headers || {};

    config.headers["__antiForgeryFormToken"] = angular
      .element('input[name="__antiForgeryFormToken"]')
      .attr("value");

    if (authorizationData && authorizationData.access_token)
      config.headers.Authorization = "Bearer " + authorizationData.access_token;

    return config;
  }
  function responseError(rejection) {
    if (rejection.status === 401) {
      document.body.innerHTML =
        '<div style="height: 100vh; line-height: 100vh; text-align: center; font-size: 18px;">زمان اعتبار شما به پایان رسیده، مجددا وارد سامانه شوید</div>';
      $timeout(() => {
        window.location.reload();
      }, 2000);
    }

    return $q.reject(rejection);
  }
}
