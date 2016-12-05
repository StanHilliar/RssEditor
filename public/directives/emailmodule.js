angular.module('mean.emaileditor').directive('ngSimonTest', function() 
{
   return {
        link: function(scope, element, attributes){

        	console.log('...................OMG------------------------------');
            //this is designed for directive configuration if there's a alot of configuration parameters
            //one can combine this with interpolation, if the configuration is a JSON string
           // var obj = scope.$eval(attributes.myDirective);
            //can also fallback as a string
            //var string = scope.$eval(attributes.anotherParam);

           // console.log(obj);
           /*
            console.log(scope);

            var tstXX = Array.prototype.map.call(scope.$$watchers, function(watcher) 
            {
             	var getType = {};
             	if(watcher.exp && getType.toString.call(watcher.exp) === '[object Function]')
             	{
             		return watcher.exp.parts[1];
             	}
             	else
             	{
          			return watcher.exp // ['firstname', 'lastname']
             	}
             	
      		});
            console.log(tstXX);*/


        }
    };
});