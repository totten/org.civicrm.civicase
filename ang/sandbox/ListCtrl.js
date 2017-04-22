(function (angular, $, _) {

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
