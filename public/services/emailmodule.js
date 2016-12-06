'use strict';

angular.module('mean.emaileditor').factory("EmailModule", ['$resource',
    function($resource) 
    {
        return $resource('/api/:company/emaileditor/emailmodule/:moduleId/', 
        {
            moduleId: '@_id',
            company: '@company'
        }, 
        {
            update: 
            {
                method: 'PUT'
            }
        });
    }
]);
