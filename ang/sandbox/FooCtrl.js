(function(angular, $, _) {

  angular.module('sandbox').config(function($routeProvider) {
      $routeProvider.when('/sandbox/:id/:tab', {
        controller: 'SandboxFooCtrl',
        templateUrl: '~/sandbox/FooCtrl.html',
        resolve: {
          activeTab: function($route) {return $route.current.params.tab;},
          apiCall: function(crmApi, $route, $location) {
            console.log('resolve', $route.current.params, $location.search());
            var cid = $route.current.params.id;
            var apis = {};
            apis.contact = ['Contact', 'getsingle', {
              id: cid,
              return: ['first_name', 'last_name']
            }];
            if ($route.current.params.tab === 'activities') {
              var filter = {contact_id: cid};
              if ($location.search().aj)  {
                _.extend(filter, JSON.parse($location.search().aj));
              }
              apis.activities = ['Activity', 'get', filter];
            }
            return crmApi(apis);
          }
        }
      });
      
    }
  );

  // The controller uses *injection*. This default injects a few things:
  //   $scope -- This is the set of variables shared between JS and HTML.
  //   crmApi, crmStatus, crmUiHelp -- These are services provided by civicrm-core.
  //   myContact -- The current contact, defined above in config().
  angular.module('sandbox').controller('SandboxFooCtrl', function($scope, crmApi, crmStatus, crmUiHelp, apiCall, activeTab, $location) {
    // The ts() and hs() functions help load strings for this module.
    var ts = $scope.ts = CRM.ts('civicase');
    var hs = $scope.hs = crmUiHelp({file: 'CRM/sandbox/FooCtrl'}); // See: templates/CRM/sandbox/FooCtrl.hlp

    // We have myContact available in JS. We also want to reference it in HTML.
    $scope.activeTab = activeTab;
    $scope.tabs = [
      {name: 'summary', label: 'Summary'},
      {name: 'activities', label: 'Activities'},
      {name: 'people', label: 'People'},
      {name: 'files', label: 'Files'}
    ];
    var myContact = $scope.myContact = apiCall.contact;
    $scope.apiCall = apiCall;
    $scope.$watchCollection('myContact', function(){
      $scope.cid = parseInt(myContact.id);
    });
    $scope.filters = $location.search().aj ? JSON.parse($location.search().aj) : {};
    $scope.$watchCollection('filters', function() {
      if ($scope.filters.activity_type_id == '') delete $scope.filters.activity_type_id;
      var json = _.isEmpty($scope.filters) ? undefined : JSON.stringify($scope.filters);
      if ($location.search().aj != json) {
        $location.search('aj', json);
      }
    });
  });

})(angular, CRM.$, CRM._);
