(function (angular, rootUrl) {
    'use strict';

    angular
        .module('app', [])
        .config(config);

    config.$inject = ['$httpProvider'];
    function config($httpProvider) {
        $httpProvider.interceptors.push(loadingInterceptor);
        loadingInterceptor.$inject = ['$q', '$rootScope'];
        function loadingInterceptor($q, $rootScope) {
            return {
                request: function (config) {
                    NapTicketControl.disableInput();
                    config.url = rootUrl + config.url;
                    return config || $q.when(config);
                },
                response: function (response) {
                    NapTicketControl.enableInput();
                    return response || $q.when(response);
                },
                responseError: function (response) {
                    if (response.status === 403) {
                        NapTicketControl.Helper.showMsgBox(NapTicketControl.Helper.authorizedMsg);
                    }

                    NapTicketControl.enableInput();
                    return $q.reject(response);
                }
            };
        }
    }
})(angular, window.rootUrl);