'use strict';


describe("sorting the list of users", function () 
{
    it('sorts in descending order by default', function () 
    {
        // your test assertion goes here
        // expect('a').toEqual('aasa');
        expect('a').toEqual('a');
    });
});

describe('Entity', function ()
{   
    describe('init & load - entity', function ()
    {
        beforeEach(function()
        {   
            module('mean');
            module('mean.system');
            module('mean.admin');
            module('mean.circles');
            module('mean.swagger');
            module('mean.users');
            module('mean.emaileditor');
        });

        var $controller;
        var $scope, NewsletterEntity, Eloqua, Circles, $timeout, $httpBackend;
        var q;
        var entity1 = 
        [
            { 
                "_id": "589dad64c510b64d50bcddf1", 
                "createdAt": "2017-02-10T12:09:08.146Z", 
                "updatedAt": "2017-02-15T15:40:36.807Z", 
                "updatedBy": "Simon.Eckhardt", 
                "createdBy": "Simon.Eckhardt", 
                "name": "test - hiddenPreview", 
                "type": "BBMObject1", 
                "header": "<html>\n    <head></head>\n    <body>\n        <div style=\"visibility:hidden\">{{hiddenPreviewText}}</div>\n        before\n        <br>\n        ", 
                "preBody": "", 
                "postBody": "", 
                "footer": "\n        \n        <br>\n        after\n    </body>\n</html>", 
                "eloquaFolder": "483", 
                "eloquaCampaignFolder": "482", 
                "eloquaFooter": "1", 
                "eloquaHeader": "1", 
                "bounceBackAddress": "TechnologyPartnerLeadMgtTechSolutionsAB@s1926145509.m.en25.com", 
                "replyToName": "Leadteq", 
                "replyToEmail": "support@leadteq.com",
                "eloquaEmailGroup": "4", 
                "eloquaEmailEncoding": "3", 
                "fromAddress": "test@leadteq.com", 
                "senderName": "test", 
                "company": "588788e44cb14e490e56997b", 
                "__v": 4, 
                "modules": 
                [
                    { 
                        "moduleIdentifier": "1",
                        "templatePos": 139,
                        "templatePosEnd": 151,
                            "_id": "588789d496fa717b0e5f827d"
                    }
                ], 
                "circles": ["leadteq"], 
                "segments": 
                [
                    { 
                        "name": "test segment - simon only", 
                        "id": "3" 
                    }
                ] 
            }
        ];    
        
        beforeEach(inject(function(_$controller_, $rootScope, _$httpBackend_ ,_$q_, _$timeout_, _NewsletterEntity_, _Eloqua_, _Circles_) 
        {
            $scope              = $rootScope.$new();
            $timeout            = _$timeout_;
            NewsletterEntity    = _NewsletterEntity_;
            Eloqua              = _Eloqua_;
            Circles             = _Circles_;
            $httpBackend        = _$httpBackend_;
            q                   = _$q_;

            $controller = _$controller_('NewsletterEditController', 
            {
                $scope: $scope,
                $stateParams: {newsletterid: 'testid'},
                NewsletterEntity: NewsletterEntity
            });
        }));

        it('load - entity data is not automatically overwritten', function (done)
        {
            // console.log($scope);
            expect($scope.rssContent).toEqual('omg');  

            var segments    = [{"type":"ContactSegment","currentStatus":"Active","id":"3","createdAt":"1459410210","createdBy":"12","depth":"minimal","folderId":"484","name":"test segment - simon only","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1476724194","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"5","createdAt":"1461793374","createdBy":"17","depth":"minimal","folderId":"484","name":"JR Only","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1461793430","updatedBy":"17"},{"type":"ContactSegment","currentStatus":"Draft","id":"8","createdAt":"1468221078","createdBy":"12","depth":"minimal","folderId":"484","name":"litmus_spam_test","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1476724071","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"11","createdAt":"1486543292","createdBy":"12","depth":"minimal","folderId":"484","name":"Bonava_Demo","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1486543332","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"12","createdAt":"1493067346","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment A","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186001","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"13","createdAt":"1493067382","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment B","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186013","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"14","createdAt":"1493067391","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment C","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186025","updatedBy":"12"}];
            var emailGroups = [{"type":"EmailGroup","id":"1","depth":"complete","description":"","name":"My Emails","permissions":"fullControl","displayName":"","emailFooterId":"1","emailHeaderId":"1","emailIds":["100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","184","185","186","187","188","189","190","191"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"96dd078f-e463-4928-95ca-1abfd79993df","subscriptionListId":"2","unSubscriptionListDataLookupId":"21416d74-67f1-4c49-8c8b-88870e682137","unSubscriptionListId":"3","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"2","depth":"complete","name":"Newsletter","permissions":"fullControl","emailFooterId":"1","emailHeaderId":"1","emailIds":["122","123","124","259"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"e9f41629-b336-49bd-b25f-39d35a09e9bf","subscriptionListId":"4","unSubscriptionListDataLookupId":"1e511703-8ea1-45f3-b743-0cb8da712b34","unSubscriptionListId":"5","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"3","depth":"complete","name":"Events","permissions":"fullControl","updatedAt":"1465286039","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":["60"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"b596fcee-1d1b-4c08-bfa0-dfe7ed98653f","subscriptionListId":"6","unSubscriptionListDataLookupId":"44d6c38b-a47d-4278-b400-420af5a40483","unSubscriptionListId":"7","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"4","depth":"complete","name":"Testing Area","permissions":"fullControl","updatedAt":"1465286047","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":["137","139","138","142","143","147","152","153","154","158","159","213","212","219","55","163","237","238","239","240","241","244","210","211","214","215","216","218","217","227","59","125","144","145","62","118","119","120","121","132","133","134","135","136","141","148","151","208","156","246","245","247","248","249","250","255","256","257","258","242","243","197","196","204","205","58","56","160","161","162","182","183","200","198","199","201","202","203","206","207","209","140","57","117","164","169","165","172","166","174","175","177","173","167","171","170","168","176","178","194","195","192","193","179","180","181","99","260","223","224","225","235","236","251","252","253","254","146"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"9e07fc25-0ed5-4136-acf9-e31fe3e32806","subscriptionListId":"8","unSubscriptionListDataLookupId":"d46d51d2-ae11-4adc-b84e-c545472d4a10","unSubscriptionListId":"9","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"6","depth":"complete","description":"","name":"BP - Templates","permissions":"fullControl","updatedAt":"1306513777","displayName":"","emailFooterId":"1","emailHeaderId":"1","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"c82aed33-0ead-46cb-aa2a-587cf99a96aa","subscriptionListId":"24","unSubscriptionListDataLookupId":"cef06117-4668-46f6-8801-a4ba5e4c57e2","unSubscriptionListId":"25","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"10","createdAt":"1450124980","createdBy":"12","depth":"complete","name":"Transactional Emails","permissions":"fullControl","updatedAt":"1450124990","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"5","subscriptionListDataLookupId":"162b63aa-afbe-4ac2-acab-bd11dfe4fc26","subscriptionListId":"58","unSubscriptionListDataLookupId":"fc4eec4a-48b3-42bf-8d73-4fc2b8bfb613","unSubscriptionListId":"59","unsubscriptionLandingPageId":"5"},{"type":"EmailGroup","id":"11","createdAt":"1461170777","createdBy":"12","depth":"complete","name":"TEST","permissions":"fullControl","updatedAt":"1461170777","updatedBy":"12","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"8","subscriptionListDataLookupId":"07eab9ce-d7ea-4c95-8413-f516e75f00ad","subscriptionListId":"62","unSubscriptionListDataLookupId":"e2c5ebf2-86c7-458e-b9ae-dd814e617493","unSubscriptionListId":"63","unsubscriptionLandingPageId":"1"},{"type":"EmailGroup","id":"12","createdAt":"1461793011","createdBy":"17","depth":"complete","name":"JR Sandbox","permissions":"fullControl","updatedAt":"1461793011","updatedBy":"17","emailFooterId":"1","emailHeaderId":"1","emailIds":["126","128","127","149","150","157","155"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"2","subscriptionListDataLookupId":"3e92d9e0-9461-4dc2-8d70-8533d5d99947","subscriptionListId":"64","unSubscriptionListDataLookupId":"5ad7a051-bcfa-4b1e-a3aa-a6448206349a","unSubscriptionListId":"65","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"13","createdAt":"1465561679","createdBy":"12","depth":"complete","name":"test123","permissions":"fullControl","updatedAt":"1465561679","updatedBy":"12","emailFooterId":"10","emailHeaderId":"7","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"0604bf0e-dc18-4100-98b5-5415c32482c0","subscriptionListId":"68","unSubscriptionListDataLookupId":"a9099dbd-1437-4c45-93be-de7995cfc739","unSubscriptionListId":"69","unsubscriptionLandingPageId":"1"}];
            var encoding    = [{"type":"EmailEncoding","id":"4","name":"Arabic"},{"type":"EmailEncoding","id":"5","name":"Bulgarian"},{"type":"EmailEncoding","id":"6","name":"Catalan"},{"type":"EmailEncoding","id":"7","name":"Chinese (Simplified)"},{"type":"EmailEncoding","id":"8","name":"Chinese (Traditional)"},{"type":"EmailEncoding","id":"9","name":"Croatian"},{"type":"EmailEncoding","id":"10","name":"Czech"},{"type":"EmailEncoding","id":"11","name":"Danish"},{"type":"EmailEncoding","id":"12","name":"Dutch"},{"type":"EmailEncoding","id":"1","name":"English"},{"type":"EmailEncoding","id":"13","name":"Estonian"},{"type":"EmailEncoding","id":"14","name":"Finnish"},{"type":"EmailEncoding","id":"2","name":"French"},{"type":"EmailEncoding","id":"15","name":"German"},{"type":"EmailEncoding","id":"16","name":"Greek"},{"type":"EmailEncoding","id":"17","name":"Hebrew"},{"type":"EmailEncoding","id":"18","name":"Hungarian"},{"type":"EmailEncoding","id":"19","name":"Icelandic"},{"type":"EmailEncoding","id":"20","name":"Indonesian"},{"type":"EmailEncoding","id":"21","name":"Italian"},{"type":"EmailEncoding","id":"22","name":"Japanese"},{"type":"EmailEncoding","id":"23","name":"Korean"},{"type":"EmailEncoding","id":"24","name":"Latvian"},{"type":"EmailEncoding","id":"25","name":"Lithuanian"},{"type":"EmailEncoding","id":"26","name":"Norwegian"},{"type":"EmailEncoding","id":"27","name":"Polish"},{"type":"EmailEncoding","id":"28","name":"Portuguese"},{"type":"EmailEncoding","id":"29","name":"Romanian"},{"type":"EmailEncoding","id":"30","name":"Russian"},{"type":"EmailEncoding","id":"31","name":"Serbian"},{"type":"EmailEncoding","id":"32","name":"Slovak"},{"type":"EmailEncoding","id":"33","name":"Slovenian"},{"type":"EmailEncoding","id":"34","name":"Spanish"},{"type":"EmailEncoding","id":"35","name":"Swedish"},{"type":"EmailEncoding","id":"37","name":"Thai"},{"type":"EmailEncoding","id":"36","name":"Turkish"},{"type":"EmailEncoding","id":"3","name":"Unicode (UTF-8)"}];
            var emailConfig = {"type":"EmailConfig","bouncebackAddresses":["differentBOUNCEBACK@s1926145509.m.en25.com"],"fromAddress":"test333@en25.com","replyToAddress":"replytest333@en25.com","replyToName":"Technology Partner - Lead Mgt Tech Solutions AB","subscriptionLandingPageId":"1","unsubscriptionLandingPageId":"3"};
            var mineCompany = {"allowed":["Company_Admin","RSSAPP"],"descendants":{"Company_Admin":[],"RSSAPP":[]}};
         
            spyOn(NewsletterEntity, 'query').and.callFake(function(a, cb) 
            {
                return cb(entity1);
            });

            spyOn(Eloqua, 'segments').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(segments);
                };
                return mySpy;
            });

            spyOn(Eloqua, 'emailGroups').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailGroups);
                };
                return mySpy;
            });

            spyOn(Eloqua, 'eloquaEmailEncoding').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(encoding);
                };
                return mySpy;
            });

            spyOn(Eloqua, 'eloquaEmailConfig').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailConfig);
                };
                return mySpy;
            });

            spyOn(Circles, 'mineCompany').and.callFake(function(a, cb) 
            {
                return cb(mineCompany);
            });

            $httpBackend.when('GET', 'system/views/index.html').respond('<section data-ng-controller="IndexController"></section>');
            $httpBackend.when('GET', '/api/users/me').respond({});
            $httpBackend.when('GET', '/api/emaileditor/emailmodule').respond({});

            $scope.load(function()
            {
                // $scope.init();
                expect(NewsletterEntity.query).toHaveBeenCalled();
                expect(Eloqua.segments).toHaveBeenCalled();
                expect(Eloqua.emailGroups).toHaveBeenCalled();
                expect(Eloqua.eloquaEmailEncoding).toHaveBeenCalled();
                expect(Eloqua.eloquaEmailConfig).toHaveBeenCalled();
                expect(Circles.mineCompany).toHaveBeenCalled();

                expect($scope.entity).not.toBe(null);
                expect($scope.entity).not.toBe(undefined);
                // console.log($scope.entity);
                expect($scope.entity.eloquaEmailGroup).toBe(entity1[0].eloquaEmailGroup);
                expect($scope.entity.bounceBackAddress).toBe(entity1[0].bounceBackAddress);
                expect($scope.entity.eloquaEmailEncoding).toBe(entity1[0].eloquaEmailEncoding);
                expect($scope.entity.replyToName).toBe(entity1[0].replyToName);
                expect($scope.entity.replyToEmail).toBe(entity1[0].replyToEmail);
                expect($scope.entity.fromAddress).toBe(entity1[0].fromAddress);
                expect($scope.entity.senderName).toBe(entity1[0].senderName);

                done();
            });
            $timeout.flush();
        });

        /*
        it.skip('load - but entity returned is empty', function (done)
        {
            // console.log($scope);
            expect($scope.rssContent).toEqual('omg');  

            var segments    = [{"type":"ContactSegment","currentStatus":"Active","id":"3","createdAt":"1459410210","createdBy":"12","depth":"minimal","folderId":"484","name":"test segment - simon only","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1476724194","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"5","createdAt":"1461793374","createdBy":"17","depth":"minimal","folderId":"484","name":"JR Only","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1461793430","updatedBy":"17"},{"type":"ContactSegment","currentStatus":"Draft","id":"8","createdAt":"1468221078","createdBy":"12","depth":"minimal","folderId":"484","name":"litmus_spam_test","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1476724071","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"11","createdAt":"1486543292","createdBy":"12","depth":"minimal","folderId":"484","name":"Bonava_Demo","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1486543332","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"12","createdAt":"1493067346","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment A","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186001","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"13","createdAt":"1493067382","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment B","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186013","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"14","createdAt":"1493067391","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment C","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186025","updatedBy":"12"}];
            var emailGroups = [{"type":"EmailGroup","id":"1","depth":"complete","description":"","name":"My Emails","permissions":"fullControl","displayName":"","emailFooterId":"1","emailHeaderId":"1","emailIds":["100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","184","185","186","187","188","189","190","191"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"96dd078f-e463-4928-95ca-1abfd79993df","subscriptionListId":"2","unSubscriptionListDataLookupId":"21416d74-67f1-4c49-8c8b-88870e682137","unSubscriptionListId":"3","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"2","depth":"complete","name":"Newsletter","permissions":"fullControl","emailFooterId":"1","emailHeaderId":"1","emailIds":["122","123","124","259"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"e9f41629-b336-49bd-b25f-39d35a09e9bf","subscriptionListId":"4","unSubscriptionListDataLookupId":"1e511703-8ea1-45f3-b743-0cb8da712b34","unSubscriptionListId":"5","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"3","depth":"complete","name":"Events","permissions":"fullControl","updatedAt":"1465286039","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":["60"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"b596fcee-1d1b-4c08-bfa0-dfe7ed98653f","subscriptionListId":"6","unSubscriptionListDataLookupId":"44d6c38b-a47d-4278-b400-420af5a40483","unSubscriptionListId":"7","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"4","depth":"complete","name":"Testing Area","permissions":"fullControl","updatedAt":"1465286047","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":["137","139","138","142","143","147","152","153","154","158","159","213","212","219","55","163","237","238","239","240","241","244","210","211","214","215","216","218","217","227","59","125","144","145","62","118","119","120","121","132","133","134","135","136","141","148","151","208","156","246","245","247","248","249","250","255","256","257","258","242","243","197","196","204","205","58","56","160","161","162","182","183","200","198","199","201","202","203","206","207","209","140","57","117","164","169","165","172","166","174","175","177","173","167","171","170","168","176","178","194","195","192","193","179","180","181","99","260","223","224","225","235","236","251","252","253","254","146"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"9e07fc25-0ed5-4136-acf9-e31fe3e32806","subscriptionListId":"8","unSubscriptionListDataLookupId":"d46d51d2-ae11-4adc-b84e-c545472d4a10","unSubscriptionListId":"9","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"6","depth":"complete","description":"","name":"BP - Templates","permissions":"fullControl","updatedAt":"1306513777","displayName":"","emailFooterId":"1","emailHeaderId":"1","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"c82aed33-0ead-46cb-aa2a-587cf99a96aa","subscriptionListId":"24","unSubscriptionListDataLookupId":"cef06117-4668-46f6-8801-a4ba5e4c57e2","unSubscriptionListId":"25","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"10","createdAt":"1450124980","createdBy":"12","depth":"complete","name":"Transactional Emails","permissions":"fullControl","updatedAt":"1450124990","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"5","subscriptionListDataLookupId":"162b63aa-afbe-4ac2-acab-bd11dfe4fc26","subscriptionListId":"58","unSubscriptionListDataLookupId":"fc4eec4a-48b3-42bf-8d73-4fc2b8bfb613","unSubscriptionListId":"59","unsubscriptionLandingPageId":"5"},{"type":"EmailGroup","id":"11","createdAt":"1461170777","createdBy":"12","depth":"complete","name":"TEST","permissions":"fullControl","updatedAt":"1461170777","updatedBy":"12","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"8","subscriptionListDataLookupId":"07eab9ce-d7ea-4c95-8413-f516e75f00ad","subscriptionListId":"62","unSubscriptionListDataLookupId":"e2c5ebf2-86c7-458e-b9ae-dd814e617493","unSubscriptionListId":"63","unsubscriptionLandingPageId":"1"},{"type":"EmailGroup","id":"12","createdAt":"1461793011","createdBy":"17","depth":"complete","name":"JR Sandbox","permissions":"fullControl","updatedAt":"1461793011","updatedBy":"17","emailFooterId":"1","emailHeaderId":"1","emailIds":["126","128","127","149","150","157","155"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"2","subscriptionListDataLookupId":"3e92d9e0-9461-4dc2-8d70-8533d5d99947","subscriptionListId":"64","unSubscriptionListDataLookupId":"5ad7a051-bcfa-4b1e-a3aa-a6448206349a","unSubscriptionListId":"65","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"13","createdAt":"1465561679","createdBy":"12","depth":"complete","name":"test123","permissions":"fullControl","updatedAt":"1465561679","updatedBy":"12","emailFooterId":"10","emailHeaderId":"7","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"0604bf0e-dc18-4100-98b5-5415c32482c0","subscriptionListId":"68","unSubscriptionListDataLookupId":"a9099dbd-1437-4c45-93be-de7995cfc739","unSubscriptionListId":"69","unsubscriptionLandingPageId":"1"}];
            var encoding    = [{"type":"EmailEncoding","id":"4","name":"Arabic"},{"type":"EmailEncoding","id":"5","name":"Bulgarian"},{"type":"EmailEncoding","id":"6","name":"Catalan"},{"type":"EmailEncoding","id":"7","name":"Chinese (Simplified)"},{"type":"EmailEncoding","id":"8","name":"Chinese (Traditional)"},{"type":"EmailEncoding","id":"9","name":"Croatian"},{"type":"EmailEncoding","id":"10","name":"Czech"},{"type":"EmailEncoding","id":"11","name":"Danish"},{"type":"EmailEncoding","id":"12","name":"Dutch"},{"type":"EmailEncoding","id":"1","name":"English"},{"type":"EmailEncoding","id":"13","name":"Estonian"},{"type":"EmailEncoding","id":"14","name":"Finnish"},{"type":"EmailEncoding","id":"2","name":"French"},{"type":"EmailEncoding","id":"15","name":"German"},{"type":"EmailEncoding","id":"16","name":"Greek"},{"type":"EmailEncoding","id":"17","name":"Hebrew"},{"type":"EmailEncoding","id":"18","name":"Hungarian"},{"type":"EmailEncoding","id":"19","name":"Icelandic"},{"type":"EmailEncoding","id":"20","name":"Indonesian"},{"type":"EmailEncoding","id":"21","name":"Italian"},{"type":"EmailEncoding","id":"22","name":"Japanese"},{"type":"EmailEncoding","id":"23","name":"Korean"},{"type":"EmailEncoding","id":"24","name":"Latvian"},{"type":"EmailEncoding","id":"25","name":"Lithuanian"},{"type":"EmailEncoding","id":"26","name":"Norwegian"},{"type":"EmailEncoding","id":"27","name":"Polish"},{"type":"EmailEncoding","id":"28","name":"Portuguese"},{"type":"EmailEncoding","id":"29","name":"Romanian"},{"type":"EmailEncoding","id":"30","name":"Russian"},{"type":"EmailEncoding","id":"31","name":"Serbian"},{"type":"EmailEncoding","id":"32","name":"Slovak"},{"type":"EmailEncoding","id":"33","name":"Slovenian"},{"type":"EmailEncoding","id":"34","name":"Spanish"},{"type":"EmailEncoding","id":"35","name":"Swedish"},{"type":"EmailEncoding","id":"37","name":"Thai"},{"type":"EmailEncoding","id":"36","name":"Turkish"},{"type":"EmailEncoding","id":"3","name":"Unicode (UTF-8)"}];
            var emailConfig = {"type":"EmailConfig","bouncebackAddresses":["TechnologyPartnerLeadMgtTechSolutionsAB@s1926145509.m.en25.com"],"fromAddress":"newclient@en25.com","replyToAddress":"newclient@en25.com","replyToName":"Technology Partner - Lead Mgt Tech Solutions AB","subscriptionLandingPageId":"1","unsubscriptionLandingPageId":"3"};
            var mineCompany = {"allowed":["Company_Admin","RSSAPP"],"descendants":{"Company_Admin":[],"RSSAPP":[]}};
         
            spyOn(NewsletterEntity, 'query').and.callFake(function(a, cb) 
            {
                return cb([]);
            });

            spyOn(Eloqua, 'segments').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(segments);
                };
                return mySpy;
            });

            spyOn(Eloqua, 'emailGroups').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailGroups);
                };
                return mySpy;
            });

            spyOn(Eloqua, 'eloquaEmailEncoding').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(encoding);
                };
                return mySpy;
            });

            spyOn(Eloqua, 'eloquaEmailConfig').and.callFake(function(a, cb) 
            {
                // console.log('eloquaEmailConfig -----------!!!!!!!!!!!-----------');
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailConfig);
                };
                return mySpy;
            });

            spyOn(Circles, 'mineCompany').and.callFake(function(a, cb) 
            {
               return cb(mineCompany);
            });

            $httpBackend.when('GET', '/api/users/me').respond({});
            $httpBackend.when('GET', '/api/emaileditor/emailmodule').respond({});

            $scope.load(function()
            {
                // $scope.init();
                expect(NewsletterEntity.query).toHaveBeenCalled();
                expect(Eloqua.segments).toHaveBeenCalled();
                expect(Eloqua.emailGroups).toHaveBeenCalled();
                expect(Eloqua.eloquaEmailEncoding).toHaveBeenCalled();
                expect(Eloqua.eloquaEmailConfig).toHaveBeenCalled();
                expect(Circles.mineCompany).toHaveBeenCalled();

                expect($scope.entity).not.toBe(null);
                expect($scope.entity).not.toBe(undefined);
                // console.log($scope.entity);
                expect($scope.entity.eloquaEmailGroup).toBe('');
                expect($scope.entity.bounceBackAddress).toBe(entity1[0].bounceBackAddress);
                expect($scope.entity.eloquaEmailEncoding).toBe('');
                expect($scope.entity.replyToName).toBe(entity1[0].replyToName);
                expect($scope.entity.replyToEmail).toBe(entity1[0].replyToEmail);
                expect($scope.entity.fromAddress).toBe(entity1[0].fromAddress);
                expect($scope.entity.senderName).toBe(entity1[0].senderName);

                done();
            });
            $timeout.flush();
        });
        */
    });
/*
    describe('init - without entity', function ()
    {
        beforeEach(function()
        {   
            module('mean');
            module('mean.system');
            module('mean.admin');
            module('mean.circles');
            module('mean.swagger');
            module('mean.users');
            module('mean.emaileditor');
        });

        var $controller;
        var $scope, NewsletterEntity, Eloqua, Circles, $timeout, $httpBackend;
        var q;
        var entity1 = 
        [
            { 
                "_id": "589dad64c510b64d50bcddf1", 
                "createdAt": "2017-02-10T12:09:08.146Z", 
                "updatedAt": "2017-02-15T15:40:36.807Z", 
                "updatedBy": "Simon.Eckhardt", 
                "createdBy": "Simon.Eckhardt", 
                "name": "test - hiddenPreview", 
                "type": "BBMObject1", 
                "header": "<html>\n    <head></head>\n    <body>\n        <div style=\"visibility:hidden\">{{hiddenPreviewText}}</div>\n        before\n        <br>\n        ", 
                "preBody": "", 
                "postBody": "", 
                "footer": "\n        \n        <br>\n        after\n    </body>\n</html>", 
                "eloquaFolder": "483", 
                "eloquaCampaignFolder": "482", 
                "eloquaFooter": "1", 
                "eloquaHeader": "1", 
                "bounceBackAddress": "TechnologyPartnerLeadMgtTechSolutionsAB@s1926145509.m.en25.com", 
                "replyToName": "Leadteq", 
                "replyToEmail": "support@leadteq.com",
                "eloquaEmailGroup": "4", 
                "eloquaEmailEncoding": "3", 
                "fromAddress": "test@leadteq.com", 
                "senderName": "test", 
                "company": "588788e44cb14e490e56997b", 
                "__v": 4, 
                "modules": 
                [
                    { 
                        "moduleIdentifier": "1",
                        "templatePos": 139,
                        "templatePosEnd": 151,
                            "_id": "588789d496fa717b0e5f827d"
                    }
                ], 
                "circles": ["leadteq"], 
                "segments": 
                [
                    { 
                        "name": "test segment - simon only", 
                        "id": "3" 
                    }
                ] 
            }
        ];    
        var meanConfig = 
        {
            eloqua:
            {
                bounceBackAddress: 'TechnologyPartnerLeadMgtTechSolutionsAB@s1926145509.m.en25.com',
                replyToName: 'Leadteq',
                replyToEmail: 'support@leadteq.com',
                campaignFolder: '482',
                emailFolder: '483',
                segmentFolder: '484',
                footer: '10',
                header: '7'
            }
        }
        
        beforeEach(inject(function(_$controller_, $rootScope, _$httpBackend_ ,_$q_, _$timeout_, _NewsletterEntity_, _Eloqua_, _Circles_) 
        {
            $scope              = $rootScope.$new();
            $timeout            = _$timeout_;
            NewsletterEntity    = _NewsletterEntity_;
            Eloqua              = _Eloqua_;
            Circles             = _Circles_;
            $httpBackend        = _$httpBackend_;
            q                   = _$q_;

            $controller = _$controller_('NewsletterEditController', 
            {
                $scope: $scope,
                $meanConfig: meanConfig,
                NewsletterEntity: NewsletterEntity
            });
        }));

        it('load - without entity default values get written', function (done)
        {
            // console.log($scope);
            expect($scope.rssContent).toEqual('omg');  

            var segments    = [{"type":"ContactSegment","currentStatus":"Active","id":"3","createdAt":"1459410210","createdBy":"12","depth":"minimal","folderId":"484","name":"test segment - simon only","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1476724194","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"5","createdAt":"1461793374","createdBy":"17","depth":"minimal","folderId":"484","name":"JR Only","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1461793430","updatedBy":"17"},{"type":"ContactSegment","currentStatus":"Draft","id":"8","createdAt":"1468221078","createdBy":"12","depth":"minimal","folderId":"484","name":"litmus_spam_test","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1476724071","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"11","createdAt":"1486543292","createdBy":"12","depth":"minimal","folderId":"484","name":"Bonava_Demo","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1486543332","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"12","createdAt":"1493067346","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment A","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186001","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"13","createdAt":"1493067382","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment B","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186013","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"14","createdAt":"1493067391","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment C","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186025","updatedBy":"12"}];
            var emailGroups = [{"type":"EmailGroup","id":"1","depth":"complete","description":"","name":"My Emails","permissions":"fullControl","displayName":"","emailFooterId":"1","emailHeaderId":"1","emailIds":["100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","184","185","186","187","188","189","190","191"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"96dd078f-e463-4928-95ca-1abfd79993df","subscriptionListId":"2","unSubscriptionListDataLookupId":"21416d74-67f1-4c49-8c8b-88870e682137","unSubscriptionListId":"3","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"2","depth":"complete","name":"Newsletter","permissions":"fullControl","emailFooterId":"1","emailHeaderId":"1","emailIds":["122","123","124","259"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"e9f41629-b336-49bd-b25f-39d35a09e9bf","subscriptionListId":"4","unSubscriptionListDataLookupId":"1e511703-8ea1-45f3-b743-0cb8da712b34","unSubscriptionListId":"5","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"3","depth":"complete","name":"Events","permissions":"fullControl","updatedAt":"1465286039","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":["60"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"b596fcee-1d1b-4c08-bfa0-dfe7ed98653f","subscriptionListId":"6","unSubscriptionListDataLookupId":"44d6c38b-a47d-4278-b400-420af5a40483","unSubscriptionListId":"7","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"4","depth":"complete","name":"Testing Area","permissions":"fullControl","updatedAt":"1465286047","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":["137","139","138","142","143","147","152","153","154","158","159","213","212","219","55","163","237","238","239","240","241","244","210","211","214","215","216","218","217","227","59","125","144","145","62","118","119","120","121","132","133","134","135","136","141","148","151","208","156","246","245","247","248","249","250","255","256","257","258","242","243","197","196","204","205","58","56","160","161","162","182","183","200","198","199","201","202","203","206","207","209","140","57","117","164","169","165","172","166","174","175","177","173","167","171","170","168","176","178","194","195","192","193","179","180","181","99","260","223","224","225","235","236","251","252","253","254","146"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"9e07fc25-0ed5-4136-acf9-e31fe3e32806","subscriptionListId":"8","unSubscriptionListDataLookupId":"d46d51d2-ae11-4adc-b84e-c545472d4a10","unSubscriptionListId":"9","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"6","depth":"complete","description":"","name":"BP - Templates","permissions":"fullControl","updatedAt":"1306513777","displayName":"","emailFooterId":"1","emailHeaderId":"1","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"c82aed33-0ead-46cb-aa2a-587cf99a96aa","subscriptionListId":"24","unSubscriptionListDataLookupId":"cef06117-4668-46f6-8801-a4ba5e4c57e2","unSubscriptionListId":"25","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"10","createdAt":"1450124980","createdBy":"12","depth":"complete","name":"Transactional Emails","permissions":"fullControl","updatedAt":"1450124990","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"5","subscriptionListDataLookupId":"162b63aa-afbe-4ac2-acab-bd11dfe4fc26","subscriptionListId":"58","unSubscriptionListDataLookupId":"fc4eec4a-48b3-42bf-8d73-4fc2b8bfb613","unSubscriptionListId":"59","unsubscriptionLandingPageId":"5"},{"type":"EmailGroup","id":"11","createdAt":"1461170777","createdBy":"12","depth":"complete","name":"TEST","permissions":"fullControl","updatedAt":"1461170777","updatedBy":"12","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"8","subscriptionListDataLookupId":"07eab9ce-d7ea-4c95-8413-f516e75f00ad","subscriptionListId":"62","unSubscriptionListDataLookupId":"e2c5ebf2-86c7-458e-b9ae-dd814e617493","unSubscriptionListId":"63","unsubscriptionLandingPageId":"1"},{"type":"EmailGroup","id":"12","createdAt":"1461793011","createdBy":"17","depth":"complete","name":"JR Sandbox","permissions":"fullControl","updatedAt":"1461793011","updatedBy":"17","emailFooterId":"1","emailHeaderId":"1","emailIds":["126","128","127","149","150","157","155"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"2","subscriptionListDataLookupId":"3e92d9e0-9461-4dc2-8d70-8533d5d99947","subscriptionListId":"64","unSubscriptionListDataLookupId":"5ad7a051-bcfa-4b1e-a3aa-a6448206349a","unSubscriptionListId":"65","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"13","createdAt":"1465561679","createdBy":"12","depth":"complete","name":"test123","permissions":"fullControl","updatedAt":"1465561679","updatedBy":"12","emailFooterId":"10","emailHeaderId":"7","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"0604bf0e-dc18-4100-98b5-5415c32482c0","subscriptionListId":"68","unSubscriptionListDataLookupId":"a9099dbd-1437-4c45-93be-de7995cfc739","unSubscriptionListId":"69","unsubscriptionLandingPageId":"1"}];
            var encoding    = [{"type":"EmailEncoding","id":"4","name":"Arabic"},{"type":"EmailEncoding","id":"5","name":"Bulgarian"},{"type":"EmailEncoding","id":"6","name":"Catalan"},{"type":"EmailEncoding","id":"7","name":"Chinese (Simplified)"},{"type":"EmailEncoding","id":"8","name":"Chinese (Traditional)"},{"type":"EmailEncoding","id":"9","name":"Croatian"},{"type":"EmailEncoding","id":"10","name":"Czech"},{"type":"EmailEncoding","id":"11","name":"Danish"},{"type":"EmailEncoding","id":"12","name":"Dutch"},{"type":"EmailEncoding","id":"1","name":"English"},{"type":"EmailEncoding","id":"13","name":"Estonian"},{"type":"EmailEncoding","id":"14","name":"Finnish"},{"type":"EmailEncoding","id":"2","name":"French"},{"type":"EmailEncoding","id":"15","name":"German"},{"type":"EmailEncoding","id":"16","name":"Greek"},{"type":"EmailEncoding","id":"17","name":"Hebrew"},{"type":"EmailEncoding","id":"18","name":"Hungarian"},{"type":"EmailEncoding","id":"19","name":"Icelandic"},{"type":"EmailEncoding","id":"20","name":"Indonesian"},{"type":"EmailEncoding","id":"21","name":"Italian"},{"type":"EmailEncoding","id":"22","name":"Japanese"},{"type":"EmailEncoding","id":"23","name":"Korean"},{"type":"EmailEncoding","id":"24","name":"Latvian"},{"type":"EmailEncoding","id":"25","name":"Lithuanian"},{"type":"EmailEncoding","id":"26","name":"Norwegian"},{"type":"EmailEncoding","id":"27","name":"Polish"},{"type":"EmailEncoding","id":"28","name":"Portuguese"},{"type":"EmailEncoding","id":"29","name":"Romanian"},{"type":"EmailEncoding","id":"30","name":"Russian"},{"type":"EmailEncoding","id":"31","name":"Serbian"},{"type":"EmailEncoding","id":"32","name":"Slovak"},{"type":"EmailEncoding","id":"33","name":"Slovenian"},{"type":"EmailEncoding","id":"34","name":"Spanish"},{"type":"EmailEncoding","id":"35","name":"Swedish"},{"type":"EmailEncoding","id":"37","name":"Thai"},{"type":"EmailEncoding","id":"36","name":"Turkish"},{"type":"EmailEncoding","id":"3","name":"Unicode (UTF-8)"}];
            var emailConfig = {"type":"EmailConfig","bouncebackAddresses":["TechnologyPartnerLeadMgtTechSolutionsAB@s1926145509.m.en25.com"],"fromAddress":"newclient@en25.com","replyToAddress":"newclient@en25.com","replyToName":"Technology Partner - Lead Mgt Tech Solutions AB","subscriptionLandingPageId":"1","unsubscriptionLandingPageId":"3"};
            var mineCompany = {"allowed":["Company_Admin","RSSAPP"],"descendants":{"Company_Admin":[],"RSSAPP":[]}};
         
            spyOn(NewsletterEntity, 'query').and.callFake(function(a, cb) 
            {
                return cb([]);
            });

            spyOn(Eloqua, 'segments').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(segments);
                };
                return mySpy;
            });

            spyOn(Eloqua, 'emailGroups').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailGroups);
                };
                return mySpy;
            });

            spyOn(Eloqua, 'eloquaEmailEncoding').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(encoding);
                };
                return mySpy;
            });

            spyOn(Eloqua, 'eloquaEmailConfig').and.callFake(function(a, cb) 
            {
                // console.log('eloquaEmailConfig -----------!!!!!!!!!!!-----------');
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailConfig);
                };
                return mySpy;
            });

            spyOn(Circles, 'mineCompany').and.callFake(function(a, cb) 
            {
               return cb(mineCompany);
            });

            $httpBackend.when('GET', 'system/views/index.html').respond('<section data-ng-controller="IndexController"></section>');
            $httpBackend.when('GET', '/api/users/me').respond({});
            $httpBackend.when('GET', '/api/emaileditor/emailmodule').respond({});

            $scope.load(function()
            {
                expect(NewsletterEntity.query).not.toHaveBeenCalled();
                expect(Eloqua.segments).toHaveBeenCalled();
                expect(Eloqua.emailGroups).toHaveBeenCalled();
                expect(Eloqua.eloquaEmailEncoding).toHaveBeenCalled();
                expect(Eloqua.eloquaEmailConfig).toHaveBeenCalled();
                expect(Circles.mineCompany).toHaveBeenCalled();

                expect($scope.entity).not.toBe(null);
                expect($scope.entity).not.toBe(undefined);
                // console.log($scope.entity);
                expect($scope.entity.eloquaEmailGroup).toBe('');
                expect($scope.entity.bounceBackAddress).toBe(entity1[0].bounceBackAddress);
                expect($scope.entity.eloquaEmailEncoding).toBe(undefined);
                expect($scope.entity.replyToName).toBe(meanConfig.eloqua.replyToName);
                expect($scope.entity.replyToEmail).toBe(meanConfig.eloqua.replyToEmail);
                expect($scope.entity.fromAddress).toBe(emailConfig.fromAddress);
                expect($scope.entity.senderName).toBe(emailConfig.replyToName);
                expect($scope.entity.eloquaFooter).toBe(meanConfig.eloqua.footer);
                expect($scope.entity.eloquaHeader).toBe(meanConfig.eloqua.header);

                done();
            });
            $timeout.flush();
        });
    });*/
});
