(function(angular, $, _) {

  angular.module('sandbox').config(function($routeProvider) {
      $routeProvider.when('/sandbox', {
        resolve: {
          contacts: function(crmApi){return crmApi('Contact', 'get', {contact_type: 'Individual'});}
        },
        controller: function($scope, contacts) {
          $scope.contacts = contacts;
        },
        templateUrl: '~/sandbox/ListCtrl.html'
      });
    }
  );


})(angular, CRM.$, CRM._);
