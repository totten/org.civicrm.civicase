(function (angular, $, _) {

  angular.module('sandbox').factory('crmUiBindRoute', function ($location, $rootScope, $timeout, $route) {
    var internalUpdate = false, activeTimer = null;
    $rootScope.$on('$routeUpdate', function () {
      // Only reload if someone else -- like the user or an <a href> -- changed URL.
      if (!internalUpdate) {
        $route.reload();
      }
    });

    return function ($scope, scopeExpr, queryParam, queryDefaults) {
      if (!queryDefaults) queryDefaults = {};
      if ($location.search()[queryParam]) {
        $scope[scopeExpr] = JSON.parse($location.search()[queryParam]);
      }
      else {
        $scope[scopeExpr] = angular.extend({}, queryDefaults);
      }

      // Keep the URL bar up-to-date.
      $scope.$watchCollection(scopeExpr, function (newFilters) {
        internalUpdate = true;
        $location.search(queryParam, JSON.stringify(newFilters));
        if (activeTimer) $timeout.cancel(activeTimer);
        activeTimer = $timeout(function () {
          internalUpdate = false;
          activeTimer = null;
        }, 50);
      });
    };
  });

  angular.module('sandbox').config(function ($routeProvider) {
      $routeProvider.when('/sandbox', {
        reloadOnSearch: false,
        controller: function ($scope, crmUiBindRoute) {
          crmUiBindRoute($scope, 'contactFilters', 'contacts', {
            contact_type: 'Individual'
          });
        },
        templateUrl: '~/sandbox/ListCtrl.html'
      });
    }
  );

})(angular, CRM.$, CRM._);
