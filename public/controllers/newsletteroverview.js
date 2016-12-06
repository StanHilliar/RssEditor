'use strict';

/* jshint -W098 */
angular.module('mean.emaileditor').controller('NewsletterOverviewController', ['$scope','$compile', '$interpolate', '$sce', 'Global', 'NewsletterEntity', 'MeanUser', '$uibModal',
  function($scope, $compile, $interpolate, $sce, Global, NewsletterEntity, MeanUser, $uibModal) {
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
      //console.log('destroyEntity');

      //console.log(entityId);

      //EmailModule.find({ moduleId: moduleId }).remove().exec();
      
      NewsletterEntity.remove({company: MeanUser.company.id, entityId: entityId}, function(_newsletterEntity)
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
        
      NewsletterEntity.query({company: MeanUser.company.id, entityId: entityId}, function(newsletterEntityArray)
      {
        //console.log(newsletterEntityArray[0]);
          

        delete newsletterEntityArray[0]._id;
        newsletterEntityArray[0].name = newsletterEntityArray[0].name+'_Clone_'+Math.floor(new Date() / 1000);
        newsletterEntityArray[0].company =  MeanUser.company.id;

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


      NewsletterEntity.query({company: MeanUser.company.id},function(response)
      {
        //console.log('list callback');
        //console.log(response);
        $scope.newsletters = response;
      });
    };   

    $scope.list();

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function (newslettterEntity) 
    {
      var modalInstance = $uibModal.open(
      {
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: 'sm',
        resolve: 
        {
          newsletterEntity: function () 
          {
            return newslettterEntity;
          }
        }
      });

      modalInstance.result.then(function (newsLetterEntityId) 
      {
        $scope.destroyEntity(newsLetterEntityId);
      }, 
      function () 
      {
        //console.info('Modal dismissed at: ' + new Date());
      });
    };
  }
]).controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, newsletterEntity) {

  $scope.newsletter = newsletterEntity;


  $scope.ok = function () 
  {
    $uibModalInstance.close($scope.newsletter._id);
  };

  $scope.cancel = function () 
  {
    $uibModalInstance.dismiss('cancel');
  };
});;
