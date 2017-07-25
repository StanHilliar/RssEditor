angular.module('mean.emaileditor').controller('ContentAppController', ['$scope', '$stateParams', '$state', '$mdDialog', '$compile', '$interpolate', '$sce', 'Global', 'EmailModule', 'MeanUser',
  function($scope, $stateParams, $state, $mdDialog, $compile, $interpolate, $sce, Global, EmailModule, MeanUser) 
  {
    $scope.global = Global;
    $scope.package = 
    {
      name: 'emaileditor'
    };

    $scope.company = $stateParams.company;

    $scope.createModule = function()
    {
        $state.go('emailmodule_create', {company: $stateParams.company});
    }; 

    $scope.fields =
    [
        {_id: '1', name: 'venue'}
    ];

    $scope.comperator =
    [
        {_id: '1', name: 'equals'},
        {_id: '2', name: 'contains'},
        {_id: '3', name: 'does not equal'},
        {_id: '4', name: 'does not contain'},
    ];

 
    $scope.list = function()
    {
      EmailModule.query({company: $stateParams.company}, function(response)
      {
        $scope.modules = response;
      });
    };   

    $scope.filterEnabled = true;

    $scope.list();

  }
]);
