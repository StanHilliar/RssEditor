'use strict';

angular.module('mean.emaileditor').factory("EmailModule", ['$resource',
    function($resource) 
    {
        return $resource('/api/emaileditor/emailmodule/:moduleId/', 
        {
            moduleId: '@_id'
        }, 
        {
            update: 
            {
                method: 'PUT'
            }
        });
    }
]);
