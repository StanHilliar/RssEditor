'use strict';

/* jshint -W098 */
angular.module('mean.emaileditor').controller('TemplateOverViewController', ['$scope','$compile', '$modal', '$interpolate', '$sce', 'Global', 'Emaileditor',
  function($scope, $compile, $modal, $interpolate, $sce, Global, Emaileditor) 
  {
    $scope.global = Global;
    $scope.package = 
    {
      name: 'emaileditor'
    };

    $scope.templates = Emaileditor.getAllTemplates().then(function(err, res)
    {
      console.error(err);
      console.log(res);
    });
  }
]).controller('EditTemplateController', ['$scope','$compile', '$modal', '$interpolate', '$sce', 'Global', 'Emaileditor',
  function($scope, $compile, $modal, $interpolate, $sce, Global, Emaileditor) 
  {
    $scope.global = Global;
    $scope.package = 
    {
      name: 'emaileditor'
    };

    $scope.save = function()
    {
      console.log('save');
      Emaileditor.saveTemplate({type: $scope.templateType, name: $scope.templateName, source: $scope.tempateSource, createdBy: 'Simon' }).then(function(err, res)
      {
        console.error(err);
        console.log(res);
      });
    }


  }
])
;
