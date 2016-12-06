'use strict';

/* jshint -W098 */
angular.module('mean.emaileditor').controller('NewsletterEditController', ['$scope','$stateParams','$compile', '$interpolate', '$sce', 'Global', 'NewsletterEntity', 'EmailModule', 'Eloqua', 'Circles', 'MeanUser', '$meanConfig',
  function($scope, $stateParams, $compile, $interpolate, $sce, Global, NewsletterEntity, EmailModule, Eloqua, Circles, MeanUser, $meanConfig) 
  {
    $scope.global = Global;
    $scope.package = 
    {
      name: 'emaileditor'
    };

    $scope.your_variable = '';
    $scope.rssContent = 'omg';
    $scope.test1234 = 'omg';

    $scope.availableSEmailGroups = [];
    $scope.availableSegments = [];
    $scope.availableSecurityCircles = [];
    /* [
      {_id: '1', name: 'test1'},
      {_id: '2', name: 'aaa'},
      {_id: '3', name: 'bbb'}
    ];    */

    $scope.availableModules = [];

    $scope.selected = []; 
    $scope.availableModule = []; 
    $scope.selectedModule = []; 
    $scope.selectedEmailGroup = ''; 
   // $scope.selectedSegments = []; 

    $scope.entity = {};
    $scope.entity.name = '';
    $scope.entity.type = 'BBMObject1';
    $scope.entity.header = '';
    $scope.entity.preBody = '';
    $scope.entity.postBody = '';
    $scope.entity.footer = '';
    $scope.entity.eloquaFolder = $meanConfig.eloqua.emailFolder;
    $scope.entity.eloquaCampaignFolder = $meanConfig.eloqua.campaignFolder;
    $scope.entity.eloquaFooter = $meanConfig.eloqua.footer;
    $scope.entity.eloquaHeader = $meanConfig.eloqua.header;
    $scope.entity.bounceBackAddress = $meanConfig.eloqua.bounceBackAddress;
    $scope.entity.replyToName = $meanConfig.eloqua.replyToName;
    $scope.entity.replyToEmail = $meanConfig.eloqua.replyToEmail;
    $scope.entity.eloquaEmailGroup = '';
    $scope.entity.segments = [];
    $scope.entity.circles = [];
    $scope.entity.modules = [];
    $scope.template = '';

    $scope.newsletterExsists = false;
    $scope.selectedSegments = [];
    $scope.selectedModules = [];

    $scope.saveInProgress = false;

    if($stateParams.newsletterid)
    {
      $scope.newsletterExsists = true;
        
      console.log('loadNewsletterEntitiy');

      NewsletterEntity.query({company: MeanUser.company.id, entityId: $stateParams.newsletterid}, function(newsletterEntityArray)
      {
        $scope.entity = newsletterEntityArray[0];

        if($scope.entity.bounceBackAddress == undefined || $scope.entity.bounceBackAddress == null)
        {
          $scope.entity.bounceBackAddress = $meanConfig.eloqua.bounceBackAddress;
        } 

        if($scope.entity.replyToName == undefined || $scope.entity.replyToName == null)
        {
          $scope.entity.replyToName = $meanConfig.eloqua.replyToName;
        } 
        
        if($scope.entity.replyToEmail == undefined || $scope.entity.replyToEmail == null)
        {
          $scope.entity.replyToEmail = $meanConfig.eloqua.replyToEmail;
        }

        var _template = $scope.entity.header;
        for(var i = 0; i < $scope.entity.modules.length; i++)
        {
          _template += '{{MODULE_'+$scope.entity.modules[i].moduleIdentifier+'}}';
          if( $scope.entity.modules[i].postModule)
          {
            _template += $scope.entity.modules[i].postModule;
          }
        }
        _template += $scope.entity.footer;

        $scope.template = _template;

        removeSelectedSegmentsfromAvailabeleSegments();
        removeSelectedCirclesfromAvailabeleCircles();

      });     
    }

    Eloqua.segments().query({company: MeanUser.company.id, id: $meanConfig.eloqua.segmentFolder}, function(segments)
    {
      //console.log(segments);
      for(var i = 0; i < segments.length; i++)
      {
        $scope.availableSegments.push({id: segments[i].id, name: segments[i].name});
      }
      removeSelectedSegmentsfromAvailabeleSegments();
    });  

    Eloqua.emailGroups().query({company: MeanUser.company.id}, function(emailGroups)
    {
      console.log(emailGroups);
      $scope.availableSEmailGroups = emailGroups;
    });

    Circles.mineCompany({company: MeanUser.company.id}, function(acl) 
    { 
      $scope.availableSecurityCircles = acl.allowed;
      removeSelectedCirclesfromAvailabeleCircles();
    });

    function removeSelectedSegmentsfromAvailabeleSegments()
    {
      var _trash = [];
      for(var i = 0; i < $scope.entity.segments.length; i++)
      {
        for(var j = 0; j < $scope.availableSegments.length; j++)
        {
          if($scope.entity.segments[i].id == $scope.availableSegments[j].id)
          { 
            $scope.moveItem($scope.availableSegments[j], $scope.availableSegments, _trash);
            break;
          }
        }
      }
    }  

    function removeSelectedCirclesfromAvailabeleCircles()
    {
      var _trash = [];
      for(var i = 0; i < $scope.entity.circles.length; i++)
      {
        for(var j = 0; j < $scope.availableSecurityCircles.length; j++)
        {
          if($scope.entity.circles[i] == $scope.availableSecurityCircles[j])
          { 
            $scope.moveItem($scope.availableSecurityCircles[j], $scope.availableSecurityCircles, _trash);
            break;
          }
        }
      }
    }
   

    $scope.moveItem = function(item, from, to) 
    {
        console.log('Move item   Item: '+item+' From:: '+from+' To:: '+to);
        //Here from is returned as blank and to as undefined

        var idx=from.indexOf(item);
        if (idx != -1) 
        {
            from.splice(idx, 1);
            to.push(item);      
        }
    };  


    $scope.moveAll = function(from, to) 
    {
      console.log('Move all  From:: '+from+' To:: '+to);
      //Here from is returned as blank and to as undefined

      angular.forEach(from, function(item) {
        to.push(item);
      });
      from.length = 0;
    };                

    $scope.processTemplate = function()
    {
      console.log('processTemplate');
      var re = /\{\{MODULE_.+\}\}/g;
      var match = '';

      var matches = [];

      while ((match = re.exec($scope.template)) != null) 
      {
          console.log("match found at " + match.index);
          console.log(match[0].length);
          console.log(match);

          var _pos = match[0].substr(9);
          _pos = _pos.substr(0, _pos.length-2);
          console.log(_pos);

          var _positionAlreadyExisits = false;

          
          
          for(var i = 0; i < $scope.entity.modules.length; i++)
          {
            if($scope.entity.modules[i].moduleIdentifier == _pos)
            {
              _positionAlreadyExisits = true;

              $scope.entity.modules[i].templatePos = match.index;
              $scope.entity.modules[i].templatePosEnd = match.index+_pos.length+11;

              matches.push($scope.entity.modules[i]);
            }
          }


          if(!_positionAlreadyExisits)
          {
              matches.push(
              {
                moduleIdentifier: _pos,
                templatePos: match.index,
                templatePosEnd: match.index+_pos.length+11,
                _id : ''
              });
          }
      }
 
      $scope.entity.modules = matches;
    /*
      while ((match = re.exec($scope.template)) != null) 
      {
          console.log("match found at " + match.index);
          console.log(match[0].length);
          console.log(match);

          var _pos = match[0].substr(9);
          _pos = _pos.substr(0, _pos.length-2);
          console.log(_pos);

          var _positionAlreadyExisits = false;
          matches.push(_pos);
          
          for(var i = 0; i < $scope.entity.modules.length; i++)
          {
            if($scope.entity.modules[i].moduleIdentifier == _pos)
            {
              _positionAlreadyExisits = true;
              console.log('already exisits');
            }
          }

          if(!_positionAlreadyExisits)
          {
              $scope.entity.modules.push(
              {
                moduleIdentifier: _pos,
                templatePos: match.index,
                _id : ''
              });
          }
      }
      console.log('--------------------------------------------');

      console.log(matches);
      
      var _removeIndicies = [];
      for(var i = 0; i < $scope.entity.modules.length; i++)
      {
        console.log('check '+$scope.entity.modules[i].moduleIdentifier);
        if(!contains(matches, $scope.entity.modules[i].moduleIdentifier))
        {
          
          console.log('does not contain '+$scope.entity.modules[i].moduleIdentifier);
          console.log('remove'+ i);
          _removeIndicies.push(i);

        }
      }

      console.log(_removeIndicies);


      for(var i = _removeIndicies.length -1; i >= 0; i--)
      {
        console.log('remove index '+_removeIndicies[i]);
        $scope.entity.modules.splice(_removeIndicies[i], 1);
      }

      */


      var _currentPos = 0;
    
      if($scope.entity.modules.length > 0)
      {

        $scope.entity.header = $scope.template.substring(0, $scope.entity.modules[0].templatePos);
        _currentPos = $scope.entity.modules[0].templatePosEnd;
        $scope.entity._currentPos = _currentPos;
      }


      if($scope.entity.modules.length > 1)
      {
        for(var i = 0; i < $scope.entity.modules.length - 1; i++)
        {

          $scope.entity.modules[i].postModule = $scope.template.substring(_currentPos, $scope.entity.modules[i+1].templatePos);
          _currentPos = $scope.entity.modules[i+1].templatePosEnd;
          $scope.entity.currentPos = _currentPos;
         
        }
      }

      if($scope.entity.modules.length > 0)
      {
        $scope.entity.footer = $scope.template.substr(_currentPos);
      }

      for( var i = 0; i < $scope.availableSEmailGroups.length; i++)
      {
        if($scope.availableSEmailGroups[i].id == $scope.entity.eloquaEmailGroup)
        {
          $scope.entity.eloquaHeader = $scope.availableSEmailGroups[i].emailHeaderId;
          $scope.entity.eloquaFooter = $scope.availableSEmailGroups[i].emailFooterId;
        }
      }


      

      console.log($scope.entity);
    }

    function contains(a, obj) 
    {
      //console.log('contains');
      for (var i = 0; i < a.length; i++) 
      {
        //console.log(a[i] +'=='+ obj);
        if (a[i] === obj) 
        {
            return true;
        }
      }

      return false;
    }


    function _preSavePrepModules()
    {
      var _modules = [];
      for(var i = 0; i < $scope.selectedModules.length; i++)
      {
        _modules.push($scope.selectedModules[i]._id);
      }
      
      $scope.entity.modules = _modules;

      //$scope.entity.modules = [];
    }


    $scope.save = function()
    {
      console.log('saveNewsletterEntitiy');

//      _preSavePrepModules();
      $scope.saveInProgress = true;

      $scope.processTemplate();
      var newsletterEntity = new NewsletterEntity($scope.entity);
      newsletterEntity.company = MeanUser.company.id;
      newsletterEntity.$save(function(data, headers) 
      {
  //              $scope.user = {};
//                $scope.users.push(user);
              //  $scope.userError = null;
        $scope.errorMsgs = null;
        $scope.saveInProgress = false;
        $scope.newsletterExsists = true;
        $scope.entity = data;
      }, function(data, headers) 
      {
          $scope.errorMsgs = data.data;
          $scope.saveInProgress = false;
      });
      /*NewsletterEntity.create($scope.entity).then(function(response)
      {
        console.log('save callback');
        console.log(response);
      });*/
    };

    $scope.update = function()
    {
      console.log('updateNewsletterEntitiy');
      $scope.saveInProgress = true;

    //  _preSavePrepModules();
        $scope.processTemplate();
        $scope.entity.company = MeanUser.company.id;
        $scope.entity.$save(function(data, headers) 
        {
  //              $scope.user = {};
//                $scope.users.push(user);
              //  $scope.userError = null;
              $scope.errorMsgs = null;
              $scope.saveInProgress = false;         
            }, function(data, headers) 
            {
              $scope.errorMsgs = data.data;
            //    $scope.userError = data.data;
              $scope.saveInProgress = false;
            });
      /*NewsletterEntity.create($scope.entity).then(function(response)
      {
        console.log('save callback');
        console.log(response);
      });*/
    };   

    $scope.listModules = function()
    {
      //console.log('list Email Modules');

      EmailModule.query({company: MeanUser.company.id},function(response)
      {
        $scope.availableModules  = response;

        for(var i = 0; i < $scope.entity.modules.length; i++)
        {
          for(var j = 0; j < $scope.availableModules.length; j++)
          {
            if($scope.entity.modules[i] == $scope.availableModules[j]._id)
            { 
              $scope.moveItem($scope.availableModules[j], $scope.availableModules, $scope.selectedModules);
              break;
            }
          }
        }
      });
    };

    $scope.listModules();   


  }
]);
