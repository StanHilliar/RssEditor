'use strict';

angular.module('mean.emaileditor').factory("EloquaService", ['$resource',
    function($resource) 
    {   
        function getEmailModule()
        {
            return $resource('/api/emaileditor/emailmodule/:moduleId/', 
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
           return $resource('/api/emaileditor/segments/:id',
            {
                id: '@_id',
                company: '@company'
            });
        }   

        function getEmailGroups()
        {
            return $resource('/api/emaileditor/emailgroups/',
            {
                company: '@company'
            });
        }

        function getEmailHeaders()
        {
            return $resource('/api/emaileditor/emailheaders/',
            {
                company: '@company'
            });
        }

        function getEmailFooters()
        {
            return $resource('/api/emaileditor/emailfooters/',
            {
                company: '@company'
            });
        }

        function eloquaEmail()
        {
           return $resource('/api/emaileditor/eloquaemail/:eloquaEmailId/', 
            {
                eloquaEmailId: '@id',
                company: '@company'
            });
        }    

        function eloquaTestEmail()
        {
           return $resource('/api/emaileditor/sendtestemail/',
            {
                company: '@company'
            });
        }      

        function eloquaCampaign()
        {
           return $resource('/api/emaileditor/scheduleemail/:eloquaCampaignId/', 
            {
                eloquaCampaignId: '@id',
                company: '@company'
            });
        }   
        function eloquaCampaignUnschedule()
        {
           return $resource('/api/emaileditor/unscheduleemail/:eloquaCampaignId/', 
            {
                eloquaCampaignId: '@id',
                company: '@company'
            });
        }

        function eloquaEmailConfig()
        {
            return $resource('/api/emaileditor/emailconfig', 
             {
                 company: '@company'
             },
             {
                 'query': 
                 {
                     method: 'GET', 
                     isArray: false 
                 }
             });
        }

        function eloquaEmailEncoding()
        {
           return $resource('/api/emaileditor/emailencoding', 
            {
                company: '@company'
            });
        }

        return {
            emailModule             : getEmailModule,
            segments                : getSegments,
            emailGroups             : getEmailGroups,
            emailHeaders            : getEmailHeaders,
            emailFooters            : getEmailFooters,
            eloquaEmail             : eloquaEmail,
            eloquaCampaign          : eloquaCampaign,
            eloquaTestEmail         : eloquaTestEmail,
            eloquaCampaignUnschedule: eloquaCampaignUnschedule,
            eloquaEmailEncoding     : eloquaEmailEncoding,
            eloquaEmailConfig       : eloquaEmailConfig
        };
    }
]);
