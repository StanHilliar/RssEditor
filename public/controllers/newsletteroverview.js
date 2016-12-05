'use strict';

/* jshint -W098 */
angular.module('mean.emaileditor').controller('NewsletterOverviewController', ['$scope','$compile', '$interpolate', '$sce', 'Global', 'NewsletterEntity',
  function($scope, $compile, $interpolate, $sce, Global, NewsletterEntity) {
    $scope.global = Global;
    $scope.package = 
    {
      name: 'emaileditor'
    };

    $scope.your_variable = '';
    $scope.rssContent = 'omg';
    $scope.test1234 = 'omg';


    $scope.destroyEntity = function(entityId)
    {
      console.log('destroyEntity');

      console.log(entityId);

      //EmailModule.find({ moduleId: moduleId }).remove().exec();
      
      NewsletterEntity.remove({entityId: entityId}, function(_newsletterEntity)
      {
        console.log('destroyModule callback');
        console.log(_newsletterEntity);
        var _newsletterEntity = -1;
        for(var i  = 0; i < $scope.newsletters.length; i++)
        {
          if($scope.newsletters[i]._id == entityId)
          {
            _newsletterEntity = i;
          }
        }
        $scope.newsletters.splice(_newsletterEntity ,1);
        //_emailModule.remove();
     });
    };

    $scope.list = function()
    {
      console.log('listNewsletterEntitiy');


      NewsletterEntity.query({},function(response)
      {
        console.log('list callback');
        console.log(response);
        $scope.newsletters = response;
      });
    };   

    $scope.list();

  }
]);
