'use strict';

/* jshint -W098 */
angular.module('mean.emaileditor').controller('EmaileditorController', ['$scope', '$q', '$stateParams', '$compile', '$interpolate', '$parse', '$sce', 'Global', 'Emaileditor', 'NewsletterEntity', 'Email', 'Eloqua', 'XMLFeed', 'MeanUser',
  function($scope, $q, $stateParams, $compile, $interpolate, $parse, $sce, Global, Emaileditor, NewsletterEntity, Email, Eloqua, XMLFeed, MeanUser) 
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

    var sendRightNow = false;
 
    var emailId = null;
    $scope.storedEmail = new Email();
     

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

    $scope.errorMsgs = [];

    $scope.firstInit = true;
    $scope.loading = false;
    var feeds = [];

    $scope.newsletterEntity = '000';
    $scope.containsHiddenPreview = false;
    
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

    $scope.timestamp = Date.now();

    var emailContext = {};
    // emailContext.getTimestamp = function() { return Date.now()};
    emailContext.timestamp = $scope.timestamp;

    $scope.setinXDays = function(days) 
    {
      var oldDateObj = $scope.dt;
      if(oldDateObj == null || oldDateObj == undefined)
      {
        oldDateObj = new Date();
      }

      var now = new Date();
      oldDateObj.setDate(now.getDate());
      oldDateObj.setMonth(now.getMonth());
      oldDateObj.setFullYear(now.getFullYear());

      var now = new Date();

      $scope.dt = new Date(oldDateObj.getTime() + days*86400000);;
    };    

    $scope.setTimeinXMinutes = function(minutes) 
    {
      var oldDateObj = $scope.dt;
      if(oldDateObj == null || oldDateObj == undefined)
      {
        oldDateObj = new Date();
      }
      var now = new Date();
      oldDateObj.setHours(now.getHours());
      oldDateObj.setMinutes(now.getMinutes());
      oldDateObj.setSeconds(now.getSeconds());
      oldDateObj.setMilliseconds(now.getMilliseconds());

      if(minutes > 0)
      {
        $scope.dt = new Date(oldDateObj.getTime() + minutes*60000);
      }
      else
      {
        $scope.dt = new Date(oldDateObj.getTime());
      }
      //$scope.dt = (newDateObj.getHours()<10?'0':'')+newDateObj.getHours()+':'+ (newDateObj.getMinutes()<10?'0':'')+ newDateObj.getMinutes();
    };

    $scope.interpolate = function (value) {
        return $interpolate(value)($scope);
    };

    $scope.open1 = function() 
    {
      $scope.popup1.opened = true;
    };
   
    $scope.minDate = new Date();

    $scope.api = 
    {
        scope: $scope
    }

    $scope.load = function(cb)
    {
      // console.log('LOAD');
      // console.log($stateParams);
      Emaileditor.getEmailTemplate().query({company: MeanUser.company.id, entityId: $stateParams.newsletterid}, function(newsletterEntityArray)
      {
        // console.log('entity loaded');
        $scope.entity = newsletterEntityArray[0];

        if($scope.segment == '')
        {
          if($scope.entity.segments && $scope.entity.segments.length>0)
          {
            $scope.segment = $scope.entity.segments[0].id;
          }
          else
          {
            //TODO show warning that there are no segments
          }
        }

        $scope.emailTemplates = newsletterEntityArray[0];

        $scope.emailTemplates.header = $scope.emailTemplates.header.replace(/(\r\n|\n|\r)/gm,"");
        $scope.emailTemplates.footer = $scope.emailTemplates.footer.replace(/(\r\n|\n|\r)/gm,"");

        $scope.your_variable = $scope.emailTemplates.header + $scope.emailTemplates.footer;
        // console.log( $scope.your_variable);
        if($stateParams.emailid != null)
        {
          emailId = $stateParams.emailid;
          Email.query({company: MeanUser.company.id, emailId: $stateParams.emailid}, function(emails)
          {
            var email = emails[0];
            $scope.storedEmail = emails[0];

            //console.log('load email cb');
            if(email !=  null)
            {
              $scope.EmailName         = email.name;
              $scope.EmailSubject      = email.subject;
              $scope.hiddenPreviewText = email.hiddenPreviewText;

              if(email.scheduledDate)
              {
                $scope.dt = new Date(email.scheduledDate);
              }
              //$scope.dt = email.scheduledTime
              $scope.rssData = email.data;
              $scope.feedPositions = email.positions;
              // status: 'draft'
            }

            //console.log($scope.storedEmail);
            //console.log($scope.storedEmail.eloquaEmail);

            $scope.initAfterLoad();
            if(cb) return cb();
          });
        }
        else
        {
          $scope.EmailName = $scope.entity.name+'_'+($scope.minDate.getYear()-100)+''+($scope.minDate.getMonth()<9?'0':'')+''+($scope.minDate.getMonth()+1)+''+($scope.minDate.getDate()<9?'0':'')+''+($scope.minDate.getDate())+'_Username';
          $scope.EmailName = $scope.EmailName.replace(/ /gm, '');

          $scope.init();
          if(cb) return cb();
        }
      },
      function(loadError)
      {
        console.log('loadError');
        if(cb) return cb();
      });    
    };

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
        //Stan - Question regarding ads in the RSS APP
        $scope.checkAds(function()
        {
          $scope.your_variable  = $scope.generateEmail($scope.isEditMode);
          $scope.api.reinitSortable();
        });
      }
      else
      {
        $scope.checkAds(function()
        {
          $scope.your_variable  = $scope.generateEmail($scope.isEditMode);
        });
      }
    };

    /***
     saves the email in the apps database
    ***/
    $scope.saveEmail = function(cb)
    {
      //console.log('saveEmail');
      //console.log($scope.rssData);
      $scope.saveInProgress = true;

      var myData = [];
      for(var i = 0; i < $scope.rssData.length; i++)
      {
        //console.log($scope.rssData[i].bodyData);
        myData[i] = {};
        myData[i].state =  $scope.rssData[i].state;
        myData[i].numberOfEntries =  $scope.rssData[i].numberOfEntries;
        myData[i].data = $scope.rssData[i].data;
        myData[i].bodyData = $scope.rssData[i].bodyData;
        //console.log(myData[i]);
      }
      
      //console.log($scope.storedEmail);

      if($scope.storedEmail != null && $scope.storedEmail._id != null && $scope.storedEmail._id != undefined )
      {
        //console.log('storedEmail NOT null');
        $scope.storedEmail.name = $scope.EmailName;
        $scope.storedEmail.subject = $scope.EmailSubject;
        $scope.storedEmail.hiddenPreviewText = $scope.hiddenPreviewText;
        $scope.storedEmail.scheduledDate = $scope.dt;
        $scope.storedEmail.scheduledTime = $scope.dt;
        $scope.storedEmail.positions =  $scope.feedPositions;
        $scope.storedEmail.data = myData;
        $scope.storedEmail.eloquaFolder         = $scope.entity.eloquaFolder;  
        $scope.storedEmail.eloquaCampaignFolder = $scope.entity.eloquaCampaignFolder; 
        $scope.storedEmail.eloquaFooter = $scope.entity.eloquaFooter;
        $scope.storedEmail.eloquaHeader = $scope.entity.eloquaHeader;
        $scope.storedEmail.eloquaEmailEncoding = $scope.entity.eloquaEmailEncoding;
        $scope.storedEmail.bounceBackAddress = $scope.entity.bounceBackAddress;
        $scope.storedEmail.replyToName = $scope.entity.replyToName;
        $scope.storedEmail.replyToEmail = $scope.entity.replyToEmail;
        $scope.storedEmail.fromAddress = $scope.entity.fromAddress;
        $scope.storedEmail.senderName = $scope.entity.senderName;
      }
      else
      {
        //console.log('storedEmail == null');
        $scope.storedEmail = new Email(
        {
          name: $scope.EmailName,        
          segment: $scope.segment,
          subject: $scope.EmailSubject,
          hiddenPreviewText: $scope.hiddenPreviewText,
          scheduledDate: $scope.dt,  
          scheduledTime: $scope.dt,
          newsletterEntity: $stateParams.newsletterid,    
          data: myData,  
          eloquaFolder: $scope.entity.eloquaFolder,  
          eloquaCampaignFolder: $scope.entity.eloquaCampaignFolder,  
          eloquaFooter: $scope.entity.eloquaFooter,  
          eloquaHeader: $scope.entity.eloquaHeader,  
          eloquaEmailEncoding: $scope.entity.eloquaEmailEncoding,  
          eloquaEmailGroup: $scope.entity.eloquaEmailGroup,  
          bounceBackAddress: $scope.entity.bounceBackAddress,  
          replyToName: $scope.entity.replyToName,  
          replyToEmail: $scope.entity.replyToEmail,  
          fromAddress: $scope.entity.fromAddress,  
          senderName: $scope.entity.senderName,  
          positions: $scope.feedPositions,
          status: 'draft'
        });
        //console.log($scope.storedEmail);
      }

      $scope.storedEmail.company = MeanUser.company.id;
      $scope.storedEmail.$save(function(data, headers) 
      {
        $scope.module = data;
        $scope.errorMsgs = [];
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
      $scope.checkAds(function()
      {
        if(storedEloquaEmail == null)
        {
          storedEloquaEmail = new EloquaEmail(
          {
            name: $scope.EmailName,        
            emailId: $scope.storedEmail._id,            
            id: $scope.storedEmail.eloquaEmail,  
            eloquaFolder: $scope.storedEmail.eloquaFolder,
            eloquaHeader: null,  //$scope.storedEmail.eloquaHeader,  //SCH
            eloquaFooter: null,  //$scope.storedEmail.eloquaFooter,  //SCH
            eloquaEmailGroup: $scope.storedEmail.eloquaEmailGroup,
            eloquaEmailEncoding: $scope.storedEmail.eloquaEmailEncoding,
            bounceBackAddress: $scope.storedEmail.bounceBackAddress,
            replyToName: $scope.storedEmail.replyToName,
            replyToEmail: $scope.storedEmail.replyToEmail,
            fromAddress: $scope.storedEmail.fromAddress,
            senderName: $scope.storedEmail.senderName,
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
          storedEloquaEmail.eloquaHeader = null;  //$scope.storedEmail.eloquaHeader;  //SCH
          storedEloquaEmail.eloquaFooter = null;  //$scope.storedEmail.eloquaFooter;  //SCH
          storedEloquaEmail.eloquaEmailGroup = $scope.storedEmail.eloquaEmailGroup;
          storedEloquaEmail.eloquaEmailEncoding = $scope.storedEmail.eloquaEmailEncoding;
          storedEloquaEmail.bounceBackAddress = $scope.storedEmail.bounceBackAddress;
          storedEloquaEmail.replyToName = $scope.storedEmail.replyToName;
          storedEloquaEmail.replyToEmail = $scope.storedEmail.replyToEmail;
          storedEloquaEmail.fromAddress = $scope.storedEmail.fromAddress;
          storedEloquaEmail.senderName = $scope.storedEmail.senderName;
          storedEloquaEmail.subject = $scope.storedEmail.subject;
          storedEloquaEmail.html = $scope.generateEmail(false);
        }

        // console.log(storedEloquaEmail.html);
        console.log(JSON.stringify(storedEloquaEmail,null,4));  //SCH
        storedEloquaEmail.company = MeanUser.company.id;
        storedEloquaEmail.$save(function(data, headers) 
        {
          //console.log('storeCB');
          //console.log(data);
          $scope.module = data;
          $scope.errorMsgs = [];
          $scope.moduleExsists = true;
          $scope.saveInProgress = false;
          $scope.storedEmail.eloquaEmail = data.id;
          console.log('iD -------> '+$scope.storedEmail.eloquaEmail);
          if(cb) return cb();
        }, 
        function(data, headers) 
        {

          $scope.errorMsgs = [];
          $scope.errorMsgs.push({param: 'email', msg:'couldnt save email in Eloqua'});

          $scope.saveInProgress = false;
          if(cb) return cb();
        });
      });
    }
    
    $scope.sendEmailRightNow = function()
    {
      console.log('sendEmailRightNow');
      $scope.setinXDays(0);
      $scope.setTimeinXMinutes(0);
      sendRightNow = true;

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
        storedEloquaCampaign.sendRightNow          = sendRightNow; 

        storedEloquaCampaign.company = MeanUser.company.id;
        storedEloquaCampaign.$save(function(data, headers) 
        {
          console.log('scheduleEmail CB - success');
          //console.log(data);
          //console.log(headers);
          $scope.module = data;
          $scope.errorMsgs = [];
          $scope.scheduleInProgress = false;
          $scope.storedEmail.eloquaCampaign = data.id;
          $scope.storedEmail.status = 'active';
          console.log('campaign iD -------> '+$scope.storedEmail.eloquaCampaign);
        }, 
        function(data, headers) 
        {
          console.log('scheduleEmail CB - error');
          //console.log(data);
          //console.log(headers);
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
      campaign.company = MeanUser.company.id;    
      campaign.$save(function(data, headers) 
      {
        console.log('unscheduleEmail CB - success');
 
        $scope.errorMsgs = [];
        $scope.scheduleInProgress = false;
        $scope.storedEmail.status = 'draft';
      }, 
      function(data, headers) 
      {
        console.log('unscheduleEmail CB - error');
        $scope.errorMsgs = data.data;
        $scope.scheduleInProgress = false;
        });
    };

    $scope.sendTestEmail = function()
    {
      if($scope.storedEmail == null)
      {
        $scope.errorMsgs = [];
        $scope.errorMsgs.push({param:'send Test email', msg:'email needs to be saved before you can send a test email'});
      }
      else
      {
        $scope.testSendingInProgress = true;

        var campaign =  new EloquaTestEmail();
        campaign.emailAddresses = $scope.testEmailAddresses; 
        campaign.eloquaEmailId   = $scope.storedEmail.eloquaEmail;    
        campaign.company = MeanUser.company.id;  
        campaign.$save(function(data, headers) 
        {
          // console.log('EloquaTestEmail');
   
          $scope.errorMsgs = [];
          $scope.testSendingInProgress = false;
        }, 
        function(data, headers) 
        {
          $scope.errorMsgs = data.data;
          $scope.testSendingInProgress = false;
        });
      }
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
      //console.log(modalInstance);
      modalInstance.dismiss('cancel');
    };

    $scope.updateFeedPositions = function(data) 
    {
        //console.log("updateFeedPositions");
        //console.log(data);
        var _data = data.slice(0);
        var modulePos = 0;
        for(var i = 0; i < _data.length; i++)
        {

          var posIdentifier = _data[i].replace(dndElementIdentifier+'_', '').split('_');
          _data[i] = posIdentifier[1];
          modulePos = posIdentifier[0];

        }
        //console.log(_data);
        $scope.feedPositions[modulePos]  = _data;
    };    

    $scope.clickOnElement = function(elementID) 
    {
        //console.log("clickOnElement");
        //console.log(elementID);

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
        //console.log($scope.currentEntry);
        $scope.currentViews = $scope.entity.modules[_moduleID].views;
        //console.log(_id);
        //console.log($scope.currentViews);
        $scope.$apply();
    };     

    $scope.clickOnEmailModule = function(elementID) 
    {
        //console.log("clickOnElement");
        //console.log(elementID);
     
        var _id = elementID.replace('emailModuleSelector_', '');
        
        $scope.isEmailModuleSelected = true;
        $scope.showSendingOptions = false;
     
        $scope.currentEmailModule = _id;
        
        $scope.$apply();
    }; 

    $scope.addEntry = function(moduleIndex)
    {
      //console.log("addEntry("+moduleIndex+")");
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
        //console.log("deleteEntry");

        $scope.skipedEntries[$scope.currentEntry.moduleId][$scope.currentEntry.id] = true;
        $scope.your_variable  = $scope.generateEmail(true);
        $scope.api.reinitSortable();
    }; 

    $scope.updateEntryState = function() 
    {
      //console.log("updateEntryState");

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
      //console.log('updateViewforEntry');
      $scope.your_variable  = $scope.generateEmail(true);
      $scope.api.reinitSortable();
    };

    $scope.generateEmail = function(isEdit)
    {
      //console.log('generateEmail');
      var formatedEntries = '';
      $scope.timestamp = Date.now();
      emailContext.timestamp = $scope.timestamp;

      for(var moduleCounter = 0; moduleCounter < $scope.entity.modules.length; moduleCounter++)
      {
        //console.log('module '+moduleCounter);
        var noSkippedEntries = 0;
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

          var preBody = $scope.emailTemplates.modules[moduleCounter].preBody;
          for(var varCounter= 0; varCounter < $scope.emailTemplates.modules[moduleCounter].bodyVariables.length; varCounter++)
          {
            var variableName = $scope.emailTemplates.modules[moduleCounter].bodyVariables[varCounter].name;
             preBody = preBody.replace("{{"+variableName+"}}", '{{rssData['+moduleCounter+'].bodyData.'+variableName+'}}');
             preBody = preBody.replace("{{"+variableName+"}}", '{{rssData['+moduleCounter+'].bodyData.'+variableName+'}}');
          }
          _moduleData += preBody;

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
                  //console.log($scope.rssData.length);

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
      
                _entryView = _entryView.replace(/\[\[title\]\]/g,   '{{rssData['+moduleCounter+'].data['+i+'].title}}');
                //_entryView = _entryView.replace("[[htmlContent\]\]/g", 'rssData['+moduleCounter+'].data['+i+'].htmlContent');
                _entryView = _entryView.replace(/\[\[content\]\]/g, '{{rssData['+moduleCounter+'].data['+i+'].content}}');
                _entryView = _entryView.replace(/\[\[image\]\]/g, '{{rssData['+moduleCounter+'].data['+i+'].image}}');
                _entryView = _entryView.replace(/\[\[link\]\]/g, '{{rssData['+moduleCounter+'].data['+i+'].link}}');
                _entryView = _entryView.replace(/\[\[enclosure\]\]/g, '{{rssData['+moduleCounter+'].data['+i+'].enclosure}}');
               // _entryView = _entryView.replace("/\[\[contentSnippet\]\]/g", '{{rssData['+moduleCounter+'].data['+i+'].contentSnippet}}');


                for(var varCounter= 0; varCounter < $scope.emailTemplates.modules[moduleCounter].variables.length; varCounter++)
                {
                  var variableName = $scope.emailTemplates.modules[moduleCounter].variables[varCounter].name;
                   _entryView = _entryView.replace( new RegExp("\{\{"+variableName+"\}\}",'g'), '{{rssData['+moduleCounter+'].data['+i+'].data.'+variableName+'}}');
                   $scope.rssData[moduleCounter].data[i].data[variableName] = $interpolate($scope.rssData[moduleCounter].data[i].data[variableName])(emailContext);
                  // _entryView = _entryView.replace("/\{\{"+variableName+"\}\}/g", '{{rssData['+moduleCounter+'].data['+i+'].data.'+variableName+'}}');
                }

                if($scope.emailTemplates.modules[moduleCounter].type==2)
                {
                    for(var xmlVarCounter = 0; xmlVarCounter < $scope.emailTemplates.modules[moduleCounter].xmlVariables.length; xmlVarCounter++)
                    {
                      //var re = new RegExp("[["+$scope.emailTemplates.modules[moduleCounter].xmlVariables[xmlVarCounter].label+"]]");
                      _entryView = _entryView.replace( "[["+$scope.emailTemplates.modules[moduleCounter].xmlVariables[xmlVarCounter].label+"]]", '{{rssData['+moduleCounter+'].data['+i+'].'+$scope.emailTemplates.modules[moduleCounter].xmlVariables[xmlVarCounter].name+'}}');
                      _entryView = _entryView.replace( "[["+$scope.emailTemplates.modules[moduleCounter].xmlVariables[xmlVarCounter].label+"]]", '{{rssData['+moduleCounter+'].data['+i+'].'+$scope.emailTemplates.modules[moduleCounter].xmlVariables[xmlVarCounter].name+'}}');
                      _entryView = _entryView.replace( "[["+$scope.emailTemplates.modules[moduleCounter].xmlVariables[xmlVarCounter].label+"]]", '{{rssData['+moduleCounter+'].data['+i+'].'+$scope.emailTemplates.modules[moduleCounter].xmlVariables[xmlVarCounter].name+'}}');
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
                //console.log('CHECK AD _pos:'+$scope.emailTemplates.modules[moduleCounter].ads[adCounter].pos + ' == '+(parseInt(x)-parseInt(noSkippedEntries)+1));
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
                _tmpData += _getAdView(isEdit, moduleCounter, _adIndex);
              }
              
              //console.log(_tmpData);

              _moduleData +=_tmpData;
          }

          var _addAd = false;
          var _adIndex = -1;
          var x = Math.min($scope.feedPositions[moduleCounter].length, $scope.rssData[moduleCounter].numberOfEntries);
          //console.log(x);
          for(var adCounter=0; adCounter < $scope.emailTemplates.modules[moduleCounter].ads.length; adCounter++)
          { 
            //console.log('CHECK AD _pos:'+$scope.emailTemplates.modules[moduleCounter].ads[adCounter].pos+ ' >= '+(parseInt(x)-parseInt(noSkippedEntries)+1));
            if(parseInt($scope.emailTemplates.modules[moduleCounter].ads[adCounter].pos) >= (parseInt(x)-parseInt(noSkippedEntries)+1)+'')
            {
              //console.log('ADD FOUND1');

              _adIndex = adCounter;
  
              _moduleData += _getAdView(isEdit, moduleCounter, _adIndex);
            }
          }

          if(isEdit && isDraggable)
          {
            _moduleData += '</div>';  //div.sortable1
          }

          var postBody = $scope.emailTemplates.modules[moduleCounter].postBody;
          for(var varCounter= 0; varCounter < $scope.emailTemplates.modules[moduleCounter].bodyVariables.length; varCounter++)
          {
            var variableName = $scope.emailTemplates.modules[moduleCounter].bodyVariables[varCounter].name;
             postBody = postBody.replace("{{"+variableName+"}}", '{{rssData['+moduleCounter+'].bodyData.'+variableName+'}}');
             postBody = postBody.replace("{{"+variableName+"}}", '{{rssData['+moduleCounter+'].bodyData.'+variableName+'}}');
             $scope.rssData[moduleCounter].bodyData[variableName] = $interpolate($scope.rssData[moduleCounter].bodyData[variableName])(emailContext);
          }
          _moduleData += postBody;

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

          formatedEntries += _moduleData;
        }
      }

      //console.log($scope.emailTemplates.header + formatedEntries + $scope.emailTemplates.footer);
      //console.log($scope.adData);

      //console.log('generateEmail done');
      // console.log($scope.emailTemplates);
      var fullEmail = $scope.emailTemplates.header + formatedEntries + $scope.emailTemplates.footer;
      console.log(fullEmail);
      fullEmail = fullEmail.replace("{{hiddenPreviewText}}", '{{api.scope.hiddenPreviewText}}');
      // fullEmail = fullEmail.replace(new RegExp('{{timestamp}}', 'g'), '{{api.scope.timestamp}}');

      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      for(var i = 0; i < $scope.adData.length; i++)
      {
        for(var j = 0; j < $scope.adData[i].length; j++)
        {
          // $scope.adData[i][j].link = $parse($scope.adData[i][j].link)(emailContext);
          // var getter = $parse($scope.adData[i][j].img);
          // console.log(getter(emailContext));
          // $scope.adData[i][j].img = $parse($scope.adData[i][j].img)(emailContext);
          $scope.adData[i][j].link = $interpolate($scope.adData[i][j].link)(emailContext);
          $scope.adData[i][j].img = $interpolate($scope.adData[i][j].img)(emailContext);
          // $scope.adData[i][j].img = $scope.adData[i][j].img.replace(new RegExp('{{timestamp}}', 'g'), '{{api.scope.timestamp}}')
        }
      }
      //  $parse()
      if(!isEdit)
      {
        fullEmail = $scope.compileEmailAndData(fullEmail);
      }
       
      return fullEmail;
    };

    function _getAdView(isEdit, moduleCounter, _adIndex )
    {
      var _adview = '';
      if(isEdit)
      {
        _adview += '<div class="static">';
      }
      
      _adview += $scope.emailTemplates.modules[moduleCounter].adViews[0].source;

      _adview = _adview.replace("[[adLink]]",   '{{adData['+moduleCounter+']['+_adIndex+'].link}}');
      _adview = _adview.replace("[[adImage]]", '{{adData['+moduleCounter+']['+_adIndex+'].img}}');

      if(isEdit)
      {
        _adview += '</div>';
      }

      if(isEdit)
      {
        //console.log("booked: " +$scope.adData[moduleCounter][_adIndex].booked);
        //Stan - Question regarding ads in the RSS APP
        if($scope.adData[moduleCounter][_adIndex].booked == true)
        {
          return _adview;
        }
        else
        {
          return '';
        }
      }
      else
      {
        if($scope.adData[moduleCounter][_adIndex].booked == true)
        {
          return _adview;
        }
        else
        {
          return '';
        }
      }
    }

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
            promises.push(loadRssFeed(_module.defaultURL, moduleCounter));
          }
          else
          {
            if(_module.type == "2")
            {
              promises.push($scope.loadXMLModule(_module.defaultURL, moduleCounter));
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
          $scope.checkIfTemplateContainsHiddenPreviewAndSetFlag();
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
        //console.log($scope.entity.modules);
        angular.forEach($scope.entity.modules, function(_module) 
        {
          //console.log('foreach '+moduleCounter+ ' module type: '+_module.type);
          $scope.adData[moduleCounter] = _module.ads;

          $scope.loading  = false;
     
          $scope.feedPositions[moduleCounter] = [];
          $scope.skipedEntries[moduleCounter] = {};

          $scope.rssData[moduleCounter]                 = [];
          $scope.rssData[moduleCounter].state           = 1; //'active'; 
          $scope.rssData[moduleCounter].numberOfEntries = $scope.emailTemplates.modules[moduleCounter].defaultNumberOfEntries;  
          //console.log('defaultNumberOfEntries: '+$scope.emailTemplates.modules[moduleCounter].defaultNumberOfEntries);
          $scope.rssData[moduleCounter].data            = [];  

          $scope.rssData[moduleCounter].bodyData = {};
          $scope.rssData[moduleCounter].bodyVariables = {};
          for(var x = 0; x < $scope.emailTemplates.modules[moduleCounter].bodyVariables.length; x++)
          {
            $scope.rssData[moduleCounter].bodyData[$scope.emailTemplates.modules[moduleCounter].bodyVariables[x].name] = $scope.emailTemplates.modules[moduleCounter].bodyVariables[x].defaultValue;
            $scope.rssData[moduleCounter].bodyVariables[$scope.emailTemplates.modules[moduleCounter].bodyVariables[x].name] = $scope.emailTemplates.modules[moduleCounter].bodyVariables[x];
          }

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
          $scope.checkIfTemplateContainsHiddenPreviewAndSetFlag();
          $scope.api.initSortable();
          $scope.firstInit = false;
          $scope.loading = false;  
        });
    };

    $scope.checkIfTemplateContainsHiddenPreviewAndSetFlag = function()
    {
      if($scope.your_variable.indexOf('{{api.scope.hiddenPreviewText}}') > -1)
      {
        $scope.containsHiddenPreview = true;
      }
      
    }

    $scope.checkAd2 = function(moduleCounter, index)
    {
      //console.log('checkAd2 ('+moduleCounter+', '+index+')');
      var deferred = $q.defer();
      //console.log($scope.adData[moduleCounter][index].img);
     
      Emaileditor.checkAdvertisment().query(
        {
          url: $scope.adData[moduleCounter][index].img
        }, 
        function(dimensions)
        { 
          console.log('checkAdvertisment');
          console.log('dimensions = ' + dimensions[0].height);
          //console.log(dimensions[0].height);
          if(dimensions == null || dimensions.length == 0)
          {
            $scope.adData[moduleCounter][index].booked = false;
          }
          else
          {
            if( dimensions[0].height == 1)
            {
              $scope.adData[moduleCounter][index].booked = false;
              console.log('was booked false');
            }
            else
            {
              $scope.adData[moduleCounter][index].booked = true;
              console.log('was booked true');
            }
          }
        
          deferred.resolve();     
        }, function(error)
        { 
          console.error('checkAdvertisment error');
          $scope.errorMsgs = [];
          $scope.errorMsgs.push({param:$scope.adData[moduleCounter][index].img, msg: 'couldnt check if the ad was booked'});
          
          $scope.adData[moduleCounter][index].booked = true;
          deferred.resolve();
        }
      );
      
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

    function improveRSSfeed(rssFeed)
    {
      console.log('improveRSSfeed');

      if(rssFeed != null)
      {
          for(var i = 0; i < rssFeed.length; i++)
          {
              var currentEntry = rssFeed[i];

              var re = /\<img.*?\>/g;
              var subRe = /src=\".*?\"/g;
              var match = '';
              var subMatch = '';
              var matches = [];
              var _images = [];
           
              if(currentEntry.content != null)
              {
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

                currentEntry.content = currentEntry.content.replace(/<img(?:.|\n)*?>/gm, '');
              }

              if(_images.length > 1)
              {
                //console.log('improveRSSfeed in this entry there are more than 1 entries: #'+_images.length);
                currentEntry.imageUrl = _images[0];
              }

              if(_images.length == 1)
              {
               currentEntry.imageUrl = _images[0];
              }

              rssFeed[i] = currentEntry;
          }
      }
      //console.log(feed);

      return rssFeed;
    }

    function loadRssFeed(url, modulePos)
    {
      var deferred = $q.defer();
      console.log('loadRssFeed('+url+','+modulePos+')');

      Emaileditor.parseRSSFeed().query({url: url}, function(rss)
      {
        //console.log('parseRSSFeed() callback');
        //console.log(rss);

        if((rss != null) && (rss[0] != null) && (rss[0].entries != null))
        { 
          feeds[modulePos] = improveRSSfeed(rss[0].entries);
        }
        else
        {
          $scope.errorMsgs.push({param: 'rss feed', msg:'response is empty '});
        }
       
        
        deferred.resolve();  
      }, 
      function(error) 
      {
        // error handler
        //console.log('loadRssFeed error');
        //console.log(error.data);
        feeds[modulePos] = [];
        $scope.errorMsgs = $scope.errorMsgs.concat(error.data);
        deferred.resolve(); 
      });

      return deferred.promise;
    }

    function loadXMLFeed(url, modulePos)
    {
      var deferred = $q.defer();

      XMLFeed.query({url: url}, function(feed)
      {
        console.log('xml feed cb');

        feeds[modulePos] = [];
        var _isValid = false;
       
        if(feed != null && feed.length > 0)
        {
          var keys = Object.keys(feed[0]);
          console.log(keys);
          if(keys.length == 1)
          {
            var subKeys = Object.keys(feed[0][keys[0]]);
            console.log(subKeys);
            if(subKeys.length == 1)
            {
              //for(var arrayholder in feed[0][index])
              //{
               // console.log(arrayholder);
                var dataArray = feed[0][keys[0]][subKeys[0]];
                
                feeds[modulePos] = dataArray;
                _isValid = true;
                deferred.resolve(); 
              //}
            }
          }
        }

        if(!_isValid)
        {
          $scope.errorMsgs.push({param: 'xml feed', msg:'there was an issue loading '+url});
          deferred.resolve(); 
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
      console.log('loadRSSModule '+modulePos);
      var deferred = $q.defer();
      $scope.loading  = false;

      //console.log(feeds[modulePos]);
      var rssFeed = feeds[modulePos];

      if(rssFeed != null)
      {
       
        var  i = parseInt(from);
        //console.log(i+' = '+parseInt(from)+'; (('+i+' < '+to+') && ('+i+' < '+rssFeed.length+'));');
        //console.log(i < to);
        //console.log(i < rssFeed.length);
        //console.log(((i < to) && (i < rssFeed.length)));
        for(var  i = parseInt(from); ((i < parseInt(to)) && (i < rssFeed.length)); i++)
        {
          //console.log('i:'+i);
          $scope.rssData[modulePos].data[i]                = $scope.rssData[modulePos].data[i] || {};
          $scope.rssData[modulePos].data[i].state          = 1;
          $scope.rssData[modulePos].data[i].author         = rssFeed[i].author;
          $scope.rssData[modulePos].data[i].categories     = rssFeed[i].categories;
          //$scope.rssData[modulePos].data[i].htmlContent  = $sce.trustAsHtml(rssFeed[i].content);
          $scope.rssData[modulePos].data[i].content        = rssFeed[i].content;
          $scope.rssData[modulePos].data[i].image          = rssFeed[i].imageUrl;
          //$scope.rssData[modulePos].data[i].contentSnippet = rssFeed[i].contentSnippet;

          $scope.rssData[modulePos].data[i].link           = rssFeed[i].link;
          $scope.rssData[modulePos].data[i].publishedDate  = rssFeed[i].publishedDate;
          $scope.rssData[modulePos].data[i].author         = rssFeed[i].author;
          $scope.rssData[modulePos].data[i].enclosure         = rssFeed[i].enclosure;
         // $scope.rssData[modulePos].data[i].htmlTitle    = $sce.trustAsHtml(rssFeed[i].title);
          $scope.rssData[modulePos].data[i].title          = rssFeed[i].title;
          $scope.rssData[modulePos].data[i]._view          = $scope.emailTemplates.modules[modulePos].views[0];

          for(var x = 0; x < $scope.emailTemplates.modules[modulePos].views.length; x++ )
          {
            if($scope.emailTemplates.modules[modulePos].views[x].isDefault == true)
            {
              $scope.rssData[modulePos].data[i]._view = $scope.emailTemplates.modules[modulePos].views[x];
            }
          }
    
        
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

          //console.log($scope.rssData[modulePos].data[i]);
          $scope.feedPositions[modulePos][i] = i;
        }

        //console.log($scope.rssData[modulePos]);

        deferred.resolve();  
      }
      else
      {
        deferred.reject(rss.status);
      }

      //console.log('parseRSSFeed() callback done');
     

      return deferred.promise;
   };    

    $scope.loadXMLModule  = function(module, modulePos, from, to)
    {
      console.log('loadXMLModule');
      var deferred = $q.defer();
      $scope.loading  = false;

      //console.log(feeds[modulePos]);
      var xmlFeed = feeds[modulePos];
      
      for(var  i = from; ((i < to) && (i < xmlFeed.length)); i++)
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
      

      console.log('loadXMLModule() callback done');
     

      return deferred.promise;
   };  
  }
]);
