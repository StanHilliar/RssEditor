'use strict';

/* jshint -W098 */
angular.module('mean.emaileditor').controller('EmaileditorController', ['$scope', '$q', '$stateParams', '$compile', '$interpolate', '$sce', 'Global', 'Emaileditor', 'NewsletterEntity', 'Email', 'Eloqua', 'XMLFeed',
  function($scope, $q,  $stateParams, $compile, $interpolate, $sce, Global, Emaileditor, NewsletterEntity, Email, Eloqua, XMLFeed) 
  {
    $scope.global = Global;
    $scope.package = 
    {
      name: 'emaileditor'
    };

    var dndElementIdentifier = 'dndelement';
    var clickableElementIdentifier = 'clickableElement';
    $scope.modalInstance = '';
    var modalInstance = null;
    var entity = {};

    var EloquaEmail = Eloqua.eloquaEmail();
    var EloquaCampaign = Eloqua.eloquaCampaign();
    var EloquaTestEmail = Eloqua.eloquaTestEmail();
    var EloquaCampaignUnschedule = Eloqua.eloquaCampaignUnschedule();
    var storedEloquaEmail = null;
    var storedEloquaCampaign = null;
 

    var emailId = null;
    $scope.storedEmail = null;

    $scope.feedURL = 'http://feeds.wired.com/wired/index';
    
    $scope.rssData =  [] ;
    $scope.adData =  [] ;

    $scope.EmailName = '';

    $scope.your_variable = '';
    $scope.rssContent = 'omg';
    $scope.test1234 = 'omg';

    $scope.showSendingOptions = true;

    $scope.feedPositions  = [];
    $scope.skipedEntries  = [];
    $scope.skipedEmailModules  = {};

    $scope.firstInit = true;
    $scope.loading = false;
    var feeds = [];

    $scope.newsletterEntity = '000';
    
    /*
    $scope.emailSegements = 
      [
        { 
          id: 0,
          label: 'Segment 1',
          
        },
        { 
          id: 1,
          label: 'Segment 2'
        } 
      ];
      
    $scope.emailSegement = $scope.emailSegements[0];*/
    $scope.segment = '';

    $scope.isEditMode = true;
    $scope.isEmailModuleSelected = false;
    $scope.currentEmailModule = 0;

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.popup1 = {
      opened: false
    };

    $scope.format = 'dd.MM.yyyy';

    $scope.maxDate = new Date(2020, 5, 22);
    
    $scope.today = function() {
      $scope.dt = new Date();
    };       

    $scope.setinXDays = function(days) 
    {
      var oldDateObj = new Date();
      $scope.dt = new Date(oldDateObj.getTime() + days*86400000);;
    };    

    $scope.setTimeinXMinutes = function(minutes) 
    {
      var oldDateObj = $scope.dt;
      $scope.dt = new Date(oldDateObj.getTime() + minutes*60000);
      //$scope.dt = (newDateObj.getHours()<10?'0':'')+newDateObj.getHours()+':'+ (newDateObj.getMinutes()<10?'0':'')+ newDateObj.getMinutes();
    };

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };
   
    $scope.minDate = new Date();

    $scope.api = 
    {
        scope: $scope
    }

    $scope.emailTemplates = Emaileditor.getEmailTemplate().query({entityId: $stateParams.newsletterid}, function(newsletterEntityArray)
    {
      console.log('entity loaded');
      $scope.entity =newsletterEntityArray[0];

      if($scope.segment == '')
      {
        $scope.segment = $scope.entity.segments[0].id;
      }
      $scope.emailTemplates =newsletterEntityArray[0];

      $scope.emailTemplates.header = $scope.emailTemplates.header.replace(/(\r\n|\n|\r)/gm,"");
      $scope.emailTemplates.footer = $scope.emailTemplates.footer.replace(/(\r\n|\n|\r)/gm,"");


      $scope.your_variable = $scope.emailTemplates.header + $scope.emailTemplates.footer;
    //  console.log( $scope.your_variable);
      if($stateParams.emailid != null)
      {
        emailId = $stateParams.emailid;
        Email.query({emailId: $stateParams.emailid}, function(emails)
        {
          var email = emails[0];
          $scope.storedEmail = emails[0];

          console.log('load email cb');
          if(email !=  null)
          {
            $scope.EmailName = email.name;
            $scope.EmailSubject = email.subject;
            $scope.dt = new Date(email.scheduledDate);
            //$scope.dt = email.scheduledTime
            $scope.rssData = email.data;
            $scope.feedPositions = email.positions;
            // status: 'draft'
          }

          console.log($scope.storedEmail);
          console.log($scope.storedEmail.eloquaEmail);


          $scope.initAfterLoad();
        });
      }
      else
      {
        $scope.EmailName = $scope.entity.name+'_'+($scope.minDate.getYear()-100)+''+($scope.minDate.getMonth()<9?'0':'')+''+($scope.minDate.getMonth()+1)+''+($scope.minDate.getDate()<9?'0':'')+''+($scope.minDate.getDate()+1)+'_Username';
        $scope.EmailName = $scope.EmailName.replace(/ /gm, '');

        $scope.init();
      }
    });    

    
    /*
    $scope.emailTemplates = Emaileditor.getEmailTemplate().get({ param1: '123'}, function()
    {
      console.log('EmailServicegetAllEmails() callback');
      console.log($scope.emailTemplates);
      
      $scope.your_variable = $scope.emailTemplates.source+$scope.emailTemplates.source2;
    }); */

    $scope.setMode = function()
    {
      console.log('setMode '+$scope.isEditMode);    
      $scope.api.setMode($scope.isEditMode);

      
      if($scope.isEditMode)
      {
        $scope.your_variable  = $scope.generateEmail($scope.isEditMode);
        $scope.api.reinitSortable();
      }
      else
      {
        $scope.checkAds(function()
        {
          $scope.your_variable  = $scope.generateEmail($scope.isEditMode);
        });
      }
    }

    //depricated
    $scope.previewEmail = function()
    {
      console.log('previewEmail');
      var _previewEmail = $scope.emailTemplates.header;

      _previewEmail += $scope.emailTemplates.footer;

      //var w = window.open();
      scope.checkAds(function()
      {
        $scope.api.setMode(false);
        $scope.your_variable  = $scope.generateEmail(false);
      });
    };  

    $scope.saveEmail = function(cb)
    {
      console.log('saveEmail');
      console.log($scope.rssData);
      $scope.saveInProgress = true;

      var myData = [];
      for(var i = 0; i < $scope.rssData.length; i++)
      {
        myData[i] = {};
        myData[i].state =  $scope.rssData[i].state;
        myData[i].numberOfEntries =  $scope.rssData[i].numberOfEntries;
        myData[i].data = $scope.rssData[i].data;
      }
      
      console.log($scope.storedEmail);

      if($scope.storedEmail != null)
      {
        console.log('storedEmail NOT null');
        $scope.storedEmail.name = $scope.EmailName;
        $scope.storedEmail.subject = $scope.EmailSubject;
        $scope.storedEmail.scheduledDate = $scope.dt;
        $scope.storedEmail.scheduledTime = $scope.dt;
        $scope.storedEmail.positions =  $scope.feedPositions;
        $scope.storedEmail.data = myData;
        $scope.storedEmail.eloquaFolder         = $scope.entity.eloquaFolder;  
        $scope.storedEmail.eloquaCampaignFolder = $scope.entity.eloquaCampaignFolder; 
        $scope.storedEmail.eloquaFooter= $scope.entity.eloquaFooter;
        $scope.storedEmail.eloquaHeader= $scope.entity.eloquaHeader;
      }
      else
      {
        console.log('storedEmail == null');
        $scope.storedEmail = new Email(
        {
          name: $scope.EmailName,        
          segment: $scope.segment,
          subject: $scope.EmailSubject,
          scheduledDate: $scope.dt,  
          scheduledTime: $scope.dt,
          newsletterEntity: $stateParams.newsletterid,    
          data: myData,  
          eloquaFolder: $scope.entity.eloquaFolder,  
          eloquaCampaignFolder: $scope.entity.eloquaCampaignFolder,  
          eloquaFooter: $scope.entity.eloquaFooter,  
          eloquaHeader: $scope.entity.eloquaHeader,  
          eloquaEmailGroup: $scope.entity.eloquaEmailGroup,  
          positions: $scope.feedPositions,
          status: 'draft'
        });
        console.log($scope.storedEmail);
      }

      $scope.storedEmail.$save(function(data, headers) 
      {
        $scope.module = data;
        $scope.errorMsgs = null;
        $scope.moduleExsists = true;
        saveEloquaEmail(cb);
       
      }, 
      function(data, headers) 
      {
        $scope.errorMsgs = data.data;
        $scope.saveInProgress = false;
        if(cb) return cb();
      });
    };

    function saveEloquaEmail(cb)
    {
        if(storedEloquaEmail == null)
        {
            storedEloquaEmail = new EloquaEmail(
            {
              name: $scope.EmailName,        
              emailId: $scope.storedEmail._id,            
              id: $scope.storedEmail.eloquaEmail,  
              eloquaFolder: $scope.storedEmail.eloquaFolder,
              eloquaHeader: $scope.storedEmail.eloquaHeader,
              eloquaFooter: $scope.storedEmail.eloquaFooter,
              eloquaEmailGroup: $scope.storedEmail.eloquaEmailGroup,
              subject: $scope.storedEmail.subject,
              html: $scope.generateEmail(false)
            });
        }
        else
        {
            storedEloquaEmail.name = $scope.EmailName;        
            storedEloquaEmail.emailId = $scope.storedEmail._id;        
            storedEloquaEmail.id = $scope.storedEmail.eloquaEmail;  
            storedEloquaEmail.eloquaFolder = $scope.storedEmail.eloquaFolder;
            storedEloquaEmail.eloquaHeader = $scope.storedEmail.eloquaHeader;
            storedEloquaEmail.eloquaFooter = $scope.storedEmail.eloquaFooter;
            storedEloquaEmail.eloquaEmailGroup = $scope.storedEmail.eloquaEmailGroup;
            storedEloquaEmail.subject = $scope.storedEmail.subject;
            storedEloquaEmail.html = $scope.generateEmail(false);
        }

        storedEloquaEmail.$save(function(data, headers) 
        {
          console.log('storeCB');
          console.log(data);
          $scope.module = data;
          $scope.errorMsgs = null;
          $scope.moduleExsists = true;
          $scope.saveInProgress = false;
          $scope.storedEmail.eloquaEmail = data.id;
          console.log('iD -------> '+$scope.storedEmail.eloquaEmail);
          if(cb) return cb();
        }, 
        function(data, headers) 
        {
          $scope.errorMsgs = data.data;
          $scope.saveInProgress = false;
          if(cb) return cb();
        });
    }
    

    $scope.sendEmailRightNow = function()
    {
      console.log('sendEmailRightNow');
      $scope.setinXDays(0);
      $scope.setTimeinXMinutes(1);
      $scope.scheduleEmail();
      /*if($scope.storedEmail.modified)
      {
         console.log('MODIFIED ---------');
      }
      else
      {
        
         console.log('not MODIFIED ---------');
      }*/
    };

    $scope.scheduleEmail = function()
    {
      console.log('scheduleEmail');
      $scope.scheduleInProgress = true;

      $scope.saveEmail(function()
      {
      
        if(storedEloquaCampaign == null)
        {
            storedEloquaCampaign = new EloquaCampaign();
        }
          
        storedEloquaCampaign.name           = $scope.EmailName;        
        storedEloquaCampaign.emailId        = $scope.storedEmail._id;   
        storedEloquaCampaign.id             = $scope.storedEmail.eloquaCampaign;  
        storedEloquaCampaign.eloquaFolder   = $scope.storedEmail.eloquaCampaignFolder;
        storedEloquaCampaign.eloquaSegment  = $scope.storedEmail.segment;
        storedEloquaCampaign.eloquaEmail    = $scope.storedEmail.eloquaEmail; 

        var startAt = new Date($scope.storedEmail.scheduledDate);
        var endAt = new Date(startAt.getTime() + 86400000);

        storedEloquaCampaign.startAt        = Math.ceil(startAt.getTime() / 1000); 
        storedEloquaCampaign.endAt          = Math.ceil(endAt.getTime()   / 1000); 

        storedEloquaCampaign.$save(function(data, headers) 
        {
          console.log('storeCampaignCB');
          console.log(data);
          $scope.module = data;
          $scope.errorMsgs = null;
          $scope.scheduleInProgress = false;
          $scope.storedEmail.eloquaCampaign = data.id;
          $scope.storedEmail.status = 'active';
          console.log('campaign iD -------> '+$scope.storedEmail.eloquaCampaign);
        }, 
        function(data, headers) 
        {
          $scope.errorMsgs = data.data;
          $scope.scheduleInProgress = false;
        });

        /*
        $scope.checkAds(function()
        {
          var _email = $scope.generateEmail(false);

          Emaileditor.saveEmail(
          {
            source: _email,
            segement: $scope.emailSegement,
            name: $scope.EmailName,
            subject: $scope.EmailSubject,
          }).then(function(response)
          {
            console.log('saveEmail callback');
            console.log(response);
          });
        });*/
      });
    };   

    $scope.unscheduleEmail = function()
    {
      $scope.scheduleInProgress = true;
      var campaign =  new EloquaCampaignUnschedule();
      campaign.id = $scope.storedEmail.eloquaCampaign; 
      campaign.emailId   = $scope.storedEmail._id;    
      campaign.$save(function(data, headers) 
      {
        console.log('storeCampaignCB');
 
        $scope.errorMsgs = null;
        $scope.scheduleInProgress = false;
        $scope.storedEmail.status = 'draft';
      }, 
      function(data, headers) 
      {
        $scope.errorMsgs = data.data;
        $scope.scheduleInProgress = false;
        });
    };

    $scope.sendTestEmail = function()
    {
      $scope.testSendingInProgress = true;
      var campaign =  new EloquaTestEmail();
      campaign.emailAddresses = $scope.testEmailAddresses; 
      campaign.eloquaEmailId   = $scope.storedEmail.eloquaEmail;    
      campaign.$save(function(data, headers) 
      {
        console.log('EloquaTestEmail');
 
        $scope.errorMsgs = null;
        $scope.testSendingInProgress = false;
        $scope.storedEmail.status = 'draft';
      }, 
      function(data, headers) 
      {
        $scope.errorMsgs = data.data;
        $scope.testSendingInProgress = false;
        });
    };


    $scope.openSendEmail = function()
    {
      console.log('openSendEmail');

      /*modalInstance = $modal.open(
      {
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'EmaileditorController',
        size: 'lg'
      });*/
    }; 

    $scope.closeSendEmail = function()
    {
      console.log('closeSendEmail');
      console.log(modalInstance);
      modalInstance.dismiss('cancel');
    };

    $scope.updateFeedPositions = function(data) 
    {
        console.log("updateFeedPositions");
        console.log(data);
        var _data = data;
        var modulePos = 0;
        for(var i = 0; i < data.length; i++)
        {

          var posIdentifier = data[i].replace(dndElementIdentifier+'_', '').split('_');
          _data[i] = posIdentifier[1];
          modulePos = posIdentifier[0];

        }
        console.log(_data);
        $scope.feedPositions[modulePos]  = _data;
    };    

    $scope.clickOnElement = function(elementID) 
    {
        console.log("clickOnElement");
        console.log(elementID);

        $scope.isEmailModuleSelected = false;
        $scope.showSendingOptions = false;
     
        var _tmp = elementID.replace(dndElementIdentifier+'_', '');
        _tmp = _tmp.replace(clickableElementIdentifier+'_', '');
        _tmp =_tmp.split('_');
        var _moduleID = _tmp[0];
        var _id = _tmp[1];
        //$scope.currentEntry = $scope.rssData[_moduleID][_id];
        $scope.currentEntry = {};
        $scope.currentEntry.moduleId = _moduleID;
        $scope.currentEntry.id = _id;
        console.log($scope.currentEntry);
        $scope.currentViews = $scope.entity.modules[_moduleID].views;
        console.log(_id);
        console.log($scope.currentViews);
        $scope.$apply();
    };     

    $scope.clickOnEmailModule = function(elementID) 
    {
        console.log("clickOnElement");
        console.log(elementID);
     
        var _id = elementID.replace('emailModuleSelector_', '');
        
        $scope.isEmailModuleSelected = true;
        $scope.showSendingOptions = false;
     
        $scope.currentEmailModule = _id;
        
        $scope.$apply();
    }; 

    $scope.addEntry = function(moduleIndex)
    {
      console.log("addEntry("+moduleIndex+")");
      var _module = $scope.emailTemplates.modules[moduleIndex];
      //_module.type;
      if(_module.type == "3")
      {
        $scope.loadManualModule(_module, moduleIndex, (parseInt($scope.rssData[moduleIndex].numberOfEntries)), parseInt($scope.rssData[moduleIndex].numberOfEntries)+1).then(addEntryCallback(moduleIndex));
      }   

      if(_module.type == "2")
      {
        $scope.loadXMLModule(_module, moduleIndex, (parseInt($scope.rssData[moduleIndex].numberOfEntries)), parseInt($scope.rssData[moduleIndex].numberOfEntries)+1).then(addEntryCallback(moduleIndex));
      }  

      if(_module.type == "1")
      {
        $scope.loadRSSModule(_module, moduleIndex, (parseInt($scope.rssData[moduleIndex].numberOfEntries)), parseInt($scope.rssData[moduleIndex].numberOfEntries)+1).then(addEntryCallback(moduleIndex));
      }
    };

    function addEntryCallback(moduleIndex)
    {
      $scope.rssData[moduleIndex].numberOfEntries++;

      $scope.your_variable  = $scope.generateEmail(true);
      $scope.api.reinitSortable();
    }

    $scope.deleteEntry = function() 
    {
        console.log("deleteEntry");

        $scope.skipedEntries[$scope.currentEntry.moduleId][$scope.currentEntry.id] = true;
        $scope.your_variable  = $scope.generateEmail(true);
        $scope.api.reinitSortable();
    }; 

    $scope.updateEntryState = function() 
    {
      console.log("updateEntryState");

      $scope.your_variable  = $scope.generateEmail(true);
      $scope.api.reinitSortable();
    }; 


  /*
    $scope.deleteEmailModule = function() 
    {
        console.log("deleteEmailModule");

        $scope.skipedEmailModules[$scope.currentEmailModule] =  true;
        $scope.your_variable  = $scope.generateEmail(true);
        $scope.api.reinitSortable();
    };*/

    $scope.compileEmailAndData = function(source)
    {
      var _source = source;
      //var _source = '<h1>{{rssData[0].htmlTitle}} {{test1234}}</h1>';
      //var myscope= {};
     // myscope.test1234 = '4444';
      _source = $interpolate(_source)($scope);

      //console.log(_source);
      return _source;
    };

    $scope.updateViewforEntry = function()
    {
      console.log('updateViewforEntry');
      $scope.your_variable  = $scope.generateEmail(true);
      $scope.api.reinitSortable();
    };

    $scope.generateEmail = function(isEdit)
    {
      //console.log('generateEmail');
      var formatedEntries = '';
      var noSkippedEntries = 0;

      for(var moduleCounter = 0; moduleCounter < $scope.entity.modules.length; moduleCounter++)
      {
        //console.log('module '+moduleCounter);
        var moduleState = $scope.rssData[moduleCounter].state;
        //console.log( $scope.entity.modules[moduleCounter].childTagName);

        if(moduleState == 1 || isEdit)
        {
          var _moduleData = ''
          var isDraggable =  ($scope.feedPositions[moduleCounter].length > 1);
          
          if(isEdit)
          {
            _moduleData += '<div data-ng-hide="rssData['+moduleCounter+'].state==0" data-ng-class="{emailModule:true, inactiveEmailModule:rssData['+moduleCounter+'].state==2}">';
            _moduleData += '<div class="emailModuleSelector" id="emailModuleSelector_'+moduleCounter+'"><i class="fa fa-cog fa-3"></i></div>'; 
          } 

          _moduleData += $scope.emailTemplates.modules[moduleCounter].preBody;

          if(isEdit && isDraggable)
          {
            _moduleData += '<div class="sortable1">';
          }
          
          //for(var  x = 0; (x < $scope.feedPositions[moduleCounter].length && x < $scope.feedNumberOfEntries.no); x++)
          //console.log($scope.feedPositions[moduleCounter].length + '  '+ $scope.rssData[moduleCounter].numberOfEntries);
          for(var  x = 0; (x < $scope.feedPositions[moduleCounter].length && x < $scope.rssData[moduleCounter].numberOfEntries); x++)
          {
              //console.log('feedPositions '+x);
              var _tmpData = '';
              var i = $scope.feedPositions[moduleCounter][x];
              //console.log(i);

              var entryState = $scope.rssData[moduleCounter].data[i].state;

              if(entryState == 1 || isEdit)
              {
                var _entryView = $scope.emailTemplates.modules[moduleCounter].views[0].source;
                var childTagName = $scope.emailTemplates.modules[moduleCounter].views[0].childTagName;
                var clickableTagNameOpen = 'div';
                var clickableTagNameClose = 'div';

                if($scope.rssData != null)
                {
                  //console.log('rssData !=  null');
                 // console.log($scope.rssData.length);

                  if($scope.rssData.length > 0 && $scope.rssData[moduleCounter] != null)
                  {
                    //console.log('rssData['+moduleCounter+'] !=  null');
                    //console.log($scope.rssData[moduleCounter][i]._view);
                    for(var viewIter = 0; viewIter < $scope.emailTemplates.modules[moduleCounter].views.length; viewIter++)
                    {
                      //console.log($scope.emailTemplates.modules[moduleCounter].views[viewIter]._id +' == '+ $scope.rssData[moduleCounter][i]._view._id)
                      if($scope.emailTemplates.modules[moduleCounter].views[viewIter]._id == $scope.rssData[moduleCounter].data[i]._view._id)
                      {
                        _entryView = $scope.emailTemplates.modules[moduleCounter].views[viewIter].source;
                        childTagName = $scope.emailTemplates.modules[moduleCounter].views[viewIter].childTagName;
                       // console.log('Set view '+viewIter);
                      }
                    }
                  } 
                }

                //console.log($scope.rssData[moduleCounter][x]._view);
                //var _entryView = $scope.emailTemplates.modules[moduleCounter].views[$scope.rssData[moduleCounter][i]._view.id].source;
      
                _entryView = _entryView.replace("[[title]]",   '{{rssData['+moduleCounter+'].data['+i+'].title}}');
                //_entryView = _entryView.replace("[[htmlContent]]", 'rssData['+moduleCounter+'].data['+i+'].htmlContent');
                _entryView = _entryView.replace("[[content]]", '{{rssData['+moduleCounter+'].data['+i+'].content}}');
                _entryView = _entryView.replace("[[image]]", '{{rssData['+moduleCounter+'].data['+i+'].image}}');
                _entryView = _entryView.replace("[[link]]", '{{rssData['+moduleCounter+'].data['+i+'].link}}');
               // _entryView = _entryView.replace("[[contentSnippet]]", '{{rssData['+moduleCounter+'].data['+i+'].contentSnippet}}');


                for(var varCounter= 0; varCounter < $scope.emailTemplates.modules[moduleCounter].variables.length; varCounter++)
                {
                  var variableName = $scope.emailTemplates.modules[moduleCounter].variables[varCounter].name;
                   _entryView = _entryView.replace("{{"+variableName+"}}", '{{rssData['+moduleCounter+'].data['+i+'].data.'+variableName+'}}');
                   _entryView = _entryView.replace("{{"+variableName+"}}", '{{rssData['+moduleCounter+'].data['+i+'].data.'+variableName+'}}');
                }

                if($scope.emailTemplates.modules[moduleCounter].type==2)
                {
                    for(var xmlVarCounter = 0; xmlVarCounter < $scope.emailTemplates.modules[moduleCounter].xmlVariables.length; xmlVarCounter++)
                    {
                      _entryView = _entryView.replace("[["+$scope.emailTemplates.modules[moduleCounter].xmlVariables[xmlVarCounter].label+"]]", '{{rssData['+moduleCounter+'].data['+i+'].'+$scope.emailTemplates.modules[moduleCounter].xmlVariables[xmlVarCounter].name+'}}');
                    }
                }

                //console.log(_entryView);
                //console.log(childTagName);
                if(childTagName == 'tr')
                {
                  clickableTagNameOpen = 'tr><td><table';
                  clickableTagNameClose = 'table></td></tr';
                }

                if(isEdit)
                {
                  if(isDraggable)
                  {
                    //_moduleData += '<div  >';
                    _tmpData += '<'+clickableTagNameOpen+' data-ng-class="{'+dndElementIdentifier+':true, '+clickableElementIdentifier+':true, inactiveEmailEntry:rssData['+moduleCounter+'].data['+i+'].state==2}" id="'+dndElementIdentifier+'_'+moduleCounter+'_'+i+'" ng-hide="rssData['+moduleCounter+'].data['+i+'].state==0">';

                  }
                  else
                  {
                    _tmpData += '<'+clickableTagNameOpen+' class="'+clickableElementIdentifier+'" id="'+clickableElementIdentifier+'_'+moduleCounter+'_'+i+'">';          
                  }      
                }      
                

                _tmpData += _entryView;
                
                if(isEdit)
                {
                  _tmpData += '<div data-ng-class="{inactiveEmailModuleOverlay:rssData['+moduleCounter+'].data['+i+'].state==2}"><div data-ng-class="{inactiveEmailModuleOverlayColor:rssData['+moduleCounter+'].data['+i+'].state==2}"></div></div>';
                  if(isDraggable)
                  {
                    _tmpData += '</'+clickableTagNameClose+'>';
                  } 
                  else
                  {
                    _tmpData += '</'+clickableTagNameClose+'>';
                  }

                  if(entryState == 0 ||  entryState == 2)
                  {
                    noSkippedEntries++;
                  }
                }
              }
              else
              {
                noSkippedEntries++;
              }

              var _addAd = false;
              var _adIndex = -1;
              for(var adCounter=0; adCounter < $scope.emailTemplates.modules[moduleCounter].ads.length; adCounter++)
              { 
                //console.log('CHECK AD _pos:'+$scope.emailTemplates.modules[moduleCounter].ads[adCounter].pos);
                if($scope.emailTemplates.modules[moduleCounter].ads[adCounter].pos == (parseInt(x)-parseInt(noSkippedEntries)+1)+'')
                {
                  //console.log('ADD FOUND');
                  if(entryState == 1)
                  {
                    _adIndex = adCounter;
                    _addAd=true;
                  }
                }
              }

              if(_addAd)
              {
                var _adview = '';
                if(isEdit)
                {
                  _adview += '<div class="static">';
                }
                

                _adview += $scope.emailTemplates.modules[moduleCounter].adViews[0].source;

                _adview = _adview.replace("[[adLink]]",   '{{adData['+moduleCounter+']['+_adIndex+'].link}}');
                _adview = _adview.replace("[[adImage]]",   '{{adData['+moduleCounter+']['+_adIndex+'].img}}');

                if(isEdit)
                {
                  _adview += '</div>';
                }


                if(isEdit)
                {
                  _tmpData += _adview;
                }
                else
                {
                  if($scope.adData[moduleCounter][_adIndex].booked == true)
                  {
                    _tmpData += _adview;
                  }
                }
              }
              
              //console.log(_tmpData);

              _moduleData +=_tmpData;
          }

          if(isEdit && isDraggable)
          {
            _moduleData += '</div>';  //div.sortable1
          }

          _moduleData += $scope.emailTemplates.modules[moduleCounter].postBody;

          if(isEdit)
          {
            _moduleData += '<div data-ng-class="{inactiveEmailModuleOverlay:rssData['+moduleCounter+'].state==2}"><div data-ng-class="{inactiveEmailModuleOverlayColor:rssData['+moduleCounter+'].state==2}"></div></div>';
            _moduleData += '</div>';  //div.emailModule
          }

          //console.log($scope.emailTemplates.modules[moduleCounter].postModule);
          if($scope.emailTemplates.modules[moduleCounter].postModule)
          {
            _moduleData += $scope.emailTemplates.modules[moduleCounter].postModule;
          }

          if(isEdit)
          {
            formatedEntries += _moduleData;
          }
          else
          {
            formatedEntries += $scope.compileEmailAndData(_moduleData);
          }
        }
      }
      //console.log($scope.emailTemplates.header + formatedEntries + $scope.emailTemplates.footer);
      //console.log($scope.adData);

      //console.log('generateEmail done');
      return $scope.emailTemplates.header + formatedEntries + $scope.emailTemplates.footer;
    };

    $scope.initAfterLoad = function()
    {
        console.log('init');
    
        var defer = $q.defer();
        var promises = [];

        var moduleCounter = 0;
        console.log($scope.entity.modules);
        angular.forEach($scope.entity.modules, function(_module) 
        {
          console.log('foreach '+moduleCounter+ ' module type: '+_module.type);
          $scope.adData[moduleCounter] = _module.ads;

          $scope.loading  = false;
     
          if(_module.type == "1")
          {
            /*
            loadRssFeed(_module.defaultURL, moduleCounter, function()
            {
              promises.push($scope.loadRSSModule(_module, moduleCounter));
            });*/
            promises.push(loadRssFeed(_module, moduleCounter));
          }
          else
          {
            if(_module.type == "2")
            {
              //promises.push($scope.loadXMLModule(_module, moduleCounter));
            }
            else
            {
              if(_module.type == "3")
              {
                //promises.push($scope.loadManualModule(_module, moduleCounter, 0, _module.defaultNumberOfEntries));
              }
              else
              {
                console.error('unkown module type: '+_module.type);
              }
            }
          }
          moduleCounter++;
        });

        $q.all(promises).then(function() 
        {
          console.log('ALL PROMISES DONE');
          $scope.your_variable  = $scope.generateEmail(true);
          $scope.api.initSortable();
          $scope.firstInit = false;
          $scope.loading = false;  
        });
    };

    $scope.init = function()
    {
        console.log('init');
        /*
        for(var moduleCounter = 0; moduleCounter < entity.modules.length; moduleCounter++)
        {
          console.log('module '+moduleCounter);
          var _module = entity.modules[moduleCounter];
          if(_module.type == "1")
          {
            $scope.loadRSSFeed(moduleCounter);
          }
          else
          {
            $scope.feedPositions[moduleCounter] = [];
            $scope.feedPositions[moduleCounter][0] = 1;
            $scope.your_variable  = $scope.generateEmail(true);
            $scope.api.initSortable();
            $scope.firstInit = false;
            $scope.loading = false;
          }
        }*/

        var defer = $q.defer();
        var promises = [];

        var moduleCounter = 0;
        console.log($scope.entity.modules);
        angular.forEach($scope.entity.modules, function(_module) 
        {
          console.log('foreach '+moduleCounter+ ' module type: '+_module.type);
          $scope.adData[moduleCounter] = _module.ads;

          $scope.loading  = false;
     
          $scope.feedPositions[moduleCounter] = [];
          $scope.skipedEntries[moduleCounter] = {};

          $scope.rssData[moduleCounter]                 = [];
          $scope.rssData[moduleCounter].state           = 1; //'active'; 
          $scope.rssData[moduleCounter].numberOfEntries = $scope.emailTemplates.modules[moduleCounter].defaultNumberOfEntries;  
          $scope.rssData[moduleCounter].data            = [];  


          if(_module.type == "1")
          {
            /*
            loadRssFeed(_module.defaultURL, moduleCounter, function()
            {
              promises.push($scope.loadRSSModule(_module, moduleCounter));
            });*/
            promises.push($scope.loadRSSModuleWithFeed(_module, moduleCounter, 0, _module.defaultNumberOfEntries));
          }
          else
          {
            if(_module.type == "2")
            {
              promises.push($scope.loadXMLModuleWithFeed(_module, moduleCounter, 0, _module.defaultNumberOfEntries));
              //promises.push($scope.loadXMLModule(_module, moduleCounter));
            }
            else
            {
              if(_module.type == "3")
              {
                promises.push($scope.loadManualModule(_module, moduleCounter, 0, _module.defaultNumberOfEntries));
              }
              else
              {
                console.error('unkown module type: '+_module.type);
              }
            }
          }
          moduleCounter++;
        });

        $q.all(promises).then(function() 
        {
          console.log('ALL PROMISES DONE');
          $scope.your_variable  = $scope.generateEmail(true);
          $scope.api.initSortable();
          $scope.firstInit = false;
          $scope.loading = false;  
        });
    };

    $scope.checkAd2 = function(moduleCounter, index)
    {
      //console.log('checkAd2 ('+moduleCounter+', '+index+')');
      var deferred = $q.defer();
      //console.log($scope.adData[moduleCounter][index].img);

      Emaileditor.checkAdvertisment().query({url: $scope.adData[moduleCounter][index].img}, function(dimensions)
      {
        //console.log('checkAdvertisment');
        //console.log(dimensions[0].height);
        if(dimensions[0].height == 1)
        {
          $scope.adData[moduleCounter][index].booked = false;
          //console.log('yes');
        }
        else
        {
          $scope.adData[moduleCounter][index].booked = true;
          //console.log('no');
        }

        deferred.resolve();
      });
      
      return deferred.promise;
    }

    $scope.checkAds = function(cb)
    {
        console.log('checkAds');
   
        var defer = $q.defer();
        var promises = [];

        var moduleCounter = 0;
        //console.log($scope.entity.modules);

        //console.log($scope.entity.modules);
        angular.forEach($scope.adData, function(_module) 
        {
          for(var i = 0; i < $scope.adData[moduleCounter].length; i++)
          {
            promises.push($scope.checkAd2(moduleCounter, i));
          }

          moduleCounter++;
        });

        $q.all(promises).then(function() 
        {
          //console.log('ALL PROMISES DONE');
          return cb();
        });
    };

    $scope.loadManualModule = function(module, modulePos, from, to)
    {
      console.log('loadManualModule from:'+from+' to:'+to);
      var deferred = $q.defer();

      for(var  i = from; (i < to); i++)
      {
        $scope.rssData[modulePos].data[i] = $scope.rssData[modulePos].data[i] || {};
        $scope.rssData[modulePos].data[i].state          = 1;
        $scope.rssData[modulePos].data[i]._view          = $scope.emailTemplates.modules[modulePos].views[0];
        $scope.rssData[modulePos].data[i].data = {};
        $scope.rssData[modulePos].data[i].variables = {};

        for(var x = 0; x < $scope.emailTemplates.modules[modulePos].variables.length; x++)
        {
            $scope.rssData[modulePos].data[i].data[$scope.emailTemplates.modules[modulePos].variables[x].name] = $scope.emailTemplates.modules[modulePos].variables[x].defaultValue;
            $scope.rssData[modulePos].data[i].variables[$scope.emailTemplates.modules[modulePos].variables[x].name] = $scope.emailTemplates.modules[modulePos].variables[x];
        }

        $scope.rssData[modulePos].data[i]._view.label    = $scope.rssData[modulePos].data[i]._view.name;          
        $scope.rssData[modulePos].data[i]._view.source   = $scope.rssData[modulePos].data[i]._view.source.replace(/(\r\n|\n|\r)/gm,"");         
        $scope.rssData[modulePos].data[i]._pos           = i;

        $scope.feedPositions[modulePos][i] = i;
      }

      deferred.resolve();
      return deferred.promise;
    };

    function improveRSSfeed(rss)
    {
      console.log('improveRSSfeed');

      var feed = rss;
      if((feed.data != null) && (feed.data.responseData != null)  && (feed.data.responseData.feed != null) && (feed.data.responseData.feed.entries != null))
      {
          for(var i = 0; i < feed.data.responseData.feed.entries.length; i++)
          {
              var currentEntry = feed.data.responseData.feed.entries[i];

              var re = /\<img.*?\>/g;
              var subRe = /src=\".*?\"/g;
              var match = '';
              var subMatch = '';

              var matches = [];

              var _images = [];
           
              while ((match = re.exec(currentEntry.content)) != null) 
              {
                  //console.log("match found at " + match.index);
                  //console.log(match[0].length);
                  //console.log(match);

                  var posSrc = match[0].indexOf('src=');
                  //console.log(posSrc);
                  var imgUrl = match[0].substring(posSrc+5);
                  //console.log(imgUrl);
                  imgUrl = imgUrl.substring(0, imgUrl.indexOf("\""));
                  //console.log(imgUrl);

                  _images.push(imgUrl);


                                    /*var _name = match[0].substring(2, match[0].length-2);
                  var _label = _name;
                  //console.log(_name);
                  if(_variablesHash[_name] != true)
                  {
                    _variablesHash[_name] = true
                    _variables.push({name: _name, label: _label, defaultValue: '', fieldType: '1', inUse: true});
                  }*/
              }

              currentEntry.content = currentEntry.content.replace(/<(?:.|\n)*?>/gm, '');

              if(_images.length > 1)
              {
                logger.warn('improveRSSfeed in this entry there are more than 1 entries: #'+_images.length);
              }

              if(_images.length == 1)
              {
               currentEntry.imageUrl = _images[0];
              }

              feed.data.responseData.feed.entries[i] = currentEntry;
          }
      }

      return feed;
    }

    function loadRssFeed(url, modulePos)
    {
      var deferred = $q.defer();

      Emaileditor.parseRSSFeed(url).then(function(rss)
      {
        console.log('parseRSSFeed() callback');
        console.log(rss);

        feeds[modulePos] = improveRSSfeed(rss);
        deferred.resolve();  
      });

      return deferred.promise;
    }

    function loadXMLFeed(url, modulePos)
    {
      var deferred = $q.defer();

      XMLFeed.query({url: url}, function(feed)
      {
          for(var index in feed[0])
          {
            for(var arrayholder in feed[0][index])
            {
              console.log(arrayholder);
              var dataArray = feed[0][index][arrayholder];
              
              feeds[modulePos] = dataArray;
              deferred.resolve(); 
            }
          }
      });

      return deferred.promise;
    }

    $scope.loadRSSModuleWithFeed  = function(module, modulePos, from, to)
    { 
      var deferred = $q.defer();
      $scope.loading  = false;

      loadRssFeed(module.defaultURL, modulePos).then(function()
      {
        $scope.loadRSSModule(module, modulePos, from, to);
        console.log('loadRSSModuleWithFeed --> resolve');
        deferred.resolve();  
      });

      return deferred.promise;
    };

    $scope.loadXMLModuleWithFeed  = function(module, modulePos, from, to)
    { 
      var deferred = $q.defer();
      $scope.loading  = false;

      loadXMLFeed(module.defaultURL, modulePos).then(function()
      {
        $scope.loadXMLModule(module, modulePos, from, to);
        console.log('loadXMLModuleWithFeed --> resolve');
        deferred.resolve();  
      });

      return deferred.promise;
    };

    $scope.loadRSSModule  = function(module, modulePos, from, to)
    {
      console.log('loadRSSModule');
      var deferred = $q.defer();
      $scope.loading  = false;

      //console.log(feeds[modulePos]);
      var rss = feeds[modulePos];

      if(rss.status == '200')
      {
        var entries = rss.data.responseData.feed.entries;
        
        for(var  i = from; (i < to); i++)
        {
          $scope.rssData[modulePos].data[i] = $scope.rssData[modulePos].data[i] || {};
          $scope.rssData[modulePos].data[i].state         = 1;
          $scope.rssData[modulePos].data[i].author         = entries[i].author;
          $scope.rssData[modulePos].data[i].categories     = entries[i].categories;
          //$scope.rssData[modulePos].data[i].htmlContent    = $sce.trustAsHtml(entries[i].content);
          $scope.rssData[modulePos].data[i].content        = entries[i].content;
          $scope.rssData[modulePos].data[i].image          = entries[i].imageUrl;
          //$scope.rssData[modulePos].data[i].contentSnippet = entries[i].contentSnippet;

          $scope.rssData[modulePos].data[i].link           = entries[i].link;
          $scope.rssData[modulePos].data[i].publishedDate  = entries[i].publishedDate;
          $scope.rssData[modulePos].data[i].author         = entries[i].author;
         // $scope.rssData[modulePos].data[i].htmlTitle      = $sce.trustAsHtml(entries[i].title);
          $scope.rssData[modulePos].data[i].title          = entries[i].title;
          $scope.rssData[modulePos].data[i]._view          = $scope.emailTemplates.modules[modulePos].views[0];
    
        
          $scope.rssData[modulePos].data[i].data = {};
          $scope.rssData[modulePos].data[i].variables = {};
          for(var x = 0; x < $scope.emailTemplates.modules[modulePos].variables.length; x++)
          {
            $scope.rssData[modulePos].data[i].data[$scope.emailTemplates.modules[modulePos].variables[x].name] = $scope.emailTemplates.modules[modulePos].variables[x].defaultValue;
            $scope.rssData[modulePos].data[i].variables[$scope.emailTemplates.modules[modulePos].variables[x].name] = $scope.emailTemplates.modules[modulePos].variables[x];
          }

          $scope.rssData[modulePos].data[i]._view.label    = $scope.rssData[modulePos].data[i]._view.name;          
          $scope.rssData[modulePos].data[i]._view.source   = $scope.rssData[modulePos].data[i]._view.source.replace(/(\r\n|\n|\r)/gm,"");         
          $scope.rssData[modulePos].data[i]._pos           = i;

          $scope.feedPositions[modulePos][i] = i;
        }

        //console.log($scope.rssData);

        deferred.resolve();  
      }
      else
      {
        deferred.reject(rss.status);
      }

      console.log('parseRSSFeed() callback done');
     

      return deferred.promise;
   };    

    $scope.loadXMLModule  = function(module, modulePos, from, to)
    {
      console.log('loadXMLModule');
      var deferred = $q.defer();
      $scope.loading  = false;

      //console.log(feeds[modulePos]);
      var xmlFeed = feeds[modulePos];
      
      for(var  i = from; (i < to); i++)
      {
        $scope.rssData[modulePos].data[i] = $scope.rssData[modulePos].data[i] || {};
        $scope.rssData[modulePos].data[i].state         = 1;

        for(var xmlVarCounter = 0; xmlVarCounter < $scope.emailTemplates.modules[modulePos].xmlVariables.length; xmlVarCounter++)
        {

          var feedValue = xmlFeed[i][$scope.emailTemplates.modules[modulePos].xmlVariables[xmlVarCounter].name];

          $scope.rssData[modulePos].data[i][$scope.emailTemplates.modules[modulePos].xmlVariables[xmlVarCounter].name] = feedValue[0];
        }

        $scope.rssData[modulePos].data[i]._view          = $scope.emailTemplates.modules[modulePos].views[0];
  
      
        $scope.rssData[modulePos].data[i].data = {};
        $scope.rssData[modulePos].data[i].variables = {};

  
        $scope.rssData[modulePos].data[i]._view.label    = $scope.rssData[modulePos].data[i]._view.name;          
        $scope.rssData[modulePos].data[i]._view.source   = $scope.rssData[modulePos].data[i]._view.source.replace(/(\r\n|\n|\r)/gm,"");         
        $scope.rssData[modulePos].data[i]._pos           = i;

        $scope.feedPositions[modulePos][i] = i;
      }

        //console.log($scope.rssData);

        deferred.resolve();  
      

      console.log('loadXMLModule() callback done');
     

      return deferred.promise;
   };  

   /*
   $scope.loadRSSFeed = function(modulePos)
    {
      console.log('loadRSSFeed');
      $scope.loading  = false;
      var TEST_ITERATOR = 0;
      Emaileditor.parseRSSFeed($scope.feedURL).then(function(rss)
    	{
        console.log('parseRSSFeed() callback');
        //console.log(rss);
        if(rss.status == '200')
        {
          var entries = rss.data.responseData.feed.entries;
          
          $scope.feedPositions[modulePos] = [];

          for(var  i = 0; (i < entries.length); i++)
          {
            $scope.rssData[i] = $scope.rssData[i] || {};
            $scope.rssData[i].author         = entries[i].author;
            $scope.rssData[i].categories     = entries[i].categories;
            $scope.rssData[i].htmlContent    = $sce.trustAsHtml(entries[i].content);
            $scope.rssData[i].contentSnippet = entries[i].contentSnippet;
            $scope.rssData[i].link           = entries[i].link;
            $scope.rssData[i].publishedDate  = entries[i].publishedDate;
            $scope.rssData[i].author         = entries[i].author;
            $scope.rssData[i].htmlTitle      = $sce.trustAsHtml(entries[i].title);
            $scope.rssData[i]._view          = $scope.emailTemplates.modules[modulePos].views[0];
            $scope.rssData[i]._view.label    = $scope.rssData[i]._view.name;          
            $scope.rssData[i]._view.source   =  $scope.rssData[i]._view.source.replace(/(\r\n|\n|\r)/gm,"");         
            $scope.rssData[i]._pos           = i;

            
            $scope.feedPositions[modulePos][i] = i;
          }

          console.log($scope.rssData);

          $scope.your_variable  = $scope.generateEmail(true);
          $scope.api.initSortable();
          $scope.firstInit = false;
          $scope.loading = false;
    	  }
        console.log('parseRSSFeed() callback done');
      });
   };*/


  }
]);
