'use strict';

angular.module('mean.emaileditor').factory("NewsletterEntity", ['$resource',
    function($resource) 
    {
        return $resource('/api/:company/emaileditor/newsletterentity/:entityId', 
        {
            entityId: '@_id',
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
