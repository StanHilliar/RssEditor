angular.module('mean.emaileditor').directive('ngDndEditor', function () 
{
    function DnDEditorController(scope) 
    {
        this.handlers = 
        {
            showAnnotations: []
        }
    }

    DnDEditorController.prototype.onShowAnnotations = function(handler)
    {
        this.handlers.showAnnotations.push(handler);
    }

    DnDEditorController.prototype.iFrameLoaded = function(param)
    {
        console.log('iFrameLoaded');
        console.log(param);
    }

    return {    
        restrict: 'E',
        transclude: true,
        controller: ['$scope', DnDEditorController],
        template: '<div class="dndEditor" ng-transclude></div>'
    };
    /*
    return {
        link: function ($scope, element, attrs) 
        {
            console.log('ngDndEditor');
            var el = element[0].querySelector('#sortable');
            console.log(el);
            var sortable = Sortable.create(el,
            {
                
            });

            var elInner = element[0].querySelector('#frame').contentWindow.document.getElementById('sortable');
            console.log(element[0].querySelector('#frame'));
            console.log(element[0].querySelector('#frame').contentWindow.document.getElementById('sortable'));
            Sortable.create(elInner, 
            {
         
            });
        }
    };*/
});