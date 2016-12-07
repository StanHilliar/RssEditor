'use strict';

/* jshint -W098 */
angular.module('mean.emaileditor').controller('EmailOverviewController', ['$scope','$compile', '$interpolate', '$sce', '$location', 'Global', 'NewsletterEntity', 'Email', 'MeanUser',
  function($scope, $compile, $interpolate, $sce, $location, Global, NewsletterEntity, Email, MeanUser) {
    $scope.global = Global;
    $scope.package = 
    {
      name: 'emaileditor'
    };

    // $scope.your_variable = '';
    // $scope.rssContent = 'omg';
    // $scope.test1234 = 'omg';
    
    $scope.emails = {};
    $scope.noOfEmailsPerEntity = {};

    $scope.now = new Date();
    $scope.loadingEntites = false;
    $scope.loadingEmails = false;
    var tmpEmails = [];

    $scope.destroyEntity = function(newsletterId, entityId)
    {
      //console.log('destroyEntity');

      //console.log(entityId);

      //EmailModule.find({ moduleId: moduleId }).remove().exec();
      
      Email.remove({company: MeanUser.company.id, emailId: entityId}, function(_newsletterEntity)
      {
        //console.log('destroyModule callback');
        //console.log(_newsletterEntity);
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

    $scope.clickEntity = function(id)
    {
      console.log('clickEntity('+id+')');
      // $scope.newsletters[id].open = !$scope.newsletters[id].open
      $scope.emails[id] = tmpEmails[id];
      // newsletter.open=!newsletter.open
    };

    $scope.listEntities = function()
    {
      $scope.loadingEntites = true;
      //console.log('listNewsletterEntitiy');

      NewsletterEntity.query({company: MeanUser.company.id}, function(response)
      {
        //console.log('list callback');
        //console.log(response);
        for(var i = 0; i < response.length; i++)
        {
          response[i].open = false;
        }
        $scope.newsletters = response;
        $scope.loadingEntites = false;
      });
    };  

    $scope.list = function()
    {
      $scope.loadingEmails = true;
      //console.log('listNewsletterEntitiy');

      Email.query({company: MeanUser.company.id},function(response)
      {
        //console.log('list callback');
        //console.log(response);
        
        for(var i = 0; i < response.length; i++)
        {
          if(tmpEmails[response[i].newsletterEntity] == null)
          {
            tmpEmails[response[i].newsletterEntity] = [];
          }

          response[i].scheduledDate = new Date(response[i].scheduledDate);

          tmpEmails[response[i].newsletterEntity].push(response[i])
        }


        for(var entityId in tmpEmails)
        {
          $scope.noOfEmailsPerEntity[entityId] = tmpEmails[entityId].length;
        }

        $scope.loadingEmails = false;
        // $scope.emails = tmpEmails;
      });
    };   

    $scope.go = function ( path ) 
    {
      //console.log(path);
      $location.path('/emaileditor/email/create/'+path );
    };

    $scope.listEntities();
    $scope.list();
  }
]);
