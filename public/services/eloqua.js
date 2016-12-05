'use strict';

angular.module('mean.emaileditor').factory("Eloqua", ['$resource',
    function($resource) 
    {   
        function getEmailModule()
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

        function getSegments()
        {
           return $resource('/api/emaileditor/segments/:id',
            {
                id: '@_id'
            });
        }   

        function getEmailGroups()
        {
           return $resource('/api/emaileditor/emailgroups/');
        }

        function eloquaEmail()
        {
           return $resource('/api/emaileditor/eloquaemail/:eloquaEmailId/', 
            {
                eloquaEmailId: '@id'
            });
        }    

        function eloquaTestEmail()
        {
           return $resource('/api/emaileditor/sendtestemail/');
        }      

        function eloquaCampaign()
        {
           return $resource('/api/emaileditor/scheduleemail/:eloquaCampaignId/', 
            {
                eloquaCampaignId: '@id'
            });
        }   
        function eloquaCampaignUnschedule()
        {
           return $resource('/api/emaileditor/unscheduleemail/:eloquaCampaignId/', 
            {
                eloquaCampaignId: '@id'
            });
        }

        return {
            emailModule: getEmailModule,
            segments: getSegments,
            emailGroups: getEmailGroups,
            eloquaEmail: eloquaEmail,
            eloquaCampaign: eloquaCampaign,
            eloquaTestEmail: eloquaTestEmail,
            eloquaCampaignUnschedule: eloquaCampaignUnschedule
        };
    }
]);
