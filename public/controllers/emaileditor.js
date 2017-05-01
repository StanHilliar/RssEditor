'use strict';

/* jshint -W098 */
angular.module('mean.emaileditor').controller('EmaileditorController', ['$scope', '$q', '$stateParams', '$compile', '$interpolate', '$sce', 'Global', 'Emaileditor', 'NewsletterEntity', 'Email', 'Eloqua', 'XMLFeed', 'MeanUser', '$filter',
  function ($scope, $q, $stateParams, $compile, $interpolate, $sce, Global, Emaileditor, NewsletterEntity, Email, Eloqua, XMLFeed, MeanUser, $filter) 
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

    var EloquaEmail               = Eloqua.eloquaEmail();
    var EloquaCampaign            = Eloqua.eloquaCampaign();
    var EloquaTestEmail           = Eloqua.eloquaTestEmail();
    var EloquaCampaignUnschedule  = Eloqua.eloquaCampaignUnschedule();

    var storedEloquaEmail = null;
    var storedEloquaCampaign = null;
    var sendRightNow = false;

    var emailId = null;
    $scope.storedEmail = null;

    $scope.enableDropZone = false;

    $scope.rssData      = [];
    $scope.adData       = [];
    $scope.EmailName    = '';
    $scope.EmailSubject = '';

    $scope.your_variable = '';
    $scope.rssContent = 'omg';
    $scope.test1234 = 'omg';

    $scope.showSendingOptions = true;

    $scope.feedPositions = [];
    $scope.modulePositions = [];
    $scope.skipedEntries = [];
    $scope.skipedEmailModules = {};

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

    $scope.dateOptions =
    {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.popup1 =
    {
      opened: false
    };

    $scope.format = 'dd.MM.yyyy';
    $scope.maxDate = new Date(2020, 5, 22);
    $scope.minDate = new Date();

    $scope.tabs    = [];
    $scope.tabs[0] = {};
    $scope.tabs[1] = {};
    $scope.tabs[2] = {};
    $scope.tabs[2].class = "active", 

    $scope.api =
    {
      scope: $scope
    }

    $scope.dropzoneIdtoIndex = {};
    var countModulesInDropzone = 0;
    $scope.load = function(cb)
    {
      Emaileditor.getEmailTemplate().query({ company: MeanUser.company.id, entityId: $stateParams.newsletterid }, function (newsletterEntityArray) 
      {
        //console.log('entity loaded');
        $scope.entity = newsletterEntityArray[0];

        if ($scope.segment == '') 
        {
          // console.log('entity loaded');
          $scope.entity = newsletterEntityArray[0];
          $scope.entity.header = $scope.entity.header.replace(/(\r\n|\n|\r)/gm, "");
          $scope.entity.footer = $scope.entity.footer.replace(/(\r\n|\n|\r)/gm, "");

          $scope.your_variable = $scope.entity.header + $scope.entity.footer;
          if($scope.entity.dropzoneModules && $scope.entity.dropzoneModules.length > 0)
          {
            $scope.enableDropZone = true;
            $scope.changeTab(0);
            for(var i =0; i < $scope.entity.dropzoneModules.length; i++)
            {
              $scope.dropzoneIdtoIndex[$scope.entity.dropzoneModules[i]._id] = i;
            }
          }

          // console.log( $scope.your_variable);
          if ($stateParams.emailid != null) 
          {
            emailId = $stateParams.emailid;
            Email.query({ company: MeanUser.company.id, emailId: $stateParams.emailid }, function (emails) 
            {
              var email = emails[0];
              $scope.storedEmail = emails[0];

              console.log('load email cb');
              $scope.init(function()
              {
                console.log('init cb');
                if (email != null) 
                {
                  console.log('email != null');
                  $scope.EmailName          = email.name;
                  $scope.EmailSubject       = email.subject;
                  $scope.hiddenPreviewText  = email.hiddenPreviewText;

                  if (email.scheduledDate) 
                  {
                    $scope.dt = new Date(email.scheduledDate);
                  }
                  //$scope.dt             = email.scheduledTime
                  $scope.rssData          = email.data;
                  $scope.feedPositions    = email.positions;
                  $scope.modulePositions  = email.modulePositions;
                  $scope.segment          = email.segment;
          
                  // status: 'draft'
                }

                console.log('~~~~~~~~~~~~~~~~~~~~~~~~');
                console.log($scope.entity.dropzoneModules);
                console.log('~~~~~~~~~~~~~~~~~~~~~~~~');
                if($scope.modulePositions)
                {
                  for(var  i = 0; i <  $scope.modulePositions.length; i++)
                  {
                    console.log('++++++++++++++++++++++++++++++++++++++');
                    console.log($scope.modulePositions[i]);
                    if(angular.isArray($scope.modulePositions[i]))
                    {
                      var sortedModulePositions = $filter('orderBy')($scope.modulePositions[i], 'index', false);
                      console.log(sortedModulePositions);

                      for(var  x = 0; x <  sortedModulePositions.length; x++)
                      {
                        console.log(sortedModulePositions[x].moduleId);
                        console.log($scope.dropzoneIdtoIndex[sortedModulePositions[x].moduleId]);
                        console.log($scope.entity.dropzoneModules[$scope.dropzoneIdtoIndex[sortedModulePositions[x].moduleId]]);

                        var newModule = angular.copy($scope.entity.dropzoneModules[$scope.dropzoneIdtoIndex[sortedModulePositions[x].moduleId]]);

                        if(!$scope.entity.modules[i].modules)
                        {
                          $scope.entity.modules[i].modules = [];
                        }
                        $scope.entity.modules[i].modules[x] = newModule;
                      }
                    }
                    for(var  x = 0; x <  $scope.modulePositions[i].length; x++)
                    {
                      if($scope.modulePositions[i][x].index > countModulesInDropzone)
                      {
                        countModulesInDropzone = $scope.modulePositions[i][x].index;
                      }
                    }
                    
                  }
                }
                countModulesInDropzone++; 
                console.log('~~~~~~~~~~~~~~~~~~~~~~~~');

              // $scope.entity.modules[dropzoneModuleIndex].modules.push(newModule);
              // $scope.modulePositions[dropzoneModuleIndex].splice(position, 0, {index:countModulesInDropzone, moduleId:newModule._id});

                $scope.your_variable = $scope.generateEmail(true);
                $scope.api.initSortable();
                if(cb) return cb();
              });

                //console.log($scope.storedEmail);
                //console.log($scope.storedEmail.eloquaEmail);


              // $scope.initAfterLoad();
            });
          }
          else 
          {
            $scope.EmailName = $scope.entity.name + '_' + ($scope.minDate.getYear() - 100) + '' + ($scope.minDate.getMonth() < 9 ? '0' : '') + '' + ($scope.minDate.getMonth() + 1) + '' + ($scope.minDate.getDate() < 9 ? '0' : '') + '' + ($scope.minDate.getDate()) + '_Username';
            $scope.EmailName = $scope.EmailName.replace(/ /gm, '');

            $scope.init();
            if(cb) return cb();
          }
        }
      },
      function(loadError)
      {
        console.log('loadError');
        if(cb) return cb();
      });    
    };

    $scope.setMode = function ()
    {
      console.log('setMode ' + $scope.isEditMode);
      $scope.api.setMode($scope.isEditMode);

      if ($scope.isEditMode)
      {
        $scope.your_variable = $scope.generateEmail($scope.isEditMode);
        $scope.api.reinitSortable();
      }
      else
      {
        $scope.checkAds(function ()
        {
          $scope.your_variable = $scope.generateEmail($scope.isEditMode);
        });
      }
    };

    /***
     saves the email in the apps database
    ***/
    $scope.saveEmail = function (cb) 
    {
      console.log('saveEmail');
      //console.log($scope.rssData);
      // console.log($scope.EmailName);
      // console.log($scope.EmailSubject);
      $scope.saveInProgress = true;

      var myData = [];
      for (var i = 0; i < $scope.rssData.length; i++) 
      {
        //console.log($scope.rssData[i].bodyData);
        if($scope.rssData[i] instanceof Array && $scope.rssData[i].length> 0)
        { 
        //   console.log($scope.rssData[i]);
        //   console.log('ISARRAY');
          myData[i]= [];
          for (var x = 0; x < $scope.rssData[i].length; x++) 
          {
              myData[i][x]                 = {};
              myData[i][x].state           = $scope.rssData[i][x].state;
              myData[i][x].numberOfEntries = $scope.rssData[i][x].numberOfEntries;
              myData[i][x].data            = $scope.rssData[i][x].data;
              myData[i][x].bodyData        = $scope.rssData[i][x].bodyData;
          }
        }
        else
        {
          myData[i]                 = {};
          myData[i].state           = $scope.rssData[i].state;
          myData[i].numberOfEntries = $scope.rssData[i].numberOfEntries;
          myData[i].data            = $scope.rssData[i].data;
          myData[i].bodyData        = $scope.rssData[i].bodyData;
        }
        console.log(myData[i]);
      }
      // myData = $scope.rssData;
      console.log(myData);

      // console.log($scope.storedEmail);
      if ($scope.storedEmail != null) 
      {
        //console.log('storedEmail NOT null');

        $scope.storedEmail.name                 = $scope.EmailName;
        $scope.storedEmail.segment              = $scope.segment;      
        $scope.storedEmail.subject              = $scope.EmailSubject;
        $scope.storedEmail.hiddenPreviewText    = $scope.hiddenPreviewText;
        $scope.storedEmail.scheduledDate        = $scope.dt;
        $scope.storedEmail.scheduledTime        = $scope.dt;
        $scope.storedEmail.positions            = $scope.feedPositions;
        $scope.storedEmail.modulePositions      = $scope.modulePositions;
        $scope.storedEmail.data                 = myData;
        $scope.storedEmail.eloquaFolder         = $scope.entity.eloquaFolder;
        $scope.storedEmail.eloquaCampaignFolder = $scope.entity.eloquaCampaignFolder;
        $scope.storedEmail.eloquaFooter         = $scope.entity.eloquaFooter;
        $scope.storedEmail.eloquaHeader         = $scope.entity.eloquaHeader;
        $scope.storedEmail.eloquaEmailEncoding  = $scope.entity.eloquaEmailEncoding;       
        $scope.storedEmail.bounceBackAddress    = $scope.entity.bounceBackAddress;
        $scope.storedEmail.replyToName          = $scope.entity.replyToName;
        $scope.storedEmail.replyToEmail         = $scope.entity.replyToEmail;
        $scope.storedEmail.fromAddress          = $scope.entity.fromAddress;
        $scope.storedEmail.senderName           = $scope.entity.senderName;
      }
      else 
      {
        //console.log('storedEmail == null');
        $scope.storedEmail = new Email(
        {
          name                  : $scope.EmailName,
          segment               : $scope.segment,
          subject               : $scope.EmailSubject,
          hiddenPreviewText     : $scope.hiddenPreviewText,
          scheduledDate         : $scope.dt,
          scheduledTime         : $scope.dt,
          newsletterEntity      : $stateParams.newsletterid,
          data                  : myData,
          eloquaFolder          : $scope.entity.eloquaFolder,
          eloquaCampaignFolder  : $scope.entity.eloquaCampaignFolder,
          eloquaFooter          : $scope.entity.eloquaFooter,
          eloquaHeader          : $scope.entity.eloquaHeader,
          eloquaEmailEncoding   : $scope.entity.eloquaEmailEncoding,  
          eloquaEmailGroup      : $scope.entity.eloquaEmailGroup,
          bounceBackAddress     : $scope.entity.bounceBackAddress,
          replyToName           : $scope.entity.replyToName,
          replyToEmail          : $scope.entity.replyToEmail,
          fromAddress           : $scope.entity.fromAddress,
          senderName            : $scope.entity.senderName,
          positions             : $scope.feedPositions,
          modulePositions       : $scope.modulePositions,
          status                : 'draft'
        });
      }
      console.log($scope.storedEmail);

      $scope.storedEmail.company = MeanUser.company.id;

      $scope.storedEmail.$save(function (data, headers) 
      {
        $scope.module         = data;
        $scope.errorMsgs      = [];
        $scope.moduleExsists  = true;
        saveEloquaEmail(cb);
      },
        function (data, headers) 
        {
          $scope.errorMsgs = data.data;
          $scope.saveInProgress = false;
          if (cb) return cb();
        });
    };

    function saveEloquaEmail(cb) 
    {
      $scope.checkAds(function () 
      {

        if (storedEloquaEmail == null) 
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
          storedEloquaEmail.eloquaHeader = $scope.storedEmail.eloquaHeader;
          storedEloquaEmail.eloquaFooter = $scope.storedEmail.eloquaFooter;
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


        storedEloquaEmail.company = MeanUser.company.id;
        storedEloquaEmail.$save(function (data, headers) 
        {
          //console.log('storeCB');
          //console.log(data);
          $scope.module = data;
          $scope.errorMsgs = [];
          $scope.moduleExsists = true;
          $scope.saveInProgress = false;
          $scope.storedEmail.eloquaEmail = data.id;
          console.log('iD -------> ' + $scope.storedEmail.eloquaEmail);
          if (cb) return cb();
        },
          function (data, headers) 
          {

            $scope.errorMsgs = [];
            $scope.errorMsgs.push({ param: 'email', msg: 'couldnt save email in Eloqua' });

            $scope.saveInProgress = false;
            if (cb) return cb();
          });
      });
    }

    $scope.sendEmailRightNow = function () 
    {
      // console.log('sendEmailRightNow');
      $scope.setinXDays(0);
      $scope.setTimeinXMinutes(0);
      sendRightNow = true;

      $scope.scheduleEmail();
    };

    $scope.scheduleEmail = function () 
    {
      // console.log('scheduleEmail');
      $scope.scheduleInProgress = true;

      $scope.saveEmail(function () 
      {
        if (storedEloquaCampaign == null)
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
        var endAt   = new Date(startAt.getTime() + 86400000);

        storedEloquaCampaign.startAt      = Math.ceil(startAt.getTime() / 1000);
        storedEloquaCampaign.endAt        = Math.ceil(endAt.getTime() / 1000);
        storedEloquaCampaign.sendRightNow = sendRightNow;

        storedEloquaCampaign.company = MeanUser.company.id;
        storedEloquaCampaign.$save(function (data, headers)
        {
          // console.log('scheduleEmail CB - success');
          //console.log(data);
          //console.log(headers);
          $scope.module = data;
          $scope.errorMsgs = [];
          $scope.scheduleInProgress = false;
          $scope.storedEmail.eloquaCampaign = data.id;
          $scope.storedEmail.status = 'active';
          console.log('campaign iD -------> ' + $scope.storedEmail.eloquaCampaign);
        },
          function (data, headers)
          {
            console.log('scheduleEmail CB - error');
            //console.log(data);
            //console.log(headers);
            $scope.errorMsgs = data.data;
            $scope.scheduleInProgress = false;
          });
      });
    };

    $scope.unscheduleEmail = function () 
    {
      $scope.scheduleInProgress = true;
      var campaign       = new EloquaCampaignUnschedule();
      campaign.id       = $scope.storedEmail.eloquaCampaign;
      campaign.emailId  = $scope.storedEmail._id;
      campaign.company  = MeanUser.company.id;
      campaign.$save(function (data, headers) 
      {
        // console.log('unscheduleEmail CB - success');

        $scope.errorMsgs = [];
        $scope.scheduleInProgress = false;
        $scope.storedEmail.status = 'draft';
      },
        function (data, headers) 
        {
          console.log('unscheduleEmail CB - error');
          $scope.errorMsgs = data.data;
          $scope.scheduleInProgress = false;
        });
    };

    $scope.sendTestEmail = function () 
    {
      if ($scope.storedEmail == null) 
      {
        $scope.errorMsgs = [];
        $scope.errorMsgs.push({ param: 'send Test email', msg: 'email needs to be saved before you can send a test email' });
      }
      else 
      {
        $scope.testSendingInProgress = true;

        var campaign = new EloquaTestEmail();
        campaign.emailAddresses = $scope.testEmailAddresses;
        campaign.eloquaEmailId = $scope.storedEmail.eloquaEmail;
        campaign.company = MeanUser.company.id;
        campaign.$save(function (data, headers)
        {
          // console.log('EloquaTestEmail');

          $scope.errorMsgs = [];
          $scope.testSendingInProgress = false;
        },
          function (data, headers)
          {
            $scope.errorMsgs = data.data;
            $scope.testSendingInProgress = false;
          });
      }
    };

    $scope.changeTab = function(id)
    {
      if(id == 0)
      {
        $scope.showDragAndDrop    = true;
        $scope.showSendingOptions = false;
        $scope.showModuleEdit     = false;
        $scope.tabs[0].class = "active";
        $scope.tabs[1].class = "";
        $scope.tabs[2].class = "";
      }
      if(id == 1)
      {
        $scope.showDragAndDrop    = false;
        $scope.showSendingOptions = false;
        $scope.showModuleEdit     = true;
        $scope.tabs[0].class = "";
        $scope.tabs[1].class = "active";
        $scope.tabs[2].class = "";
      }
      if(id == 2)
      {
        $scope.showDragAndDrop    = false;
        $scope.showSendingOptions = true;
        $scope.showModuleEdit     = false;
        $scope.tabs[0].class = "";
        $scope.tabs[1].class = "";
        $scope.tabs[2].class = "active";
      }
    };
    
    $scope.changeTab(2);


    function elementIdToPositions(identifier, identifier2, idStr)
    {
      var pos = {};

      var _tmp  = idStr.replace(identifier + '_', '');
      _tmp      = _tmp.replace(identifier2 + '_', '');
      _tmp      = _tmp.split('_');

      pos.containerId;
      pos.moduleId  = _tmp[0];
      pos.id        = _tmp[1];

      if (pos.id == 'C')
      {
        var _tmp2 = idStr.replace(identifier + '_' + pos.moduleId + '_' + pos.id  + '_', '');
        _tmp2     = _tmp2.replace(identifier2+ '_' + pos.moduleId + '_' + pos.id  + '_', '');
        _tmp2 = _tmp2.split('_');

        pos.containerId = pos.moduleId;
        pos.moduleId    = _tmp2[0];
        pos.id          = _tmp2[1];
      }

      return pos;
    }

    $scope.updateFeedPositions = function (data)
    {
      console.log("updateFeedPositions");
      console.log(data);
      var _data = data.slice(0);
      var containerId = 0;
      var modulePos = 0;
      for (var i = 0; i < _data.length; i++)
      {
          var ids = elementIdToPositions(dndElementIdentifier, dndElementIdentifier, _data[i]);
          // var posIdentifier = _data[i].replace(dndElementIdentifier + '_', '').split('_');
          containerId = ids.containerId;
          modulePos   = ids.moduleId;
          _data[i]   = ids.id;
      }

      console.log('containerId:'+containerId);
      console.log('modulePos:'+modulePos);
      //console.log(_data);
      if(containerId)
      {
        $scope.feedPositions[containerId][modulePos] = _data;
      }
      else
      {
        $scope.feedPositions[modulePos] = _data;
      }
    };

  
    $scope.onAddModuleToEmail = function (dropzoneModuleIndex, moduleId, position) 
    {
      console.log('onAddModuleToEmail');
      console.log(moduleId);
      console.log('countModulesInDropzone: '+countModulesInDropzone);
      var moduleIndex = -1;
      for (var i = 0; i < $scope.entity.dropzoneModules.length; i++)
      {
        if ($scope.entity.dropzoneModules[i]._id == moduleId)
        {
          moduleIndex = i;
        }
      }

      if (moduleIndex != -1)
      {
        if (!$scope.entity.modules[dropzoneModuleIndex].modules)
        {
          $scope.entity.modules[dropzoneModuleIndex].modules = [];
        }

        var newModule = angular.copy($scope.entity.dropzoneModules[moduleIndex]);

        $scope.entity.modules[dropzoneModuleIndex].modules.push(newModule);
        $scope.modulePositions[dropzoneModuleIndex].splice(position, 0, {index:countModulesInDropzone, moduleId:newModule._id});

        initModule(newModule, dropzoneModuleIndex, countModulesInDropzone).then(function () 
        {
          countModulesInDropzone++;
          $scope.your_variable = $scope.generateEmail(true);
          $scope.api.initSortable();
          $scope.firstInit = false;
          $scope.loading = false;
        });
        //  $scope.generateEmail($scope.isEditMode);
      }
    };

    $scope.onRemoveModuleFromEmail = function (moduleId, position) 
    {
      console.log('onRemoveModuleFromEmail ('+moduleId+') #'+position);
      // console.log(moduleId);
      
      var ids = elementIdToPositions('emailModule', 'emailModule', moduleId);
      var containerId = ids.containerId;
      var _moduleID = ids.moduleId;
      var _id = ids.id;

      console.log('containerId:'+containerId);
      console.log('_moduleID:'+_moduleID);
      console.log('_id:'+_id);

      delete $scope.entity.modules[containerId].modules[_moduleID];
      // console.log($scope.modulePositions[containerId]);
      $scope.modulePositions[containerId].splice(position, 1);
      // console.log($scope.modulePositions[containerId]);
    };

    $scope.clickOnElement = function (elementID) 
    {
      console.log("clickOnElement");
      console.log(elementID);
      $scope.changeTab(1);

      $scope.isEmailModuleSelected = false;
      $scope.showSendingOptions = false;

      // var _tmp = elementID.replace(dndElementIdentifier + '_', '');
      // _tmp = _tmp.replace(clickableElementIdentifier + '_', '');
      // _tmp = _tmp.split('_');

      // var containerId;
      // var _moduleID = _tmp[0];
      // var _id = _tmp[1];
      // // console.log(_moduleID);
      // // console.log(_id);

      // if (_id == 'C')
      // {
      //   var _tmp2 = elementID.replace(dndElementIdentifier + '_' + _moduleID + '_' + _id + '_', '');

      //   _tmp2 = _tmp2.replace(clickableElementIdentifier + '_', '');
      //   _tmp2 = _tmp2.split('_');
      //   containerId = _moduleID;
      //   _moduleID = _tmp2[0];
      //   _id = _tmp2[1];
      // }

      var ids = elementIdToPositions(dndElementIdentifier, clickableElementIdentifier, elementID);
      var containerId = ids.containerId;
      var _moduleID   = ids.moduleId;
      var _id         = ids.id;

      console.log('containerId:'+containerId);
      console.log('_moduleID:'+_moduleID);
      console.log('_id:'+_id);

      //$scope.currentEntry = $scope.rssData[_moduleID][_id];
      $scope.currentEntry = {};
   
      //console.log($scope.currentEntry);
      if(containerId)
      {
        // if($scope.entity && $scope.entity.modules && $scope.entity.modules[containerId] && $scope.entity.modules[containerId].modules && $scope.entity.modules[containerId].modules[_moduleID])
        // {
        // }
        // else
        // {
        //   errorMessage('click','ups there seems to be an problem');
        // }

        $scope.currentEntry =
        {
          containerId : containerId,
          moduleId    : _moduleID,
          id          : _id,
          views       : $scope.entity.modules[containerId].modules[_moduleID].views,
          module      : $scope.entity.modules[containerId].modules[_moduleID],
          data        : $scope.rssData[containerId][_moduleID].data[_id]
        }
      }
      else
      {
        $scope.currentEntry =
        {
          // containerId : containerId,
          moduleId    : _moduleID,
          id          : _id,
          views       : $scope.entity.modules[_moduleID].views,
          module      : $scope.entity.modules[_moduleID],
          data        : $scope.rssData[_moduleID].data[_id]
        }
      }
      
      $scope.$apply();
    };

    $scope.clickOnEmailModule = function (elementID) 
    {
      console.log("clickOnEmailModule");
      console.log(elementID);
      $scope.changeTab(1);

      var _id = elementID.replace('emailModuleSelector_', '');

      var ids = elementIdToPositions('emailModuleSelector', 'emailModuleSelector', elementID);
      var containerId = ids.containerId;
      var _moduleID = ids.moduleId;
      var _id = ids.id;
      console.log('containerId:'+containerId);
      console.log('_moduleID:'+_moduleID);
      console.log('_id:'+_id);


      $scope.isEmailModuleSelected = true;
      $scope.showSendingOptions = false;
      if(containerId)
      {
        $scope.currentEmailModuleData = $scope.rssData[containerId][_moduleID];
        $scope.currentEmailModule     = $scope.entity.modules[containerId].modules[_moduleID];

      }
      else
      {
        $scope.currentEmailModuleData = $scope.rssData[_moduleID];
        $scope.currentEmailModule     = $scope.entity.modules[_moduleID];
      }

      $scope.$apply();
    };

    $scope.addEntry = function (moduleIndex) 
    {
      //console.log("addEntry("+moduleIndex+")");
      var _module = $scope.entity.modules[moduleIndex];
      //_module.type;
      if (_module.type == "3")
      {
        $scope.loadManualModule(_module, moduleIndex, (parseInt($scope.rssData[moduleIndex].numberOfEntries)), parseInt($scope.rssData[moduleIndex].numberOfEntries) + 1).then(addEntryCallback(moduleIndex));
      }

      if (_module.type == "2")
      {
        $scope.loadXMLModule(_module, moduleIndex, (parseInt($scope.rssData[moduleIndex].numberOfEntries)), parseInt($scope.rssData[moduleIndex].numberOfEntries) + 1).then(addEntryCallback(moduleIndex));
      }

      if (_module.type == "1")
      {
        $scope.loadRSSModule(_module, moduleIndex, (parseInt($scope.rssData[moduleIndex].numberOfEntries)), parseInt($scope.rssData[moduleIndex].numberOfEntries) + 1).then(addEntryCallback(moduleIndex));
      }
    };

    function addEntryCallback(moduleIndex)
    {
      $scope.rssData[moduleIndex].numberOfEntries++;

      $scope.your_variable = $scope.generateEmail(true);
      $scope.api.reinitSortable();
    }

    $scope.deleteEntry = function ()
    {
      //console.log("deleteEntry");

      $scope.skipedEntries[$scope.currentEntry.moduleId][$scope.currentEntry.id] = true;
      $scope.your_variable = $scope.generateEmail(true);
      $scope.api.reinitSortable();
    };

    $scope.updateEntryState = function ()
    {
      //console.log("updateEntryState");

      $scope.your_variable = $scope.generateEmail(true);
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

    $scope.compileEmailAndData = function (source) 
    {
      var _source = source;
      //var _source = '<h1>{{rssData[0].htmlTitle}} {{test1234}}</h1>';
      //var myscope= {};
      // myscope.test1234 = '4444';
      _source = $interpolate(_source)($scope);

      //console.log(_source);
      return _source;
    };

    $scope.updateViewforEntry = function ()
    {
      console.log('updateViewforEntry');
      $scope.your_variable = $scope.generateEmail(true);
      $scope.api.reinitSortable();
    };

    $scope.generateModule = function (isEdit, currentModule, moduleData, moduleFeedPositions, moduleCounter, moduleDataStr, moduleIdStr)
    {
      console.log('generateModule (' + moduleDataStr + ' / ' + moduleIdStr + ')');
      console.log('moduleFeedPositions.length:' + moduleFeedPositions.length);
      var noSkippedEntries  = 0;
      // console.log(moduleDataStr);
      // console.log(moduleIdStr);
      var moduleHtml = '';
      if (currentModule)
      {
        var isDraggable = (moduleFeedPositions.length > 1);

        if (isEdit) 
        {
          moduleHtml += '<div data-ng-hide="' + moduleDataStr + '.state==0" id="emailModule_' + moduleIdStr + '" data-ng-class="{emailModule:true, inactiveEmailModule:' + moduleDataStr + '.state==2}">';
          moduleHtml += '<div class="emailModuleHandle" id="emailModuleHandle_' + moduleIdStr + '"><i class="fa fa-arrows fa-3"></i></div>';
          moduleHtml += '<div class="emailModuleSelector" id="emailModuleSelector_' + moduleIdStr + '"><i class="fa fa-cog fa-3"></i></div>';
        }

        var preBody = currentModule.preBody;
        if(currentModule.bodyVariables)
        {
          for (var varCounter = 0; varCounter < currentModule.bodyVariables.length; varCounter++) 
          {
            var variableName = currentModule.bodyVariables[varCounter].name;
            preBody = preBody.replace("{{" + variableName + "}}", '{{' + moduleDataStr + '.bodyData.' + variableName + '}}');
            preBody = preBody.replace("{{" + variableName + "}}", '{{' + moduleDataStr + '.bodyData.' + variableName + '}}');
          }
        }
        moduleHtml += preBody;

        if (isEdit && isDraggable) 
        {
          moduleHtml += '<div class="sortable1">';
        }

        console.log(moduleFeedPositions.length + '  '+ moduleData.numberOfEntries);
        for (var x = 0; (x < moduleFeedPositions.length && x < moduleData.numberOfEntries); x++) 
        {
          //console.log('feedPositions '+x);
          var _tmpData = '';
          var i = moduleFeedPositions[x];
          console.log(i);

          var entryState = moduleData.data[i].state;

          if (entryState == 1 || isEdit) 
          {
            var _entryView = currentModule.views[0].source;
            var childTagName = currentModule.views[0].childTagName;
            var clickableTagNameOpen = 'div';
            var clickableTagNameClose = 'div';

        

            if (moduleData != null) 
            {
              //console.log('rssData['+moduleCounter+'] !=  null');
              //console.log(moduleData[i]._view);
              for (var viewIter = 0; viewIter < currentModule.views.length; viewIter++)
              {
                //console.log(currentModule.views[viewIter]._id +' == '+ moduleData[i]._view._id)
                if (currentModule.views[viewIter]._id == moduleData.data[i]._view._id) 
                {
                  _entryView = currentModule.views[viewIter].source;
                  childTagName = currentModule.views[viewIter].childTagName;
                  // console.log('Set view '+viewIter);
                }
              }
            }
            

            //console.log(moduleData[x]._view);
    
            _entryView = _entryView.replace(/\[\[title\]\]/g    , '{{' + moduleDataStr + '.data[' + i + '].title}}');
            //_entryView = _entryView.replace("[[htmlContent\]\]/g", 'moduleDataStr.data['+i+'].htmlContent');
            _entryView = _entryView.replace(/\[\[content\]\]/g  , '{{' + moduleDataStr + '.data[' + i + '].content}}');
            _entryView = _entryView.replace(/\[\[image\]\]/g    , '{{' + moduleDataStr + '.data[' + i + '].image}}');
            _entryView = _entryView.replace(/\[\[link\]\]/g     , '{{' + moduleDataStr + '.data[' + i + '].link}}');
            _entryView = _entryView.replace(/\[\[enclosure\]\]/g, '{{' + moduleDataStr + '.data[' + i + '].enclosure}}');
            // _entryView = _entryView.replace("/\[\[contentSnippet\]\]/g", '{{moduleDataStr.data['+i+'].contentSnippet}}');


            for (var varCounter = 0; varCounter < currentModule.variables.length; varCounter++) 
            {
              var variableName = currentModule.variables[varCounter].name;
              _entryView = _entryView.replace(new RegExp("\{\{" + variableName + "\}\}", 'g'), '{{' + moduleDataStr + '.data[' + i + '].data.' + variableName + '}}');
            }

            if (currentModule.type == 2) 
            {
              for (var xmlVarCounter = 0; xmlVarCounter < currentModule.xmlVariables.length; xmlVarCounter++) 
              {
                _entryView = _entryView.replace("[[" + currentModule.xmlVariables[xmlVarCounter].label + "]]", '{{' + moduleDataStr + '.data[' + i + '].' + currentModule.xmlVariables[xmlVarCounter].name + '}}');
                _entryView = _entryView.replace("[[" + currentModule.xmlVariables[xmlVarCounter].label + "]]", '{{' + moduleDataStr + '.data[' + i + '].' + currentModule.xmlVariables[xmlVarCounter].name + '}}');
                _entryView = _entryView.replace("[[" + currentModule.xmlVariables[xmlVarCounter].label + "]]", '{{' + moduleDataStr + '.data[' + i + '].' + currentModule.xmlVariables[xmlVarCounter].name + '}}');
              }
            }

            //console.log(_entryView);
            //console.log(childTagName);
            if (childTagName == 'tr') 
            {
              clickableTagNameOpen = 'tr><td><table';
              clickableTagNameClose = 'table></td></tr';
            }

            if (isEdit) 
            {
              if (isDraggable) 
              {
                _tmpData += '<' + clickableTagNameOpen + ' data-ng-class="{' + dndElementIdentifier + ':true, ' + clickableElementIdentifier + ':true, inactiveEmailEntry:' + moduleDataStr + '.data[' + i + '].state==2}" id="' + dndElementIdentifier + '_' + moduleIdStr + '_' + i + '" ng-hide="' + moduleDataStr + '.data[' + i + '].state==0">';
              }
              else 
              {
                _tmpData += '<' + clickableTagNameOpen + ' class="' + clickableElementIdentifier + '" id="' + clickableElementIdentifier + '_' + moduleIdStr + '_' + i + '">';
              }
            }


            _tmpData += _entryView;

            if (isEdit) 
            {
              _tmpData += '<div data-ng-class="{inactiveEmailModuleOverlay:' + moduleDataStr + '.data[' + i + '].state==2}"><div data-ng-class="{inactiveEmailModuleOverlayColor:' + moduleDataStr + '.data[' + i + '].state==2}"></div></div>';
              if (isDraggable) 
              {
                _tmpData += '</' + clickableTagNameClose + '>';
              }
              else 
              {
                _tmpData += '</' + clickableTagNameClose + '>';
              }

              if (entryState == 0 || entryState == 2) 
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

          if(currentModule.ads)
          {
            for (var adCounter = 0; adCounter < currentModule.ads.length; adCounter++) 
            {
              //console.log('CHECK AD _pos:'+currentModule.ads[adCounter].pos + ' == '+(parseInt(x)-parseInt(noSkippedEntries)+1));
              if (currentModule.ads[adCounter].pos == (parseInt(x) - parseInt(noSkippedEntries) + 1) + '') 
              {
                //console.log('ADD FOUND');
                if (entryState == 1) 
                {
                  _adIndex = adCounter;
                  _addAd = true;
                }
              }
            }
          }

          if (_addAd) 
          {
            _tmpData += _getAdView(isEdit, currentModule, moduleCounter, _adIndex);
          }

          //console.log(_tmpData);

          moduleHtml += _tmpData;
        }

        var _addAd = false;
        var _adIndex = -1;
        var x = Math.min(moduleFeedPositions.length, moduleData.numberOfEntries);
        //console.log(x);
        if(currentModule.ads)
        {
          for (var adCounter = 0; adCounter < currentModule.ads.length; adCounter++)
          {
            //console.log('CHECK AD _pos:'+currentModule.ads[adCounter].pos+ ' >= '+(parseInt(x)-parseInt(noSkippedEntries)+1));
            if (parseInt(currentModule.ads[adCounter].pos) >= (parseInt(x) - parseInt(noSkippedEntries) + 1) + '')
            {
              //console.log('ADD FOUND1');

              _adIndex = adCounter;

              moduleHtml += _getAdView(isEdit, currentModule, moduleCounter, _adIndex);
            }
          }
        }

        if (isEdit && isDraggable) 
        {
          moduleHtml += '</div>';  //div.sortable1
        }

        var postBody = currentModule.postBody;
        if(currentModule.bodyVariables)
        {
          for (var varCounter = 0; varCounter < currentModule.bodyVariables.length; varCounter++)
          {
            var variableName = currentModule.bodyVariables[varCounter].name;
            postBody = postBody.replace("{{" + variableName + "}}", '{{' + moduleDataStr + '.bodyData.' + variableName + '}}');
            postBody = postBody.replace("{{" + variableName + "}}", '{{' + moduleDataStr + '.bodyData.' + variableName + '}}');
          }
        }
        moduleHtml += postBody;

        if (isEdit)
        {
          moduleHtml += '<div data-ng-class="{inactiveEmailModuleOverlay:' + moduleDataStr + '.state==2}"><div data-ng-class="{inactiveEmailModuleOverlayColor:' + moduleDataStr + '.state==2}"></div></div>';
          moduleHtml += '</div>';  //div.emailModule
        }

        //console.log(currentModule.postModule);
        if (currentModule.postModule) 
        {
          moduleHtml += currentModule.postModule;
        }
      }
      // console.log(moduleHtml);
      return moduleHtml;
    };

    $scope.generateContainer = function (isEdit, container, data, modulePositions, containerFeedPositions, dataStr, containerIdStr)
    {
      console.log('generateContainer');
      console.log(modulePositions);
      var formatedEntries = '';
      
      for (var moduleCounter = 0; moduleCounter < modulePositions.length; moduleCounter++) 
      {
        console.log('smodule '+moduleCounter);
        var indexInDropZoneModules = $scope.dropzoneIdtoIndex[modulePositions[moduleCounter].moduleId];
        var moduleIndex = modulePositions[moduleCounter].index;
        console.log('moduleIndex '+moduleIndex);
        console.log('indexInDropZoneModules '+indexInDropZoneModules);

        if(moduleIndex != undefined || moduleIndex != null)
        {          
          var noSkippedEntries  = 0;
          var _moduleData       = '';
          var moduleIdStr       = containerIdStr + moduleIndex;
          var moduleState       = data[moduleIndex].state;

          console.log('moduleState:'+moduleState);
          if (moduleState == 1 || isEdit) 
          {
            //console.log( $scope.entity.modules[moduleIndex].childTagName);
            formatedEntries += $scope.generateModule(isEdit, $scope.entity.dropzoneModules[indexInDropZoneModules], data[moduleIndex], containerFeedPositions[moduleIndex], moduleIndex, dataStr + '[' + moduleIndex + ']', moduleIdStr);
          } //if (moduleState == 1 || isEdit)
        }
      }
      
      return formatedEntries;
    };

    $scope.generateEmail = function (isEdit) 
    {
      //console.log('generateEmail');
      var formatedEntries = '';

      if ($scope.entity && $scope.entity.modules)
      {
        for (var moduleCounter = 0; moduleCounter < $scope.entity.modules.length; moduleCounter++) 
        {
          console.log('module '+moduleCounter);
             
          var noSkippedEntries = 0;
          var _moduleData = '';
          var dataStr     = 'rssData';
          var moduleIdStr = '' + moduleCounter;

          if($scope.entity.modules[moduleCounter].placeholderType == 'DROPZONE')
          {
              _moduleData += '<div id="modulesContainer" data-dropzone-id=' + moduleIdStr + '>';
              _moduleData += $scope.generateContainer(isEdit, $scope.entity.modules[moduleCounter], $scope.rssData[moduleCounter], $scope.modulePositions[moduleCounter], $scope.feedPositions[moduleCounter], dataStr + '[' + moduleCounter + ']', moduleIdStr + '_C_');
              _moduleData += '</div>';
          }
          else
          {
              var moduleState = $scope.rssData[moduleCounter].state;
              if (moduleState == 1 || isEdit) 
              {
                //console.log( $scope.entity.modules[moduleCounter].childTagName);
                _moduleData = $scope.generateModule(isEdit, $scope.entity.modules[moduleCounter],  $scope.rssData[moduleCounter], $scope.feedPositions[moduleCounter], moduleCounter, dataStr + '[' + moduleCounter + ']', moduleIdStr);
              } //if (moduleState == 1 || isEdit)
          }


          if (isEdit) 
          {
            formatedEntries += _moduleData;
          }
          else 
          {
            formatedEntries += $scope.compileEmailAndData(_moduleData);
          }
        }
      }

      //console.log($scope.entity.header + formatedEntries + $scope.entity.footer);
      //console.log($scope.adData);

      //console.log('generateEmail done');
      // console.log($scope.entity);
      var fullEmail = $scope.entity.header + formatedEntries + $scope.entity.footer;
      console.log(fullEmail);
      fullEmail = fullEmail.replace("{{hiddenPreviewText}}", '{{api.scope.hiddenPreviewText}}');
      if(!isEdit)
      {
        fullEmail = $scope.compileEmailAndData(fullEmail);
      }
       
      return fullEmail;
    };

    function _getAdView(isEdit, currentModule, moduleCounter, _adIndex) 
    {
      var _adview = '';
      if (isEdit) 
      {
        _adview += '<div class="static">';
      }


      _adview += currentModule.adViews[0].source;

      _adview = _adview.replace("[[adLink]]", '{{adData[' + moduleCounter + '][' + _adIndex + '].link}}');
      _adview = _adview.replace("[[adImage]]", '{{adData[' + moduleCounter + '][' + _adIndex + '].img}}');

      if (isEdit) 
      {
        _adview += '</div>';
      }


      if (isEdit) 
      {
        return _adview;
      }
      else 
      {
        if ($scope.adData[moduleCounter][_adIndex].booked == true) 
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
      angular.forEach($scope.entity.modules, function (_module) 
      {
        $scope.skipedEntries[moduleCounter] = {};
        if(_module.placeholderType != 'DROPZONE')
        {
          console.log('foreach ' + moduleCounter + ' module type: ' + _module.type);
          $scope.adData[moduleCounter] = _module.ads;    

          $scope.loading = false;

          if (_module.type == "1") 
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
            if (_module.type == "2") 
            {
              promises.push($scope.loadXMLModule(_module.defaultURL, moduleCounter));
            }
            else 
            {
              if (_module.type == "3") 
              {
                //promises.push($scope.loadManualModule(_module, moduleCounter, 0, _module.defaultNumberOfEntries));
              }
              else 
              {
                console.error('unkown module type: ' + _module.type);
              }
            }
          }
        }
        else
        {
           $scope.adData[moduleCounter] = [];
           if($scope.rssData && $scope.rssData[moduleCounter] && $scope.rssData[moduleCounter].length > 0)
           {
             for(var x = 0; x <  $scope.rssData[moduleCounter].length; x++)
             {
                // $scope.adData[moduleCounter][x] = _module.ads;

                $scope.skipedEntries[moduleCounter][x] = {};
             }
           }
        }
        moduleCounter++;
      });

      $q.all(promises).then(function ()
      {
        console.log('ALL PROMISES DONE');
        $scope.your_variable = $scope.generateEmail(true);
        $scope.api.initSortable();
        $scope.checkIfTemplateContainsHiddenPreviewAndSetFlag();
        $scope.firstInit = false;
        $scope.loading = false;
      });
    };

    $scope.init = function (cb) 
    {
      console.log('init');

      var defer = $q.defer();
      var promises = [];

      var moduleCounter = 0;
      //console.log($scope.entity.modules);

      if($scope.entity.modules && $scope.entity.modules.length > 0)
      {
        for (var i = 0; i < $scope.entity.modules.length; i++)
        {
          promises.push(initModule($scope.entity.modules[i], i));
        }

        $q.all(promises).then(function () 
        {
          console.log('ALL PROMISES DONE');
          $scope.your_variable = $scope.generateEmail(true);
          $scope.api.initSortable();
          $scope.checkIfTemplateContainsHiddenPreviewAndSetFlag();
          $scope.firstInit = false;
          $scope.loading = false;
          if(cb)
          {
            return cb();
          }
        });
      }
      else
      {
        if(cb)
        {
          return cb();
        }
      }
    };

    function initModule(_module, moduleCounter, subModuleCounter) 
    {
      console.log('initModule(XXX, ' + moduleCounter + ', ' + subModuleCounter + ' )');
      var promise;
      if (subModuleCounter != undefined)
      {
        $scope.adData[moduleCounter][subModuleCounter] = _module.ads;

        $scope.loading = false;

        $scope.feedPositions[moduleCounter][subModuleCounter] = [];
        $scope.skipedEntries[moduleCounter][subModuleCounter] = {};

        $scope.rssData[moduleCounter][subModuleCounter]                 = [];
        $scope.rssData[moduleCounter][subModuleCounter].state           = 1; //'active'; 
        $scope.rssData[moduleCounter][subModuleCounter].numberOfEntries = _module.defaultNumberOfEntries;
        $scope.rssData[moduleCounter][subModuleCounter].data            = [];
        $scope.rssData[moduleCounter][subModuleCounter].bodyData        = {};
        $scope.rssData[moduleCounter][subModuleCounter].bodyVariables   = {};
        //console.log('defaultNumberOfEntries: '+$scope.entity.modules[moduleCounter].defaultNumberOfEntries);

        if(_module.bodyVariables)
        {
          for (var x = 0; x < _module.bodyVariables.length; x++) 
          {
            $scope.rssData[moduleCounter][subModuleCounter].bodyData[_module.bodyVariables[x].name]       = _module.bodyVariables[x].defaultValue;
            $scope.rssData[moduleCounter][subModuleCounter].bodyVariables[_module.bodyVariables[x].name]  = _module.bodyVariables[x];
          }
        }
        if (_module.type == "1") 
        {
          var deferred = $q.defer();
          promise = deferred.promise;
          $scope.loadRSSModuleWithFeed(_module, moduleCounter, subModuleCounter, 0, _module.defaultNumberOfEntries).then(function(moduleData)
          {
            $scope.rssData[moduleData.modulePos][moduleData.subModulePos].data = moduleData.entries;
            $scope.feedPositions[moduleData.modulePos][moduleData.subModulePos] = moduleData.positions;
            console.log(moduleData);
            deferred.resolve();
          });;
        }
        if (_module.type == "2") 
        {
          var deferred = $q.defer();
          promise = deferred.promise;
          $scope.loadXMLModuleWithFeed(_module, moduleCounter, subModuleCounter, 0, _module.defaultNumberOfEntries).then(function(moduleData)
          {
            $scope.rssData[moduleData.modulePos][moduleData.subModulePos].data = moduleData.entries;
            $scope.feedPositions[moduleData.modulePos][moduleData.subModulePos] = moduleData.positions;
            console.log(moduleData);
            deferred.resolve();
          });
        }

        if (_module.type == "3") 
        {
          var deferred = $q.defer();

          promise = deferred.promise;
          $scope.loadManualModule(_module, moduleCounter, subModuleCounter, 0, _module.defaultNumberOfEntries).then(function (moduleData)
          {
            $scope.rssData[moduleData.modulePos][moduleData.subModulePos].data = moduleData.entries;
            $scope.feedPositions[moduleData.modulePos][moduleData.subModulePos] = moduleData.positions;
            console.log(moduleData);
            deferred.resolve();
          });
        }
      }
      else
      {
        if (_module.placeholderType == 'DROPZONE')
        {
          var deferred = $q.defer();
          //console.log('foreach '+moduleCounter+ ' module type: '+_module.type);
          $scope.adData[moduleCounter] = [];
          $scope.modulePositions[moduleCounter] = [];

          $scope.loading = false;

          $scope.feedPositions[moduleCounter] = [];
          $scope.skipedEntries[moduleCounter] = [];

          $scope.rssData[moduleCounter] = [];
          // $scope.rssData[moduleCounter].state = 1; //'active'; 
          // $scope.rssData[moduleCounter].numberOfEntries = $scope.entity.modules[moduleCounter].defaultNumberOfEntries;

          // $scope.rssData[moduleCounter].data = [];

          $scope.rssData[moduleCounter].bodyData = {};
          $scope.rssData[moduleCounter].bodyVariables = {};

          deferred.resolve();
          promise = deferred.promise;
        }
        else
        {
          //console.log('foreach '+moduleCounter+ ' module type: '+_module.type);
          $scope.adData[moduleCounter] = _module.ads;

          $scope.loading = false;

          $scope.feedPositions[moduleCounter] = [];
          $scope.skipedEntries[moduleCounter] = {};

          $scope.rssData[moduleCounter] = [];
          $scope.rssData[moduleCounter].state = 1; //'active'; 
          $scope.rssData[moduleCounter].numberOfEntries = _module.defaultNumberOfEntries;
          //console.log('defaultNumberOfEntries: '+$scope.entity.modules[moduleCounter].defaultNumberOfEntries);
          $scope.rssData[moduleCounter].data = [];

          $scope.rssData[moduleCounter].bodyData = {};
          $scope.rssData[moduleCounter].bodyVariables = {};
          if(_module.bodyVariables)
          {
            for (var x = 0; x < _module.bodyVariables.length; x++) 
            {
              $scope.rssData[moduleCounter].bodyData[_module.bodyVariables[x].name]      = _module.bodyVariables[x].defaultValue;
              $scope.rssData[moduleCounter].bodyVariables[_module.bodyVariables[x].name] = _module.bodyVariables[x];
            }
          }

          $scope.modulePositions[moduleCounter] = 0;

          if (_module.type == "1") 
          {
            var deferred = $q.defer();
            promise = deferred.promise;
            $scope.loadRSSModuleWithFeed(_module, moduleCounter, subModuleCounter, 0, _module.defaultNumberOfEntries).then(function(moduleData)
            {
              $scope.rssData[moduleData.modulePos].data  = moduleData.entries;
              $scope.feedPositions[moduleData.modulePos] = moduleData.positions;
              console.log(moduleData);
              deferred.resolve();
            });;
          }
          else 
          {
            if (_module.type == "2") 
            {
              var deferred = $q.defer();
              promise = deferred.promise;
              $scope.loadXMLModuleWithFeed(_module, moduleCounter, subModuleCounter, 0, _module.defaultNumberOfEntries).then(function(moduleData)
              {
                $scope.rssData[moduleData.modulePos].data  = moduleData.entries;
                $scope.feedPositions[moduleData.modulePos] = moduleData.positions;
                console.log(moduleData);
                deferred.resolve();
              });
            }
            else 
            {
              if (_module.type == "3") 
              {
                var deferred = $q.defer();

                promise = deferred.promise;
                $scope.loadManualModule(_module, moduleCounter, subModuleCounter, 0, _module.defaultNumberOfEntries).then(function (moduleData)
                {
                  console.log('loadManualModule cb');
                  $scope.rssData[moduleData.modulePos].data  = moduleData.entries;
                  $scope.feedPositions[moduleData.modulePos] = moduleData.positions;
                  console.log(moduleData);
                  deferred.resolve();
                });
              }
              else 
              {
                console.error('unkown module type: ' + _module.type);
              }
            }
          }
        }

        moduleCounter++;
      }

      return promise;
    };
                                                                 
    $scope.checkIfTemplateContainsHiddenPreviewAndSetFlag = function()
    {
      if($scope.your_variable.indexOf('{{api.scope.hiddenPreviewText}}') > -1)
      {
        $scope.containsHiddenPreview = true;
      }
      
    }

    $scope.checkAd2 = function (adData, index)
    {
      //console.log('checkAd2 ('+moduleCounter+', '+index+')');
      var deferred = $q.defer();
      //console.log($scope.adData[moduleCounter][index].img);

      Emaileditor.checkAdvertisment().query(
        {
          url: adData[index].img
        },
        function (dimensions)
        {
          console.log('checkAdvertisment');
          //console.log(dimensions[0].height);
          if (dimensions == null || dimensions.length == 0)
          {
            adData[index].booked = false;
          }
          else
          {
            if (dimensions[0].height == 1)
            {
              adData[index].booked = false;
              //console.log('yes');
            }
            else
            {
              adData[index].booked = true;
              //console.log('no');
            }
          }

          deferred.resolve();
        },function (error)
        {
          console.error('checkAdvertisment error');
          $scope.errorMsgs = [];
          $scope.errorMsgs.push({ param: adData[index].img, msg: 'couldnt check if the ad was booked' });

          adData[index].booked = true;
          deferred.resolve();
        }
      );

      return deferred.promise;
    }

    $scope.checkAds = function (cb)
    {
      //console.log('checkAds');

      var defer = $q.defer();
      var promises = [];

      var moduleCounter = 0;
      //console.log($scope.entity.modules);

      //console.log($scope.entity.modules);
      angular.forEach($scope.adData, function (_module)
      {
        if($scope.adData[moduleCounter])
        {
          for (var i = 0; i < $scope.adData[moduleCounter].length; i++)
          {
            if($scope.adData[moduleCounter].constructor === Array)
            {
              //TODO
              console.warn('ads in submodules not yet supported')
            }
            else
            {
              promises.push($scope.checkAd2($scope.adData[moduleCounter], i));
            }
          }
        }

        moduleCounter++;
      });

      $q.all(promises).then(function ()
      {
        //console.log('ALL PROMISES DONE');
        return cb();
      });
    };

    $scope.loadManualModule = function (currentModule, modulePos, subModulePos, from, to) 
    {
      console.log('loadManualModule from:' + from + ' to:' + to);
      var deferred = $q.defer();

      var moduleData = {};
      moduleData.entries      = [];
      moduleData.positions    = [];
      moduleData.modulePos    = modulePos;
      moduleData.subModulePos = subModulePos;

      for (var i = from; (i < to); i++) 
      {
        moduleData.entries[i]           = moduleData.entries[i] || {};
        moduleData.entries[i].state     = 1;
        moduleData.entries[i]._view     = currentModule.views[0];
        
        for (var x = 0; x < currentModule.views.length; x++)
        {
          if (currentModule.views[x].isDefault == true)
          {
            moduleData.entries[i]._view = currentModule.views[x];
          }
        }
        moduleData.entries[i].data      = {};
        moduleData.entries[i].variables = {};

        for (var x = 0; x < currentModule.variables.length; x++) 
        {
          moduleData.entries[i].data[currentModule.variables[x].name]       = currentModule.variables[x].defaultValue;
          moduleData.entries[i].variables[currentModule.variables[x].name]  = currentModule.variables[x];
        }

        moduleData.entries[i]._view.label   = moduleData.entries[i]._view.name;
        moduleData.entries[i]._view.source  = moduleData.entries[i]._view.source.replace(/(\r\n|\n|\r)/gm, "");
        moduleData.entries[i]._pos = i;

        moduleData.positions[i] = i;
      }

      deferred.resolve(moduleData);
      return deferred.promise;
    };

    function improveRSSfeed(rssFeed) 
    {
      // console.log('improveRSSfeed');

      if (rssFeed != null)
      {
        for (var i = 0; i < rssFeed.length; i++)
        {
          var currentEntry = rssFeed[i];

          var re = /\<img.*?\>/g;
          var subRe = /src=\".*?\"/g;
          var match = '';
          var subMatch = '';
          var matches = [];
          var _images = [];

          if (currentEntry.content != null)
          {
            while ((match = re.exec(currentEntry.content)) != null)
            {
              //console.log("match found at " + match.index);
              //console.log(match[0].length);
              //console.log(match);

              var posSrc = match[0].indexOf('src=');
              //console.log(posSrc);
              var imgUrl = match[0].substring(posSrc + 5);
              //console.log(imgUrl);
              imgUrl = imgUrl.substring(0, imgUrl.indexOf("\""));
              //console.log(imgUrl);

              _images.push(imgUrl);
            }

            currentEntry.content = currentEntry.content.replace(/<img(?:.|\n)*?>/gm, '');
          }

          if (_images.length > 1)
          {
            //console.log('improveRSSfeed in this entry there are more than 1 entries: #'+_images.length);
            currentEntry.imageUrl = _images[0];
          }

          if (_images.length == 1)
          {
            currentEntry.imageUrl = _images[0];
          }

          rssFeed[i] = currentEntry;
        }
      }
      //console.log(feed);

      return rssFeed;
    }

    function loadRssFeed(url, modulePos, subModulePos)
    {
      var deferred = $q.defer();
      console.log('loadRssFeed(' + url + ',' + modulePos + ')');

      Emaileditor.parseRSSFeed().query({ url: url }, function (rss)
      {
        //console.log('parseRSSFeed() callback');
        //console.log(rss);

        if ((rss != null) && (rss[0] != null) && (rss[0].entries != null))
        {
          if(subModulePos)
          {
            if(!feeds[modulePos])
            {
              feeds[modulePos] = [];
            }

            feeds[modulePos][subModulePos] = improveRSSfeed(rss[0].entries);
          }
          else
          {
            feeds[modulePos] = improveRSSfeed(rss[0].entries);
          }
        }
        else
        {
          $scope.errorMsgs.push({ param: 'rss feed', msg: 'response is empty ' });
        }

        deferred.resolve();
      },
      function (error)
      {
        //console.log('loadRssFeed error');
        //console.log(error.data);
        feeds[modulePos] = [];
        $scope.errorMsgs = $scope.errorMsgs.concat(error.data);
        deferred.resolve();
      });

      return deferred.promise;
    }

    function loadXMLFeed(url, modulePos, subModulePos)
    {
      var deferred = $q.defer();

      XMLFeed.query({ url: url }, function (feed)
      {
        // console.log('xml feed cb');

        feeds[modulePos] = [];
        var _isValid = false;

        if (feed != null && feed.length > 0)
        {
          var keys = Object.keys(feed[0]);
          // console.log(keys);
          if (keys.length == 1)
          {
            var subKeys = Object.keys(feed[0][keys[0]]);
            // console.log(subKeys);
            if (subKeys.length == 1)
            {
              //for(var arrayholder in feed[0][index])
              //{
              // console.log(arrayholder);
              var dataArray = feed[0][keys[0]][subKeys[0]];

              // feeds[modulePos] = dataArray;
              if(subModulePos)
              {
                feeds[modulePos][subModulePos] = dataArray;
              }
              else
              {
                feeds[modulePos] = dataArray;
              }
              _isValid = true;
              deferred.resolve();
              //}
            }
          }
        }

        if (!_isValid)
        {
          $scope.errorMsgs.push({ param: 'xml feed', msg: 'there was an issue loading ' + url });
          deferred.resolve();
        }
      });

      return deferred.promise;
    }

    $scope.loadRSSModuleWithFeed = function (module, modulePos, subModulePos, from, to) 
    {
      var deferred = $q.defer();
      $scope.loading = false;

      loadRssFeed(module.defaultURL, modulePos, subModulePos).then(function () 
      {
        $scope.loadRSSModule(module, modulePos, subModulePos, from, to).then(function(moduleData)
        {
          // console.log('loadRSSModuleWithFeed --> resolve');
          deferred.resolve(moduleData);
        });
      });

      return deferred.promise;
    };

    $scope.loadXMLModuleWithFeed = function (module, modulePos, subModulePos, from, to)
    {
      var deferred = $q.defer();
      $scope.loading = false;

      loadXMLFeed(module.defaultURL, modulePos, subModulePos).then(function ()
      {
        $scope.loadXMLModule(module, modulePos, subModulePos, from, to).then(function(moduleData)
        {
          // console.log('loadXMLModuleWithFeed --> resolve');
          deferred.resolve(moduleData);
        });
      });

      return deferred.promise;
    };

    $scope.loadRSSModule = function (currentModule, modulePos, subModulePos, from, to)
    {
      console.log('loadRSSModule ' + modulePos);
      var deferred = $q.defer();
      $scope.loading = false;

      var moduleData          = {};
      moduleData.entries      = [];
      moduleData.positions    = [];
      moduleData.modulePos    = modulePos;
      moduleData.subModulePos = subModulePos;

      //console.log(feeds[modulePos]);
      var rssFeed;
      if(subModulePos)
      {
        rssFeed = feeds[modulePos][subModulePos];
      }
      else
      {
        rssFeed = feeds[modulePos];
      }

      if (rssFeed != null)
      {
        var i = parseInt(from);
        //console.log(i+' = '+parseInt(from)+'; (('+i+' < '+to+') && ('+i+' < '+rssFeed.length+'));');
        //console.log(i < to);
        //console.log(i < rssFeed.length);
        //console.log(((i < to) && (i < rssFeed.length)));
        for (var i = parseInt(from); ((i < parseInt(to)) && (i < rssFeed.length)); i++)
        {
          //console.log('i:'+i);
          moduleData.entries[i]                 = moduleData.entries[i] || {};
          moduleData.entries[i].state           = 1;
          moduleData.entries[i].author          = rssFeed[i].author;
          moduleData.entries[i].categories      = rssFeed[i].categories;
          moduleData.entries[i].content         = rssFeed[i].content;
          moduleData.entries[i].image           = rssFeed[i].imageUrl;
          //moduleData.entries[i].contentSnippet= rssFeed[i].contentSnippet;
          moduleData.entries[i].link            = rssFeed[i].link;
          moduleData.entries[i].publishedDate   = rssFeed[i].publishedDate;
          moduleData.entries[i].author          = rssFeed[i].author;
          moduleData.entries[i].enclosure       = rssFeed[i].enclosure;
          // moduleData.entries[i].htmlTitle    = $sce.trustAsHtml(rssFeed[i].title);
          moduleData.entries[i].title           = rssFeed[i].title;
          moduleData.entries[i]._view           = currentModule.views[0];

          for (var x = 0; x < currentModule.views.length; x++)
          {
            if (currentModule.views[x].isDefault == true)
            {
              moduleData.entries[i]._view = currentModule.views[x];
            }
          }

          moduleData.entries[i].data      = {};
          moduleData.entries[i].variables = {};
          for (var x = 0; x < currentModule.variables.length; x++)
          {
            moduleData.entries[i].data[currentModule.variables[x].name]      = currentModule.variables[x].defaultValue;
            moduleData.entries[i].variables[currentModule.variables[x].name] = currentModule.variables[x];
          }

          moduleData.entries[i]._view.label   = moduleData.entries[i]._view.name;
          moduleData.entries[i]._view.source  = moduleData.entries[i]._view.source.replace(/(\r\n|\n|\r)/gm, "");
          moduleData.entries[i]._pos = i;

          //console.log(moduleData.entries[i]);
          moduleData.positions[i] = i;
        }

        //console.log($scope.rssData[modulePos]);
        deferred.resolve(moduleData);
      }
      else
      {
        deferred.reject(rss.status);
      }

      //console.log('parseRSSFeed() callback done');

      return deferred.promise;
    };

    $scope.loadXMLModule = function (currentModule, modulePos, subModulePos, from, to) 
    {
      console.log('loadXMLModule');
      var deferred = $q.defer();
      $scope.loading = false;

      var moduleData          = {};
      moduleData.entries      = [];
      moduleData.positions    = [];
      moduleData.modulePos    = modulePos;
      moduleData.subModulePos = subModulePos;

      //console.log(feeds[modulePos]);
      var xmlFeed;
      if(subModulePos)
      {
        xmlFeed = feeds[modulePos][subModulePos];
      }
      else
      {
        xmlFeed = feeds[modulePos];
      }

      for (var i = from; ((i < to) && (i < xmlFeed.length)); i++) 
      {
        moduleData.entries[i]       = moduleData.entries[i] || {};
        moduleData.entries[i].state = 1;

        for (var xmlVarCounter = 0; xmlVarCounter < currentModule.xmlVariables.length; xmlVarCounter++) 
        {
          var feedValue = xmlFeed[i][currentModule.xmlVariables[xmlVarCounter].name];

          moduleData.entries[i][currentModule.xmlVariables[xmlVarCounter].name] = feedValue[0];
        }

        moduleData.entries[i]._view     = currentModule.views[0];

        for (var x = 0; x < currentModule.views.length; x++)
        {
          if (currentModule.views[x].isDefault == true)
          {
            moduleData.entries[i]._view = currentModule.views[x];
          }
        }
        moduleData.entries[i].data      = {};
        moduleData.entries[i].variables = {};

        for (var x = 0; x < currentModule.variables.length; x++) 
        {
          moduleData.entries[i].data[currentModule.variables[x].name]       = currentModule.variables[x].defaultValue;
          moduleData.entries[i].variables[currentModule.variables[x].name]  = currentModule.variables[x];
        }

        moduleData.entries[i]._view.label   = moduleData.entries[i]._view.name;
        moduleData.entries[i]._view.source  = moduleData.entries[i]._view.source.replace(/(\r\n|\n|\r)/gm, "");
        moduleData.entries[i]._pos          = i;

        moduleData.positions[i] = i;
      }

      //console.log($scope.rssData);
      // console.log('loadXMLModule() callback done');

      deferred.resolve(moduleData);
      return deferred.promise;
    };

    $scope.today = function () 
    {
      $scope.dt = new Date();
    };

    $scope.setinXDays = function (days) 
    {
      var oldDateObj = $scope.dt;
      if (oldDateObj == null || oldDateObj == undefined) 
      {
        oldDateObj = new Date();
      }

      var now = new Date();
      oldDateObj.setDate(now.getDate());
      oldDateObj.setMonth(now.getMonth());
      oldDateObj.setFullYear(now.getFullYear());

      var now = new Date();

      $scope.dt = new Date(oldDateObj.getTime() + days * 86400000);;
    };

    $scope.setTimeinXMinutes = function (minutes) 
    {
      var oldDateObj = $scope.dt;
      if (oldDateObj == null || oldDateObj == undefined) 
      {
        oldDateObj = new Date();
      }
      var now = new Date();
      oldDateObj.setHours(now.getHours());
      oldDateObj.setMinutes(now.getMinutes());
      oldDateObj.setSeconds(now.getSeconds());
      oldDateObj.setMilliseconds(now.getMilliseconds());

      if (minutes > 0) 
      {
        $scope.dt = new Date(oldDateObj.getTime() + minutes * 60000);
      }
      else
      {
        $scope.dt = new Date(oldDateObj.getTime());
      }
    };

    $scope.open1 = function () 
    {
      $scope.popup1.opened = true;
    };

    function message(type, param, msg)
    {
      if(type == 1)
      {
        $scope.errorMsgs.push({ param: param, msg: msg });
      }
    }
   
    function errorMessage(param, msg)
    {
      message(1, param, msg);
    }
  }]);
