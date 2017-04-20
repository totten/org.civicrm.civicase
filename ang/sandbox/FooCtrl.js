(function(angular, $, _) {

  angular.module('sandbox').config(function($routeProvider) {
      $routeProvider.when('/sandbox', {
        resolve: {
          contacts: function(crmApi){return crmApi('Contact', 'get', {contact_type: 'Individual'});}
        },
        controller: function($scope, contacts) {
          $scope.contacts = contacts;
        },
        template: '<ul><li ng-repeat="contact in contacts.values"><a ng-href="#/sandbox/{{contact.id}}/summary">{{contact.display_name}}</a></li></ul>'
      });
  
      $routeProvider.when('/sandbox/:id', {
        template: '<div></div>',
        controller: function($route, $location) {
          $location.path('/sandbox/' + $route.current.params.id + '/summary');
        }
      });

      $routeProvider.when('/sandbox/:id/:tab', {
        controller: 'SandboxFooCtrl',
        templateUrl: '~/sandbox/FooCtrl.html',
        resolve: {
          activeTab: function($route) {return $route.current.params.tab;},
          myContact: function(crmApi, $route) {
            return crmApi('Contact', 'getsingle', {
              id: $route.current.params.id,
              return: ['first_name', 'last_name']
            });
          }
        }
      });
    }
  );

  // The controller uses *injection*. This default injects a few things:
  //   $scope -- This is the set of variables shared between JS and HTML.
  //   crmApi, crmStatus, crmUiHelp -- These are services provided by civicrm-core.
  //   myContact -- The current contact, defined above in config().
  angular.module('sandbox').controller('SandboxFooCtrl', function($scope, crmApi, crmStatus, crmUiHelp, myContact, activeTab) {
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
    $scope.myContact = myContact;
    $scope.$watchCollection('myContact', function(){
      $scope.cid = parseInt(myContact.id);
    });
  });

})(angular, CRM.$, CRM._);
