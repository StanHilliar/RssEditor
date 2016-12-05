'use strict';

angular.module('mean.emaileditor').factory("XMLFeed", ['$resource',
    function($resource) 
    {
        return $resource('/api/emaileditor/xml/:url/', 
        {
            url: '@url'
        });
    }
]);
