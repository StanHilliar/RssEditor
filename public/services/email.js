'use strict';

angular.module('mean.emaileditor').factory("Email", ['$resource',
    function($resource) 
    {
        return $resource('/api/:company/emaileditor/email/:emailId', 
        {
            emailId: '@_id',
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
