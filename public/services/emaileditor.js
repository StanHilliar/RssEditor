'use strict';

angular.module('mean.emaileditor').service('Emaileditor', ['$resource', '$http',
function($resource, $http)
{
    function getEmailTemplate()
    {
        //return $resource('/api/emaileditor/templates');
        return $resource('/api/:company/emaileditor/newsletterentityfull/:entityId', 
        {
            entityId: '@_id',
            company: '@company'
        });
    }

    function checkAdvertisment()
    {        
        return $resource('/api/emaileditor/checkadvertisment/:url', 
        {
            url: '@_id'
        });
    }

    function parseRSSFeed(url)
    {
        //var randomNum = new Date().getTime() +''+ Math.floor((Math.random() * 10000) + 1);
        //return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url+'?'+randomNum));     
        return $resource('/api/emaileditor/rss/:url/', 
        {
            url: '@url'
        });
    }




    function saveEmail(data)
    {
    	return $http({
            method : 'POST',
            url : '/api/emaileditor/saveemail',
            data : data
        });
    }

    function getAllTemplates()
    {
        return $http({
            method : 'GET',
            url : '/api/emaileditor/template/all'
        });
    }

    function saveTemplate(data)
    {
        return $http({
            method : 'POST',
            url : '/api/emaileditor/template/create',
            data : data
        });
    }

    return {
 
        getEmailTemplate: getEmailTemplate,
        saveEmail: saveEmail,
        getAllTemplates: getAllTemplates,
        checkAdvertisment: checkAdvertisment,
        saveTemplate: saveTemplate,
        parseRSSFeed: parseRSSFeed
    };
  }
]);
