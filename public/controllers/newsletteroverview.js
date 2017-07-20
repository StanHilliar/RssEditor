'use strict';

/* jshint -W098 */
angular.module('mean.emaileditor').controller('NewsletterOverviewController', ['$scope', '$stateParams','$mdDialog','$compile', '$interpolate', '$sce', 'Global', 'NewsletterEntity', 'MeanUser',
  function($scope, $stateParams, $mdDialog, $compile, $interpolate, $sce, Global, NewsletterEntity, MeanUser) {
    $scope.global = Global;
    $scope.package = 
    {
      name: 'emaileditor'
    };

    $scope.company = $stateParams.company;

    $scope.your_variable = '';
    $scope.rssContent = 'omg';
    $scope.test1234 = 'omg';


    $scope.destroyEntity = function(entityId)
    {
      //console.log('destroyEntity');

      //console.log(entityId);

      //EmailModule.find({ moduleId: moduleId }).remove().exec();
      
      NewsletterEntity.remove({company: $stateParams.company, entityId: entityId}, function(_newsletterEntity)
      {
        //console.log('destroyModule callback');
        //console.log(_newsletterEntity);
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

    $scope.cloneEntity = function(entityId)
    {
      //console.log('cloneEntity');

      //console.log(entityId);

      //EmailModule.find({ moduleId: moduleId }).remove().exec();
        
      NewsletterEntity.query({company: $stateParams.company, entityId: entityId}, function(newsletterEntityArray)
      {
        //console.log(newsletterEntityArray[0]);
        
        delete newsletterEntityArray[0]._id;
        newsletterEntityArray[0].name = newsletterEntityArray[0].name+'_Clone_'+Math.floor(new Date() / 1000);
        newsletterEntityArray[0].company =  $stateParams.company;

        //console.log(newsletterEntityArray[0]);
        newsletterEntityArray[0].$save(function(data, headers) 
        {
          $scope.errorMsgs = null;
          $scope.saveInProgress = false;
          $scope.newsletters.push(data);
        }, function(data, headers) 
        {
            $scope.errorMsgs = data.data;
            $scope.saveInProgress = false;
        });

      });
      
    };

    $scope.list = function()
    {
      //console.log('listNewsletterEntitiy');

      NewsletterEntity.query({company: $stateParams.company},function(response)
      {
        //console.log('list callback');
        //console.log(response);
        $scope.newsletters = response;
      });
    };   

    $scope.list();

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function (ev, newslettterEntity) 
    {
      var confirm = $mdDialog.confirm()
          .title('Delete this entity?')
          .textContent('name: '+newslettterEntity.name)
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

      $mdDialog.show(confirm).then(function() 
      {
        $scope.destroyEntity(newsLetterEntityId);
      }, 
      function() 
      {
        console.info('Modal dismissed at: ' + new Date());
      });
    };
  }
]);
