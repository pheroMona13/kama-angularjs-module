import kamaAttachment from './directives/attachment/attachment.directive';
import kamaPermission from './directives/authorization/permission.directive';
import kamaAutofocus from './directives/autofocus/autofocus.directive';
import kamaDisplayEnum from './directives/display-enum/display-enum.directive';
import kamaDisplayJalali from './directives/display-jalali/display-jalali.directive';
import kamaError from './directives/error/error.directive';
import kamaFormatView from './directives/format-view/format-view.directive';
import kamaGrid from './directives/grid/grid.directive';
import kamaInput from './directives/input/input.directive';
import kamaInputNumber from './directives/input-number/input-number.directive';
import kamaPrevent from './directives/prevent/prevent.directive';
import kamaReadMore from './directives/read-more/read-more.directive';
import kamaSelect from './directives/select/select.directive';
import kamaMultiSelect from './directives/multi-select/multi-select.directive';

import ajaxMultiService from './services/ajax-multi.service';
import ajaxService from './services/ajax.service';
import alertService from './services/alert.service';
import authInterceptorService from './services/auth-interceptor.service';
import authService from './services/auth.service';
import authenticationService from './services/authentication.service';
import enumService from './services/enum.service';
import globalService from './services/global.service';
import httpService from './services/http.service';
import loadingService from './services/loading.service';
import modelService from './services/model.service';
import ObjectService from './services/object.service';
import toolsService from './services/tools.service';

import trustAsHtml from './filters/trust-as-html.filter';
import displayMoney from './filters/display-money.filter';

require("./styles/style.scss");

angular
    .module('kama-module', [])
    
    .directive('kamaAttachment', kamaAttachment)
    .directive('kamaPermission', kamaPermission)
    .directive('kamaAutofocus', kamaAutofocus)
    .directive('kamaDisplayEnum', kamaDisplayEnum)
    .directive('kamaDisplayJalali', kamaDisplayJalali)
    .directive('kamaError', kamaError)
    .directive('kamaFormatView', kamaFormatView)
    .directive('kamaGrid', kamaGrid)
    .directive('kamaInput', kamaInput)
    .directive('kamaInputNumber', kamaInputNumber)
    .directive('kamaPrevent', kamaPrevent)
    .directive('kamaReadMore', kamaReadMore)
    .directive('kamaSelect', kamaSelect)
    .directive('kamaMultiSelect', kamaMultiSelect)

    .factory('ajaxMultiService', ajaxMultiService)
    .factory('ajaxService', ajaxService)
    .factory('alertService', alertService)
    .factory('authInterceptorService', authInterceptorService)
    .factory('authService', authService)
    .factory('authenticationService', authenticationService)
    .factory('enumService', enumService)
    .factory('globalService', globalService)
    .factory('httpService', httpService)
    .factory('loadingService', loadingService)
    .factory('modelService', modelService)
    .factory('ObjectService', ObjectService)
    .factory('toolsService', toolsService)

    .filter('trustAsHtml', trustAsHtml)
	.filter('displayMoney', displayMoney);