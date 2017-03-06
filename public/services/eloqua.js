'use strict';

angular.module('mean.emaileditor').factory("Eloqua", ['$resource',
    function($resource) 
    {   
        function getEmailModule()
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

        function getSegments()
        {
           return $resource('/api/:company/emaileditor/segments/:id',
            {
                id: '@_id',
                company: '@company'
            });
        }   

        function getEmailGroups()
        {
            return $resource('/api/:company/emaileditor/emailgroups/',
            {
                company: '@company'
            });
        }

        function getEmailHeaders()
        {
            return $resource('/api/:company/emaileditor/emailheaders/',
            {
                company: '@company'
            });
        }

        function getEmailFooters()
        {
            return $resource('/api/:company/emaileditor/emailfooters/',
            {
                company: '@company'
            });
        }

        function eloquaEmail()
        {
           return $resource('/api/:company/emaileditor/eloquaemail/:eloquaEmailId/', 
            {
                eloquaEmailId: '@id',
                company: '@company'
            });
        }    

        function eloquaTestEmail()
        {
           return $resource('/api/:company/emaileditor/sendtestemail/',
            {
                company: '@company'
            });
        }      

        function eloquaCampaign()
        {
           return $resource('/api/:company/emaileditor/scheduleemail/:eloquaCampaignId/', 
            {
                eloquaCampaignId: '@id',
                company: '@company'
            });
        }   
        function eloquaCampaignUnschedule()
        {
           return $resource('/api/:company/emaileditor/unscheduleemail/:eloquaCampaignId/', 
            {
                eloquaCampaignId: '@id',
                company: '@company'
            });
        }

        function eloquaEmailEncoding()
        {
           return $resource('/api/:company/emaileditor/emailencoding', 
            {
                company: '@company'
            });
        }

        return {
            emailModule: getEmailModule,
            segments: getSegments,
            emailGroups: getEmailGroups,
            emailHeaders: getEmailHeaders,
            emailFooters: getEmailFooters,
            eloquaEmail: eloquaEmail,
            eloquaCampaign: eloquaCampaign,
            eloquaTestEmail: eloquaTestEmail,
            eloquaCampaignUnschedule: eloquaCampaignUnschedule,
            eloquaEmailEncoding: eloquaEmailEncoding
        };
    }
]);
