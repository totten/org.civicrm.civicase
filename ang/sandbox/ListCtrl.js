(function (angular, $, _) {
  var internalUpdate = false, activeTimer = null;

  angular.module('sandbox').config(function ($provide) {
    $provide.decorator('$rootScope', function ($delegate, $injector) {
      Object.getPrototypeOf($delegate).$bindToRoute = function (scopeVar, queryParam, queryDefaults) {
        var _scope = this;
        if (!queryDefaults) queryDefaults = {};

        var $route = $injector.get('$route'), $timeout = $injector.get('$timeout');

        if ($route.current.params[queryParam]) {
          _scope[scopeVar] = JSON.parse($route.current.params[queryParam]);
        }
        else {
          _scope[scopeVar] = angular.extend({}, queryDefaults);
        }

        // Keep the URL bar up-to-date.
        _scope.$watchCollection(scopeVar, function (newFilters) {
          internalUpdate = true;

          var p = angular.extend({}, $route.current.params);
          p[queryParam] = JSON.stringify(newFilters);
          $route.updateParams(p);

          if (activeTimer) $timeout.cancel(activeTimer);
          activeTimer = $timeout(function () {
            internalUpdate = false;
            activeTimer = null;
          }, 50);
        });
      };
      return $delegate;
    });
  });

  angular.module('sandbox').run(function ($rootScope, $injector) {
    $rootScope.$on('$routeUpdate', function () {
      // Only reload if someone else -- like the user or an <a href> -- changed URL.
      if (!internalUpdate) {
        $injector.get('$route').reload();
      }
    });

  });

  angular.module('sandbox').config(function ($routeProvider) {
      $routeProvider.when('/sandbox', {
        reloadOnSearch: false,
        controller: function ($scope) {
          $scope.$bindToRoute('contactFilters', 'contacts', {
            contact_type: 'Individual'
          });
        },
        templateUrl: '~/sandbox/ListCtrl.html'
      });
    }
  );

})(angular, CRM.$, CRM._);
