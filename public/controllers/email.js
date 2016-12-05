'use strict';

/* jshint -W098 */
angular.module('mean.emaileditor').controller('EmailOverviewController', ['$scope','$compile', '$interpolate', '$sce', '$location', 'Global', 'NewsletterEntity', 'Email',
  function($scope, $compile, $interpolate, $sce, $location, Global, NewsletterEntity, Email) {
    $scope.global = Global;
    $scope.package = 
    {
      name: 'emaileditor'
    };

    $scope.your_variable = '';
    $scope.rssContent = 'omg';
    $scope.test1234 = 'omg';
    
    $scope.emails = {};

    $scope.now = new Date();


    $scope.destroyEntity = function(newsletterId, entityId)
    {
      console.log('destroyEntity');

      console.log(entityId);

      //EmailModule.find({ moduleId: moduleId }).remove().exec();
      
      Email.remove({emailId: entityId}, function(_newsletterEntity)
      {
        console.log('destroyModule callback');
        console.log(_newsletterEntity);
        var _newsletterEntity = -1;
        for(var i  = 0; i < $scope.emails[newsletterId].length; i++)
        {
          if($scope.emails[newsletterId][i]._id == entityId)
          {
            _newsletterEntity = i;
          }
        }
        $scope.emails[newsletterId].splice(_newsletterEntity ,1);
        //_emailModule.remove();
     });
    };


    $scope.listEntities = function()
    {
      console.log('listNewsletterEntitiy');

      NewsletterEntity.query({},function(response)
      {
        console.log('list callback');
        console.log(response);
        for(var i = 0; i < response.length; i++)
        {
          response[i].open = false;
        }
        $scope.newsletters = response;
      });
    };  

    $scope.list = function()
    {
      console.log('listNewsletterEntitiy');

      Email.query({},function(response)
      {
        console.log('list callback');
        console.log(response);

        for(var i = 0; i < response.length; i++)
        {
          if($scope.emails[response[i].newsletterEntity] == null)
          {
            $scope.emails[response[i].newsletterEntity] = [];
          }

          response[i].scheduledDate = new Date(response[i].scheduledDate);

          $scope.emails[response[i].newsletterEntity].push(response[i])
        }
      });
    };   

    $scope.go = function ( path ) 
    {
      console.log(path);
      $location.path('/emaileditor/email/create/'+path );
    };

    $scope.listEntities();
    $scope.list();

  }
]);
