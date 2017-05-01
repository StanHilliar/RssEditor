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

    $scope.errorMsgs                = [];
    $scope.templateErrorMsgs        = [];
    $scope.availableSEmailGroups    = [];
    $scope.availableEmailHeaders    = [];
    $scope.availableEmailFooters    = [];
    $scope.availableSegments        = [];
    $scope.availableSecurityCircles = [];


    $scope.availableModules         = [];
    $scope.availableDropzoneModules = [];
    $scope.selectedDropzoneModules  = [];

    $scope.selected = []; 
    $scope.availableModule = []; 
    $scope.selectedModule = []; 
    $scope.selectedEmailGroup = ''; 
   // $scope.selectedSegments = []; 

    $scope.entity                       = {};
    $scope.entity.name                  = '';
    $scope.entity.type                  = 'BBMObject1';
    $scope.entity.header                =  '';
    $scope.entity.preBody               = '';
    $scope.entity.postBody              = '';
    $scope.entity.footer                = '';
    $scope.entity.eloquaFolder          = $meanConfig.eloqua.emailFolder;
    $scope.entity.eloquaCampaignFolder  = $meanConfig.eloqua.campaignFolder;
    $scope.entity.eloquaFooter          = $meanConfig.eloqua.footer;
    $scope.entity.eloquaHeader          = $meanConfig.eloqua.header;
    $scope.entity.bounceBackAddress     = $meanConfig.eloqua.bounceBackAddress;
    $scope.entity.replyToName           = $meanConfig.eloqua.replyToName;
    $scope.entity.replyToEmail          = $meanConfig.eloqua.replyToEmail;
    $scope.entity.eloquaEmailGroup      = '';
    $scope.entity.segments              = [];
    $scope.entity.circles               = [];
    $scope.entity.modules               = [];
    $scope.entity.dropzoneModules       = [];
    $scope.template                     = '';

    $scope.newsletterExsists  = false;
    $scope.selectedSegments   = [];
    $scope.selectedModules    = [];
    $scope.availableEmailEncodings = [];
    
    $scope.loading = {};
    
    $scope.loading.entity   = false;
    $scope.loading.modules = false;
    $scope.loading.segments = false;
    $scope.loading.groups = false;
    $scope.loading.encoding = false;
    $scope.loading.circles = false;
    
    $scope.saveInProgress     = false;
    $scope.hasDropzone        = false;

    if($stateParams.newsletterid)
    {
      $scope.newsletterExsists = true;
        
      console.log('loadNewsletterEntitiy');
      $scope.loading.entity = true;
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

        if(!$scope.entity.dropzoneModules)
        {
          $scope.entity.dropzoneModules = [];
        }

        var _template = $scope.entity.header;
        for(var i = 0; i < $scope.entity.modules.length; i++)
        {
          if($scope.entity.modules[i].placeholderType == 'DROPZONE')
          {
            _template += '{{'+$scope.entity.modules[i].moduleIdentifier+'}}';
            $scope.hasDropzone = true;
          }
          else
          {
            _template += '{{MODULE_'+$scope.entity.modules[i].moduleIdentifier+'}}';
          }
          if( $scope.entity.modules[i].postModule)
          {
            _template += $scope.entity.modules[i].postModule;
          }
        }
        _template += $scope.entity.footer;

        $scope.template = _template;

        removeSelectedSegmentsfromAvailabeleSegments();
        removeSelectedCirclesfromAvailabeleCircles();
        removeSelectedDropzoneModulesfromAvailabeleDropzoneModules();
        $scope.loading.entity = false;
      });     
    }

    $scope.loading.segments = true;
    Eloqua.segments().query({company: MeanUser.company.id, id: $meanConfig.eloqua.segmentFolder}, function(segments)
    {
      //console.log(segments);
      for(var i = 0; i < segments.length; i++)
      {
        $scope.availableSegments.push({id: segments[i].id, name: segments[i].name});        
      }

      removeSelectedSegmentsfromAvailabeleSegments();
      removeSelectedDropzoneModulesfromAvailabeleDropzoneModules();
      $scope.loading.segments = false;
    }, 
    function(error)
    {
      $scope.errorMsgs.push({param:'segments', msg:'error while loading the segments'})
      $scope.loading.segments = false;
    });

    $scope.loading.groups = true;
    Eloqua.emailGroups().query({company: MeanUser.company.id}, function(emailGroups)
    {
      console.log(emailGroups);
      $scope.availableSEmailGroups = emailGroups;
      $scope.loading.groups = false;
    }, 
    function(error)
    {
      $scope.errorMsgs.push({param:'emailGroups', msg:'error while loading the emailGroups'})
      $scope.loading.groups = false;
    });

    $scope.loading.encoding = true;
    Eloqua.eloquaEmailEncoding().query({company: MeanUser.company.id}, function(emailEncodings)
    {
      console.log(emailEncodings);
      $scope.availableEmailEncodings = emailEncodings;
      $scope.loading.encoding = false;
    }, 
    function(error)
    {
      $scope.errorMsgs.push({param:'emailEncodings', msg:'error while loading the emailEncodings'})
      $scope.loading.encoding = false;
    });

    $scope.loading.headers = true;
    Eloqua.emailHeaders().query({company: MeanUser.company.id}, function(emailHeaders)
    {
      console.log(emailHeaders);
      $scope.availableEmailHeaders = emailHeaders;
      $scope.loading.headers = false;
    }, 
    function(error)
    {
      $scope.errorMsgs.push({param:'emailHeaders', msg:'error while loading the emailHeaders'})
      $scope.loading.headers = false;
    });

    $scope.loading.footers = true;
    Eloqua.emailFooters().query({company: MeanUser.company.id}, function(emailFooters)
    {
      console.log(emailFooters);
      $scope.availableEmailFooters = emailFooters;
      $scope.loading.footers = false;
    }, 
    function(error)
    {
      $scope.errorMsgs.push({param:'emailFooters', msg:'error while loading the emailFooters'})
      $scope.loading.footers = false;
    });

    $scope.loading.circles = true;
    Circles.mineCompany({company: MeanUser.company.id}, function(acl) 
    { 
      $scope.availableSecurityCircles = acl.allowed;
      removeSelectedCirclesfromAvailabeleCircles();
      $scope.loading.circles = false;
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

    function removeSelectedDropzoneModulesfromAvailabeleDropzoneModules()
    {
      var _trash = [];
      for(var i = 0; i < $scope.entity.dropzoneModules.length; i++)
      {
        for(var j = 0; j < $scope.availableDropzoneModules.length; j++)
        {
          if($scope.entity.dropzoneModules[i] == $scope.availableDropzoneModules[j]._id)
          { 
            $scope.moveItem($scope.availableDropzoneModules[j], $scope.availableDropzoneModules, $scope.selectedDropzoneModules);
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
      // console.log('processTemplate');
      var re = /\{\{MODULE_.+\}\}|\{\{DROPZONE_.+\}\}/g;
      var match = '';

      var matches = [];
      $scope.templateErrorMsgs = [];

      var identifier = {};

      while ((match = re.exec($scope.template)) != null) 
      {
          // console.log("match found at " + match.index);
          // console.log(match[0].length);
          // console.log(match);

        
          var moduleIdentifier;
          var placeholderType;

          if(match[0].indexOf('{{MODULE') != -1)
          {
            moduleIdentifier = match[0].substr(9);
            placeholderType = 'MODULE';
          }

          if(match[0].indexOf('{{DROPZONE')!= -1)
          {
            moduleIdentifier = match[0].substr(2);
            placeholderType = 'DROPZONE';
            $scope.hasDropzone = true;
          }
          
          moduleIdentifier = moduleIdentifier.substr(0, moduleIdentifier.length-2); 

          // console.log(moduleIdentifier);

          if(identifier[moduleIdentifier] != true)
          {
            identifier[moduleIdentifier] = true;

            var _positionAlreadyExisits = false;

            for(var i = 0; i < $scope.entity.modules.length; i++)
            {
              if($scope.entity.modules[i].moduleIdentifier == moduleIdentifier)
              {
                _positionAlreadyExisits = true;

                $scope.entity.modules[i].templatePos = match.index;
                if(placeholderType == 'MODULE')
                {
                  $scope.entity.modules[i].templatePosEnd = match.index+moduleIdentifier.length+11;
                }

                if(placeholderType == 'DROPZONE')
                {
                  $scope.entity.modules[i].templatePosEnd = match.index+moduleIdentifier.length+4;
                }

                matches.push($scope.entity.modules[i]);
              }
            } 

            if(!_positionAlreadyExisits)
            {
                var templatePosEnd;
                if(placeholderType == 'MODULE')
                {
                  templatePosEnd = match.index+ moduleIdentifier.length+11;
                }

                if(placeholderType == 'DROPZONE')
                {
                  templatePosEnd = match.index+ moduleIdentifier.length+4;
                }

                matches.push(
                {
                  moduleIdentifier: moduleIdentifier,
                  templatePos: match.index,
                  templatePosEnd: templatePosEnd,
                  _id : '',
                  placeholderType: placeholderType
                });
            } 
          }
          else
          {
            // console.log('DUPLICATE');
            $scope.templateErrorMsgs.push(
            {
              param: 'template',
              msg: 'you cannot use the same module identifier more than once:'+moduleIdentifier,
            });
          }
      }
 
      $scope.entity.modules = matches;

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
          if(!$scope.entity.setEloquaHeaderManually)
          {
            $scope.entity.eloquaHeader = $scope.availableSEmailGroups[i].emailHeaderId;
          }
          if(!$scope.entity.setEloquaFooterManually)
          {
            $scope.entity.eloquaFooter = $scope.availableSEmailGroups[i].emailFooterId;
          }
        }
      }

      var _dropzoneModules = [];
      for(var i = 0; i < $scope.selectedDropzoneModules.length; i++)
      {
        _dropzoneModules.push($scope.selectedDropzoneModules[i]._id);
      }
      console.log(_dropzoneModules);
      
      $scope.entity.dropzoneModules = _dropzoneModules;

      for(var i = 0; i < $scope.entity.modules.length; i++)
      {
        if($scope.entity.modules[i].placeholderType == 'DROPZONE')
        {
          $scope.entity.modules[i]._id = $scope.entity.modules[i].moduleIdentifier;
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
      // console.log('_preSavePrepModules');
      
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

    //  _preSavePrepModules();

      $scope.saveInProgress = true;

      $scope.processTemplate();

    

      var newsletterEntity = new NewsletterEntity($scope.entity);
      newsletterEntity.company = MeanUser.company.id;
      newsletterEntity.$save(function(data, headers) 
      {
  //              $scope.user = {};
//                $scope.users.push(user);
              //  $scope.userError = null;
        $scope.errorMsgs = [];
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
              $scope.errorMsgs = [];
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
      $scope.loading.modules = true;
      EmailModule.query({company: MeanUser.company.id},function(response)
      {
        $scope.availableModules         = response;
        $scope.availableDropzoneModules = response;

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
        $scope.loading.modules = false;
      });
    };

    $scope.listModules();   
  }
]);
