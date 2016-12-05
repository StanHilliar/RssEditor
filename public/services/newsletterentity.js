'use strict';

angular.module('mean.emaileditor').factory("NewsletterEntity", ['$resource',
    function($resource) 
    {
        return $resource('/api/emaileditor/newsletterentity/:entityId', 
        {
            entityId: '@_id'
        }, 
        {
            update: 
            {
                method: 'PUT'
            }
        });
    }
]);
