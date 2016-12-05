'use strict';

/* jshint -W098 */
angular.module('mean.emaileditor').controller('EmailModuleEditController', ['$scope','$stateParams','$compile', '$interpolate', '$parse', '$sce', 'Global', 'EmailModule', 'Eloqua', 'XMLFeed', 
  function($scope, $stateParams, $compile, $interpolate, $parse, $sce, Global, EmailModule, Eloqua, XMLFeed) 
  {
    $scope.global = Global;
    $scope.package = 
    {
      name: 'emaileditor'
    };

    $scope.your_variable = '';
    $scope.rssContent = 'omg';
    $scope.test1234 = 'omg';

    $scope.availableTypes = [
      {_id: '1', name: 'rss'},
      {_id: '2', name: 'xml'},
      {_id: '3', name: 'manual'}
    ];        

     $scope.availableFieldTypes = [
      {_id: '1', name: 'text'},
      {_id: '2', name: 'textarea'}
    ];     

    $scope.numberOfEntries = [
      {_id: '0', name: '1'},
      {_id: '1', name: '3'},
      {_id: '2', name: '5'},
      {_id: '3', name: '10'},
      {_id: '4', name: 'l5'}
    ];       

     $scope.availableSegments = [
      {_id: '1', name: 'test1'},
      {_id: '2', name: 'aaa'},
      {_id: '3', name: 'bbb'}
    ];    

    $scope.availableModules = [
      {_id: '1', name: 'module1'},
      {_id: '2', name: 'module2'},
      {_id: '3', name: 'rss module'},
      {_id: '4', name: 'xml module'},
    ];

    $scope.selected = []; 
    $scope.availableModule = []; 
    $scope.selectedModule = []; 
   // $scope.selectedSegments = []; 

    $scope.module = {};
    $scope.module.name = '';
    $scope.module.defaultURL = '';
    $scope.module.defaultNumberOfEntries = '';
    $scope.module.type = [];
    $scope.module.header = '';
    $scope.module.preBody = '';
    $scope.module.postBody = '';
    $scope.module.footer = '';
    $scope.module.ads = [];

    $scope.module.views = [];
    $scope.module.variables = [];
    $scope.module.xmlVariables = [];

    $scope.module.adViews = [];
    $scope.module.adViews.push(
    {
      _id: '',
      name: '',
      source: ''
    });
    
    $scope.module.createdBy = '';
    $scope.module.updatedBy = '';


    $scope.moduleExsists = false;
    $scope.saveInProgress = false;
    $scope.selectedSegments = [];

    $scope.errorMsgs = [];

   

    if($stateParams.newsletterid)
    {
      $scope.moduleExsists = true;
        
      console.log('loadNewsletterEntitiy');

      EmailModule.query({moduleId: $stateParams.newsletterid}, function(newsletterEntityArray)
      {
        $scope.module = newsletterEntityArray[0];

        if($scope.module.xmlVariables == null)
        {
          $scope.module.xmlVariables = [];
        }
        for(var i = 0; i < $scope.numberOfEntries.length; i++)
        {
          console.log($scope.numberOfEntries[i].name+' == '+$scope.module.defaultNumberOfEntries);
          if($scope.numberOfEntries[i].name == $scope.module.defaultNumberOfEntries)
          {
            console.log('yeessss');
            $scope.selecteddefaultNumberOfEntries =  $scope.numberOfEntries[i]._id;
          }
        }
      /*  var _trash = [];
        for(var i = 0; i < $scope.module.segments.length; i++)
        {
          for(var j = 0; j < $scope.availableSegments.length; j++)
          {
            if($scope.module.segments[i]._id == $scope.availableSegments[j]._id)
            { 
              $scope.moveItem($scope.availableSegments[j], $scope.availableSegments, _trash);
              break;
            }
          }
        }
        for(var i = 0; i < $scope.module.modules.length; i++)
        {
          for(var j = 0; j < $scope.availableModules.length; j++)
          {
            if($scope.module.modules[i]._id == $scope.availableModules[j]._id)
            { 
              $scope.moveItem($scope.availableModules[j], $scope.availableModules, _trash);
              break;
            }
          }
        }*/
    
      });
    
    
     }

    $scope.addView = function() 
    {
       $scope.module.views.push(
        {
          _id: '',
          name: '',
          source: '',
          variables: []
        });
    };   

    $scope.removeView = function(index) 
    {
      console.log('removeView('+index+')');
      $scope.module.views.splice(index, 1);
    };

    $scope.addAd = function() 
    {
       $scope.module.ads.push(
        {
          _id: '',
          pos: '',
          img: '',
          link: ''
        });
    };   

    $scope.removeAd = function(index) 
    {
      console.log('removeAd('+index+')');
      $scope.module.ads.splice(index, 1);
    };

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

    $scope.parse = function(index)
    {
      console.log('parse ('+index+')');
     
       parseViewByIndex(index);
    };

    $scope.parseAll = function()
    {
      console.log('parse All');
     
       parseAll();
    };    

    $scope.removeVariable = function(name)
    {
      console.log('removeVariable('+name+')');

      var indextobedelted = -1;
     
      for(var m = 0; m < $scope.module.variables.length; m++)
      { 
        if(name == $scope.module.variables[m].name)
        {
          indextobedelted = m;
        }
      }

      if(indextobedelted != -1)
      {
        $scope.module.variables.splice(indextobedelted,1);
      }
    };

    function parseViewByIndex(index)
    {
      var re = /\{\{C_.*?\}\}/g;
      var match = '';

      var matches = [];

      var _variables = [];
      var _variablesHash = {};
 
      while ((match = re.exec($scope.module.views[index].source)) != null) 
      {
          //console.log("match found at " + match.index);
          //console.log(match[0].length);
         // console.log(match);
          var _name = match[0].substring(2, match[0].length-2);
          var _label = _name;
          //console.log(_name);
          if(_variablesHash[_name] != true)
          {
            _variablesHash[_name] = true
            _variables.push({name: _name, label: _label, defaultValue: '', fieldType: '1', inUse: true});
          }
      }

      $scope.module.views[index].variables = _variables;
    }

    function parseAll()
    {
      var _variables = [];
      var _variablesHash = {};


      for(var i = 0; i <$scope.module.variables.length; i++)
      {
        var currentVar = $scope.module.variables[i];
        _variablesHash[currentVar.name] = true;
        _variables.push({name: currentVar.name, label: currentVar.label, defaultValue: currentVar.defaultValue, fieldType: currentVar.fieldType});
      }

      for(var i = 0; i < $scope.module.views.length; i++)
      {
        //console.log('i:'+i);
        parseViewByIndex(i);

        for(var x = 0; x <  $scope.module.views[i].variables.length; x++)
        {
          //console.log('x:'+x);
          var _name  = $scope.module.views[i].variables[x].name;
          var _label = $scope.module.views[i].variables[x].label;

          if(_variablesHash[_name] != true)
          {
            _variablesHash[_name] = true
            _variables.push({name: _name, label: _label, defaultValue: '', fieldType: '1', inUse: true});
          }
        }
      }

      $scope.module.variables = _variables;

      for(var m = 0; m < $scope.module.variables.length; m++)
      {
        var foundVar = false;

        for(var i = 0; i < $scope.module.views.length; i++)
        {
          for(var x = 0; x <  $scope.module.views[i].variables.length; x++)
          {
            var _name = $scope.module.views[i].variables[x].name;
            console.log(_name+' == '+ $scope.module.variables[m].name);
            if(_name == $scope.module.variables[m].name)
            {
              console.log('yes');
              foundVar = true;
            }
          } 
        }

        if(foundVar == false)
        {
          $scope.module.variables[m].inUse = false
        }
        else
        {
          $scope.module.variables[m].inUse = true;
        }
      }


      for(var i = 0; i < $scope.numberOfEntries.length; i++)
      {
        if($scope.numberOfEntries[i]._id == $scope.selecteddefaultNumberOfEntries)
        {
          $scope.module.defaultNumberOfEntries =  $scope.numberOfEntries[i].name;
        }
      }

      if($scope.module.type == "2")
      {
        parseXMLFeed();
      }
    }

    function parseXMLFeed()
    {
      console.log('parseXMLFeed');
      var hashKeys = {};

      XMLFeed.query({url: $scope.module.defaultURL}, function(feed)
      {
          for(var index in feed[0])
          {
            for(var arrayholder in feed[0][index])
            {
              //console.log(arrayholder);
              var dataArray = feed[0][index][arrayholder];
              for(var i = 0; i < dataArray.length; i++)
              {
                for(var key in dataArray[i])
                {
                  //console.log(key);
                  if(hashKeys[key] != 1)
                  {
                    hashKeys[key] = 1;

                    $scope.module.xmlVariables.push({name: key, label: 'X_'+key});
                  }
                }
              }
            }
          }
      });
    }

    $scope.save = function()
    {
      console.log('saveNewsletterEntitiy');
      $scope.saveInProgress = true;

      parseAll();

      var emailmodule = new EmailModule($scope.module);

      emailmodule.$save(function(data, headers) 
      {
        $scope.module = data;
        $scope.errorMsgs = null;
        $scope.moduleExsists = true;
        $scope.saveInProgress = false;

      }, 
      function(data, headers) 
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

      parseAll();
     
      //$scope.module.ads = [];

      $scope.module.$save(function(data, headers) 
      {
        $scope.module = data;
        $scope.saveInProgress = false;
      }, function(data, headers) 
      {
        $scope.errorMsgs = data.data;
        $scope.saveInProgress = false;
      });

    };   

  }
]).controller('EmailModuleOverviewController', ['$scope','$compile', '$interpolate', '$sce', 'Global', 'EmailModule',
  function($scope, $compile, $interpolate, $sce, Global, EmailModule) 
  {
    $scope.global = Global;
    $scope.package = 
    {
      name: 'emaileditor'
    };

    $scope.destroyModule = function(moduleId)
    {
      console.log('destroyModule');

      console.log(moduleId);

      //EmailModule.find({ moduleId: moduleId }).remove().exec();
      
      EmailModule.remove({moduleId: moduleId}, function(_emailModule)
      {
        console.log('destroyModule callback');
        console.log(_emailModule);
        var _emailModuleIndex = -1;
        for(var i  = 0; i < $scope.modules.length; i++)
        {
          if($scope.modules[i]._id == moduleId)
          {
            _emailModuleIndex = i;
          }
        }
        $scope.modules.splice(_emailModuleIndex ,1);
        //_emailModule.remove();
     });
    };

    $scope.list = function()
    {
      console.log('list Email Modules');


      EmailModule.query({}, function(response)
      {
        console.log('list callback');
        console.log(response);
        $scope.modules = response;
      });
    };   

    $scope.list();



  }
]);
