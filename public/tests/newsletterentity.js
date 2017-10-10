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
            // module('mean.swagger');
            module('mean.users');
            module('mean.meanStarter');
            module('mean.companies');
            module('mean.emaileditor');
        });

        var $controller;
        var $scope, NewsletterEntity, EloquaService, ProductSettings,Eloqua, Circles, $timeout, $httpBackend;
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
        
        beforeEach(inject(function(_$controller_, $rootScope, _$httpBackend_ ,_$q_, _$timeout_, _NewsletterEntity_, _EloquaService_, _ProductSettings_, _Circles_) 
        {
            $scope              = $rootScope.$new();
            $timeout            = _$timeout_;
            NewsletterEntity    = _NewsletterEntity_;
            EloquaService       = _EloquaService_;
            ProductSettings     = _ProductSettings_;
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
            var emailHeader = [{"type":"EmailHeader","id":"1","depth":"complete","folderId":"315","name":"Default - Show Email Link","permissions":"fullControl","updatedAt":"1243267870","body":"<TABLE width=550 class=\"emailheader\" align=center>  <TBODY>  <TR>  <TD align=middle><FONT face=Arial size=1>If you are having trouble reading this email, <A href=\"http://now.eloqua.com/es.asp?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqEmailSaveGUID</span>&elq=<span class=eloquaemail>recipientid</span>\">read the online version</A>. </FONT></TD></TR></TBODY></TABLE><BR>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"read the online version","href":"http://now.eloqua.com/es.asp?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqEmailSaveGUID..innerText--elqEmailSaveGUID..encodeFor--url~~&elqTrackId=5b0c65074e3145ce8f404f8cc0a7558e"}],"text":"If you have trouble viewing this email, read the online version.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]     "},{"type":"EmailHeader","id":"3","depth":"complete","folderId":"315","name":"BP - Show Email Link II","permissions":"fullControl","updatedAt":"1243267766","body":"<TABLE width=650 align=center>\r\n<TBODY>\r\n<TR>\r\n<TD align=middle><FONT face=Arial size=1><A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\">If you have trouble displaying this email, view it as a web page.</A></FONT> </TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"If you have trouble displaying this email, view it as a web page.","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=705b39fa4ad94ab393cdbc2ed47d3b8a"}],"text":"If you have trouble displaying this email, view it as a web page.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]"},{"type":"EmailHeader","id":"4","createdAt":"1210815116","depth":"complete","folderId":"315","name":"BP - Show Email Link w/ Safe Senders Message","permissions":"fullControl","updatedAt":"1243267810","body":"<TABLE width=650 align=center>\r\n<TBODY>\r\n<TR>\r\n<TD align=middle><FONT face=Arial size=1>To ensure you continue to receive&nbsp;COMPANYNAME's communications in a timely manner and also directly into your inbox, <BR>please add&nbsp;EMAILADDRESS to your safe senders list or address book within your email client.</FONT><BR><FONT face=Arial size=1>If you&nbsp;have trouble reading this email, </FONT><A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\"><FONT face=Arial size=1>read the online version</FONT></A><FONT face=Arial size=1>.</FONT> </TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"read the online version","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=372ec109e946425db18c4d2445772956"}],"text":"To ensure you continue to receive COMPANYNAME's communications in a timely manner and also directly into your inbox, \r\nplease add EMAILADDRESS to your safe senders list or address book within your email client.\r\n\r\nIf you have trouble reading this email, read the online version.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]"},{"type":"EmailHeader","id":"5","createdAt":"1243263534","depth":"complete","folderId":"315","name":"BP - View on Mobile","permissions":"fullControl","updatedAt":"1243267815","body":"<TABLE width=650 align=center>\r\n<TBODY>\r\n<TR>\r\n<TD align=middle><FONT face=Arial size=1><A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\">View on Mobile Phone</A> | <A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\">View as Web page</A> </FONT></TD></TR></TBODY></TABLE><BR>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"View on Mobile Phone","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=d2808d4ab6014c8098d1d495907b82a9"},{"type":"Hyperlink","id":"-2","name":"View as Web page","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=24e165a4973c404fbe5801c0ac44a0ad"}],"text":"To view on a mobile phone or to view as a web page, please cut and paste the following link into a browser.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]"},{"type":"EmailHeader","id":"7","createdAt":"1459409934","createdBy":"12","depth":"complete","folderId":"315","name":"RSS_APP_HEADER","permissions":"fullControl","updatedAt":"1493067847","updatedBy":"12","body":"","fieldMerges":[],"hyperlinks":[],"text":""}];
            var emailFooter = [{"type":"EmailFooter","id":"1","depth":"complete","description":"","folderId":"317","name":"Default - Global unsubscribe","permissions":"fullControl","updatedAt":"1266873936","body":"<TABLE style=\"WIDTH: 650px\" align=center>\r\n<TBODY>\r\n<TR>\r\n<TD>\r\n<CENTER><BR>To unsubscribe from future emails or to update your email preferences <A href=\"http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR><BR>Your Company Name<BR>Your Company Address<BR>Your Company City and State</CENTER>\r\n<CENTER>Your Company Postal Code/Zip Code<BR>Your Business Phone<BR><A href=\"LINK TO CLIENT PRIVACY POLICY GOES HERE\">Privacy Policy</A></FONT> </CENTER></TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"click here","href":"http://<elqdomain type=1/>/e/u.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~"},{"type":"Hyperlink","id":"-2","name":"Privacy Policy","href":"LINK TO CLIENT PRIVACY POLICY GOES HERE"}],"text":"To unsubscribe from future emails or to update your email preferences, please cut and paste this link into the browser. \r\n[http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\nYour Company Name\r\nYour Company Address\r\nYour Company City and State\r\nYour Company Postal Code/Zip Code\r\nYour Company Phone\r\n\r\nPrivacy Policy\r\n[LINK TO CLIENT PRIVACY POLICY GOES HERE]"},{"type":"EmailFooter","id":"5","depth":"complete","description":"","folderId":"317","name":"BP - Manage your subscriptions","permissions":"fullControl","updatedAt":"1266872997","body":"<TABLE style=\"WIDTH: 650px\" align=center>\r\n<TBODY>\r\n<TR>\r\n<TD>\r\n<CENTER><BR>To unsubscribe from future emails or to update your e-mail preferences <A href=\"http://s1926145509.t.en25.com/e/sl.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR><BR>Your Company Name Here<BR>Your Company Address<BR>Your City and State<BR>Your Postal Code/Zip Code<BR>Your Business Phone<BR><A href=\"LINK TO CLIENT PRIVACY POLICY GOES HERE\">Privacy Policy</A></FONT> </CENTER></TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"click here","href":"http://<elqdomain type=1/>/e/sl.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~"},{"type":"Hyperlink","id":"-2","name":"Privacy Policy","href":"LINK TO CLIENT PRIVACY POLICY GOES HERE"}],"text":"To unsubscribe from future emails or to update your email preferences, please cut and paste the link into your browser. \r\n[http://s1926145509.t.en25.com/e/sl.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\nYour Company Name\r\nYour Company Address\r\nYour Company City and State\r\nYour Company Postal Code/Zip Code\r\nYour Company Business Phone Number\r\n\r\nPrivacy Policy\r\n[LINK TO CLIENT PRIVACY POLICY GOES HERE]"},{"type":"EmailFooter","id":"8","createdAt":"1184865128","depth":"complete","description":"","folderId":"317","name":"BP - Unsubscribe from similar communications","permissions":"fullControl","updatedAt":"1266873812","body":"<TABLE style=\"WIDTH: 650px\" align=center>\r\n<TBODY>\r\n<TR>\r\n<TD><BR>\r\n<CENTER>If you wish to unsubscribe from similar <SPAN class=eloquaemail>Company</SPAN> email communications, <A href=\"http://s1926145509.t.en25.com/e/cu.aspx?s=<span class=eloquaemail>siteid</span>&elqc=<span class=eloquaemail>campaignid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR>If you wish to unsubscribe from all <SPAN class=eloquaemail>Company</SPAN> email, <A href=\"http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR><BR>Your Company Name<BR>Your Company Address<BR>Your Company City and State<BR>Your Postal Code/Zip Code<BR><BR><A href=\"LINK TO CLIENT PRIVACY POLICY GOES HERE\">Privacy Policy</A></FONT> </CENTER></TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"click here","href":"http://<elqdomain type=1/>/e/cu.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&elqc=~~eloqua..type--emailfield..syntax--campaignid..innerText--campaignid..encodeFor--url~~"},{"type":"Hyperlink","id":"-2","name":"click here","href":"http://<elqdomain type=1/>/e/u.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~"},{"type":"Hyperlink","id":"-3","name":"Privacy Policy","href":"LINK TO CLIENT PRIVACY POLICY GOES HERE"}],"text":"\r\nIf you wish to unsubscribe from similar <span class=\"eloquaemail\">Company</span>\r\nemail communications, click here.\r\n[http://s1926145509.t.en25.com/e/cu.aspx?s=<span class=eloquaemail>siteid</span>&elqc=<span class=eloquaemail>campaignid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\n\r\nIf you wish to unsubscribe from all <span class=\"eloquaemail\">Company</span> email, click here.\r\n[http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\nYour Company Name\r\nYour Company Address\r\nYour Company City and State\r\nYour Company Postal Code/Zip Code\r\nYour Company Phone Number\r\n\r\nPrivacy Policy\r\n[LINK TO CLIENT PRIVACY POLICY GOES HERE]"},{"type":"EmailFooter","id":"10","createdAt":"1459409969","createdBy":"12","depth":"complete","folderId":"316","name":"RSS_APP_FOOTER","permissions":"fullControl","updatedAt":"1459409969","updatedBy":"12","body":"","fieldMerges":[],"hyperlinks":[],"text":""},{"type":"EmailFooter","id":"11","createdAt":"1465285757","createdBy":"12","depth":"complete","folderId":"316","name":"subscription_managment","permissions":"fullControl","updatedAt":"1465286140","updatedBy":"12","body":"<div style=\"text-align: center;\"><a data-targettype=\"sysaction\" href=\"http://s1926145509.t.en25.com/e/sl?s=~~eloqua..type--emailfield..syntax--siteid..encodeFor--url~~&elq=~~eloqua..type--emailfield..syntax--recipientid..encodeFor--url~~\">subscriptions</a></div>\r\n","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"subscriptions","href":"http://<elqdomain type=1/>/e/sl?s=~~eloqua..type--emailfield..syntax--siteid..encodeFor--url~~"}],"text":"\r\nsubscriptions <http://s1926145509.t.en25.com/e/sl?s=~~eloqua..type--emailfield..syntax--siteid..encodeFor--url~~&elq=~~eloqua..type--emailfield..syntax--recipientid..encodeFor--url~~>\r\n\r\n"}];
         
            spyOn(NewsletterEntity, 'query').and.callFake(function(a, cb) 
            {
                return cb(entity1);
            });

            spyOn(EloquaService, 'segments').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb, errorCb) 
                {
                    return cb(segments);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'emailGroups').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailGroups);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'emailHeaders').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailHeader);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'emailFooters').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailFooter);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'eloquaEmailEncoding').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(encoding);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'eloquaEmailConfig').and.callFake(function(a, cb) 
            {
                // console.log('eloquaEmailConfig -----------!!!!!!!!!!!-----------');
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailConfig);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'refreshToken').and.callFake(function(a, cb) 
            {
                console.log('refreshToken -----------!!!!!!!!!!!-----------');
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb();
                };
                return mySpy;
            });

            spyOn(ProductSettings.byProductName, 'get').and.callFake(function(a, cb) 
            {
                console.log('byProductName  get-----------!!!!!!!!!!!-----------');
                // var  mySpy = {};
                // mySpy.get = function(a,cb) 
                // {
                //     return cb();
                // };
                var pSettings = {
                    defaults:
                    {
                        campaignFolder: '1',
                        emailFolder: '1',
                        replyToName: '1',
                        replyToEmail: '1',
                        segmentFolder: '1',
                    }
                };
                return cb(pSettings);
            });

            // spyOn(Circles, 'mineCompany').and.callFake(function(a, cb) 
            // {
            //     return cb(mineCompany);
            // });

            $httpBackend.when('GET', 'system/views/index.html').respond('<section data-ng-controller="IndexController"></section>');
            $httpBackend.when('GET', '/api/users/me').respond({});
            $httpBackend.when('GET', '/api/emaileditor/emailmodule').respond({});
            $httpBackend.when('GET', '/api/companies/settings/product/EMAILEDITOR').respond({});
            $httpBackend.when('GET', 'meanStarter/views/system/index.html').respond({});

            $scope.load(function()
            {
                // $scope.init();
                expect(NewsletterEntity.query).toHaveBeenCalled();
                expect(EloquaService.segments).toHaveBeenCalled();
                expect(EloquaService.emailGroups).toHaveBeenCalled();
                expect(EloquaService.eloquaEmailEncoding).toHaveBeenCalled();
                expect(EloquaService.eloquaEmailConfig).toHaveBeenCalled();
                expect(ProductSettings.byProductName.get).toHaveBeenCalled();
                // expect(Circles.mineCompany).toHaveBeenCalled();

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

        it('load - but entity returned is empty', function (done)
        {
            // console.log($scope);
            expect($scope.rssContent).toEqual('omg');  

            var segments    = [{"type":"ContactSegment","currentStatus":"Active","id":"3","createdAt":"1459410210","createdBy":"12","depth":"minimal","folderId":"484","name":"test segment - simon only","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1476724194","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"5","createdAt":"1461793374","createdBy":"17","depth":"minimal","folderId":"484","name":"JR Only","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1461793430","updatedBy":"17"},{"type":"ContactSegment","currentStatus":"Draft","id":"8","createdAt":"1468221078","createdBy":"12","depth":"minimal","folderId":"484","name":"litmus_spam_test","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1476724071","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"11","createdAt":"1486543292","createdBy":"12","depth":"minimal","folderId":"484","name":"Bonava_Demo","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1486543332","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"12","createdAt":"1493067346","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment A","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186001","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"13","createdAt":"1493067382","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment B","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186013","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"14","createdAt":"1493067391","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment C","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186025","updatedBy":"12"}];
            var emailGroups = [{"type":"EmailGroup","id":"1","depth":"complete","description":"","name":"My Emails","permissions":"fullControl","displayName":"","emailFooterId":"1","emailHeaderId":"1","emailIds":["100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","184","185","186","187","188","189","190","191"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"96dd078f-e463-4928-95ca-1abfd79993df","subscriptionListId":"2","unSubscriptionListDataLookupId":"21416d74-67f1-4c49-8c8b-88870e682137","unSubscriptionListId":"3","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"2","depth":"complete","name":"Newsletter","permissions":"fullControl","emailFooterId":"1","emailHeaderId":"1","emailIds":["122","123","124","259"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"e9f41629-b336-49bd-b25f-39d35a09e9bf","subscriptionListId":"4","unSubscriptionListDataLookupId":"1e511703-8ea1-45f3-b743-0cb8da712b34","unSubscriptionListId":"5","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"3","depth":"complete","name":"Events","permissions":"fullControl","updatedAt":"1465286039","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":["60"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"b596fcee-1d1b-4c08-bfa0-dfe7ed98653f","subscriptionListId":"6","unSubscriptionListDataLookupId":"44d6c38b-a47d-4278-b400-420af5a40483","unSubscriptionListId":"7","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"4","depth":"complete","name":"Testing Area","permissions":"fullControl","updatedAt":"1465286047","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":["137","139","138","142","143","147","152","153","154","158","159","213","212","219","55","163","237","238","239","240","241","244","210","211","214","215","216","218","217","227","59","125","144","145","62","118","119","120","121","132","133","134","135","136","141","148","151","208","156","246","245","247","248","249","250","255","256","257","258","242","243","197","196","204","205","58","56","160","161","162","182","183","200","198","199","201","202","203","206","207","209","140","57","117","164","169","165","172","166","174","175","177","173","167","171","170","168","176","178","194","195","192","193","179","180","181","99","260","223","224","225","235","236","251","252","253","254","146"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"9e07fc25-0ed5-4136-acf9-e31fe3e32806","subscriptionListId":"8","unSubscriptionListDataLookupId":"d46d51d2-ae11-4adc-b84e-c545472d4a10","unSubscriptionListId":"9","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"6","depth":"complete","description":"","name":"BP - Templates","permissions":"fullControl","updatedAt":"1306513777","displayName":"","emailFooterId":"1","emailHeaderId":"1","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"c82aed33-0ead-46cb-aa2a-587cf99a96aa","subscriptionListId":"24","unSubscriptionListDataLookupId":"cef06117-4668-46f6-8801-a4ba5e4c57e2","unSubscriptionListId":"25","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"10","createdAt":"1450124980","createdBy":"12","depth":"complete","name":"Transactional Emails","permissions":"fullControl","updatedAt":"1450124990","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"5","subscriptionListDataLookupId":"162b63aa-afbe-4ac2-acab-bd11dfe4fc26","subscriptionListId":"58","unSubscriptionListDataLookupId":"fc4eec4a-48b3-42bf-8d73-4fc2b8bfb613","unSubscriptionListId":"59","unsubscriptionLandingPageId":"5"},{"type":"EmailGroup","id":"11","createdAt":"1461170777","createdBy":"12","depth":"complete","name":"TEST","permissions":"fullControl","updatedAt":"1461170777","updatedBy":"12","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"8","subscriptionListDataLookupId":"07eab9ce-d7ea-4c95-8413-f516e75f00ad","subscriptionListId":"62","unSubscriptionListDataLookupId":"e2c5ebf2-86c7-458e-b9ae-dd814e617493","unSubscriptionListId":"63","unsubscriptionLandingPageId":"1"},{"type":"EmailGroup","id":"12","createdAt":"1461793011","createdBy":"17","depth":"complete","name":"JR Sandbox","permissions":"fullControl","updatedAt":"1461793011","updatedBy":"17","emailFooterId":"1","emailHeaderId":"1","emailIds":["126","128","127","149","150","157","155"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"2","subscriptionListDataLookupId":"3e92d9e0-9461-4dc2-8d70-8533d5d99947","subscriptionListId":"64","unSubscriptionListDataLookupId":"5ad7a051-bcfa-4b1e-a3aa-a6448206349a","unSubscriptionListId":"65","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"13","createdAt":"1465561679","createdBy":"12","depth":"complete","name":"test123","permissions":"fullControl","updatedAt":"1465561679","updatedBy":"12","emailFooterId":"10","emailHeaderId":"7","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"0604bf0e-dc18-4100-98b5-5415c32482c0","subscriptionListId":"68","unSubscriptionListDataLookupId":"a9099dbd-1437-4c45-93be-de7995cfc739","unSubscriptionListId":"69","unsubscriptionLandingPageId":"1"}];
            var encoding    = [{"type":"EmailEncoding","id":"4","name":"Arabic"},{"type":"EmailEncoding","id":"5","name":"Bulgarian"},{"type":"EmailEncoding","id":"6","name":"Catalan"},{"type":"EmailEncoding","id":"7","name":"Chinese (Simplified)"},{"type":"EmailEncoding","id":"8","name":"Chinese (Traditional)"},{"type":"EmailEncoding","id":"9","name":"Croatian"},{"type":"EmailEncoding","id":"10","name":"Czech"},{"type":"EmailEncoding","id":"11","name":"Danish"},{"type":"EmailEncoding","id":"12","name":"Dutch"},{"type":"EmailEncoding","id":"1","name":"English"},{"type":"EmailEncoding","id":"13","name":"Estonian"},{"type":"EmailEncoding","id":"14","name":"Finnish"},{"type":"EmailEncoding","id":"2","name":"French"},{"type":"EmailEncoding","id":"15","name":"German"},{"type":"EmailEncoding","id":"16","name":"Greek"},{"type":"EmailEncoding","id":"17","name":"Hebrew"},{"type":"EmailEncoding","id":"18","name":"Hungarian"},{"type":"EmailEncoding","id":"19","name":"Icelandic"},{"type":"EmailEncoding","id":"20","name":"Indonesian"},{"type":"EmailEncoding","id":"21","name":"Italian"},{"type":"EmailEncoding","id":"22","name":"Japanese"},{"type":"EmailEncoding","id":"23","name":"Korean"},{"type":"EmailEncoding","id":"24","name":"Latvian"},{"type":"EmailEncoding","id":"25","name":"Lithuanian"},{"type":"EmailEncoding","id":"26","name":"Norwegian"},{"type":"EmailEncoding","id":"27","name":"Polish"},{"type":"EmailEncoding","id":"28","name":"Portuguese"},{"type":"EmailEncoding","id":"29","name":"Romanian"},{"type":"EmailEncoding","id":"30","name":"Russian"},{"type":"EmailEncoding","id":"31","name":"Serbian"},{"type":"EmailEncoding","id":"32","name":"Slovak"},{"type":"EmailEncoding","id":"33","name":"Slovenian"},{"type":"EmailEncoding","id":"34","name":"Spanish"},{"type":"EmailEncoding","id":"35","name":"Swedish"},{"type":"EmailEncoding","id":"37","name":"Thai"},{"type":"EmailEncoding","id":"36","name":"Turkish"},{"type":"EmailEncoding","id":"3","name":"Unicode (UTF-8)"}];
            var emailConfig = {"type":"EmailConfig","bouncebackAddresses":["TechnologyPartnerLeadMgtTechSolutionsAB@s1926145509.m.en25.com"],"fromAddress":"newclient@en25.com","replyToAddress":"newclient@en25.com","replyToName":"Technology Partner - Lead Mgt Tech Solutions AB","subscriptionLandingPageId":"1","unsubscriptionLandingPageId":"3"};
            var mineCompany = {"allowed":["Company_Admin","RSSAPP"],"descendants":{"Company_Admin":[],"RSSAPP":[]}};
            var emailHeader = [{"type":"EmailHeader","id":"1","depth":"complete","folderId":"315","name":"Default - Show Email Link","permissions":"fullControl","updatedAt":"1243267870","body":"<TABLE width=550 class=\"emailheader\" align=center>  <TBODY>  <TR>  <TD align=middle><FONT face=Arial size=1>If you are having trouble reading this email, <A href=\"http://now.eloqua.com/es.asp?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqEmailSaveGUID</span>&elq=<span class=eloquaemail>recipientid</span>\">read the online version</A>. </FONT></TD></TR></TBODY></TABLE><BR>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"read the online version","href":"http://now.eloqua.com/es.asp?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqEmailSaveGUID..innerText--elqEmailSaveGUID..encodeFor--url~~&elqTrackId=5b0c65074e3145ce8f404f8cc0a7558e"}],"text":"If you have trouble viewing this email, read the online version.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]     "},{"type":"EmailHeader","id":"3","depth":"complete","folderId":"315","name":"BP - Show Email Link II","permissions":"fullControl","updatedAt":"1243267766","body":"<TABLE width=650 align=center>\r\n<TBODY>\r\n<TR>\r\n<TD align=middle><FONT face=Arial size=1><A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\">If you have trouble displaying this email, view it as a web page.</A></FONT> </TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"If you have trouble displaying this email, view it as a web page.","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=705b39fa4ad94ab393cdbc2ed47d3b8a"}],"text":"If you have trouble displaying this email, view it as a web page.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]"},{"type":"EmailHeader","id":"4","createdAt":"1210815116","depth":"complete","folderId":"315","name":"BP - Show Email Link w/ Safe Senders Message","permissions":"fullControl","updatedAt":"1243267810","body":"<TABLE width=650 align=center>\r\n<TBODY>\r\n<TR>\r\n<TD align=middle><FONT face=Arial size=1>To ensure you continue to receive&nbsp;COMPANYNAME's communications in a timely manner and also directly into your inbox, <BR>please add&nbsp;EMAILADDRESS to your safe senders list or address book within your email client.</FONT><BR><FONT face=Arial size=1>If you&nbsp;have trouble reading this email, </FONT><A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\"><FONT face=Arial size=1>read the online version</FONT></A><FONT face=Arial size=1>.</FONT> </TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"read the online version","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=372ec109e946425db18c4d2445772956"}],"text":"To ensure you continue to receive COMPANYNAME's communications in a timely manner and also directly into your inbox, \r\nplease add EMAILADDRESS to your safe senders list or address book within your email client.\r\n\r\nIf you have trouble reading this email, read the online version.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]"},{"type":"EmailHeader","id":"5","createdAt":"1243263534","depth":"complete","folderId":"315","name":"BP - View on Mobile","permissions":"fullControl","updatedAt":"1243267815","body":"<TABLE width=650 align=center>\r\n<TBODY>\r\n<TR>\r\n<TD align=middle><FONT face=Arial size=1><A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\">View on Mobile Phone</A> | <A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\">View as Web page</A> </FONT></TD></TR></TBODY></TABLE><BR>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"View on Mobile Phone","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=d2808d4ab6014c8098d1d495907b82a9"},{"type":"Hyperlink","id":"-2","name":"View as Web page","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=24e165a4973c404fbe5801c0ac44a0ad"}],"text":"To view on a mobile phone or to view as a web page, please cut and paste the following link into a browser.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]"},{"type":"EmailHeader","id":"7","createdAt":"1459409934","createdBy":"12","depth":"complete","folderId":"315","name":"RSS_APP_HEADER","permissions":"fullControl","updatedAt":"1493067847","updatedBy":"12","body":"","fieldMerges":[],"hyperlinks":[],"text":""}];
            var emailFooter = [{"type":"EmailFooter","id":"1","depth":"complete","description":"","folderId":"317","name":"Default - Global unsubscribe","permissions":"fullControl","updatedAt":"1266873936","body":"<TABLE style=\"WIDTH: 650px\" align=center>\r\n<TBODY>\r\n<TR>\r\n<TD>\r\n<CENTER><BR>To unsubscribe from future emails or to update your email preferences <A href=\"http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR><BR>Your Company Name<BR>Your Company Address<BR>Your Company City and State</CENTER>\r\n<CENTER>Your Company Postal Code/Zip Code<BR>Your Business Phone<BR><A href=\"LINK TO CLIENT PRIVACY POLICY GOES HERE\">Privacy Policy</A></FONT> </CENTER></TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"click here","href":"http://<elqdomain type=1/>/e/u.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~"},{"type":"Hyperlink","id":"-2","name":"Privacy Policy","href":"LINK TO CLIENT PRIVACY POLICY GOES HERE"}],"text":"To unsubscribe from future emails or to update your email preferences, please cut and paste this link into the browser. \r\n[http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\nYour Company Name\r\nYour Company Address\r\nYour Company City and State\r\nYour Company Postal Code/Zip Code\r\nYour Company Phone\r\n\r\nPrivacy Policy\r\n[LINK TO CLIENT PRIVACY POLICY GOES HERE]"},{"type":"EmailFooter","id":"5","depth":"complete","description":"","folderId":"317","name":"BP - Manage your subscriptions","permissions":"fullControl","updatedAt":"1266872997","body":"<TABLE style=\"WIDTH: 650px\" align=center>\r\n<TBODY>\r\n<TR>\r\n<TD>\r\n<CENTER><BR>To unsubscribe from future emails or to update your e-mail preferences <A href=\"http://s1926145509.t.en25.com/e/sl.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR><BR>Your Company Name Here<BR>Your Company Address<BR>Your City and State<BR>Your Postal Code/Zip Code<BR>Your Business Phone<BR><A href=\"LINK TO CLIENT PRIVACY POLICY GOES HERE\">Privacy Policy</A></FONT> </CENTER></TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"click here","href":"http://<elqdomain type=1/>/e/sl.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~"},{"type":"Hyperlink","id":"-2","name":"Privacy Policy","href":"LINK TO CLIENT PRIVACY POLICY GOES HERE"}],"text":"To unsubscribe from future emails or to update your email preferences, please cut and paste the link into your browser. \r\n[http://s1926145509.t.en25.com/e/sl.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\nYour Company Name\r\nYour Company Address\r\nYour Company City and State\r\nYour Company Postal Code/Zip Code\r\nYour Company Business Phone Number\r\n\r\nPrivacy Policy\r\n[LINK TO CLIENT PRIVACY POLICY GOES HERE]"},{"type":"EmailFooter","id":"8","createdAt":"1184865128","depth":"complete","description":"","folderId":"317","name":"BP - Unsubscribe from similar communications","permissions":"fullControl","updatedAt":"1266873812","body":"<TABLE style=\"WIDTH: 650px\" align=center>\r\n<TBODY>\r\n<TR>\r\n<TD><BR>\r\n<CENTER>If you wish to unsubscribe from similar <SPAN class=eloquaemail>Company</SPAN> email communications, <A href=\"http://s1926145509.t.en25.com/e/cu.aspx?s=<span class=eloquaemail>siteid</span>&elqc=<span class=eloquaemail>campaignid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR>If you wish to unsubscribe from all <SPAN class=eloquaemail>Company</SPAN> email, <A href=\"http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR><BR>Your Company Name<BR>Your Company Address<BR>Your Company City and State<BR>Your Postal Code/Zip Code<BR><BR><A href=\"LINK TO CLIENT PRIVACY POLICY GOES HERE\">Privacy Policy</A></FONT> </CENTER></TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"click here","href":"http://<elqdomain type=1/>/e/cu.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&elqc=~~eloqua..type--emailfield..syntax--campaignid..innerText--campaignid..encodeFor--url~~"},{"type":"Hyperlink","id":"-2","name":"click here","href":"http://<elqdomain type=1/>/e/u.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~"},{"type":"Hyperlink","id":"-3","name":"Privacy Policy","href":"LINK TO CLIENT PRIVACY POLICY GOES HERE"}],"text":"\r\nIf you wish to unsubscribe from similar <span class=\"eloquaemail\">Company</span>\r\nemail communications, click here.\r\n[http://s1926145509.t.en25.com/e/cu.aspx?s=<span class=eloquaemail>siteid</span>&elqc=<span class=eloquaemail>campaignid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\n\r\nIf you wish to unsubscribe from all <span class=\"eloquaemail\">Company</span> email, click here.\r\n[http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\nYour Company Name\r\nYour Company Address\r\nYour Company City and State\r\nYour Company Postal Code/Zip Code\r\nYour Company Phone Number\r\n\r\nPrivacy Policy\r\n[LINK TO CLIENT PRIVACY POLICY GOES HERE]"},{"type":"EmailFooter","id":"10","createdAt":"1459409969","createdBy":"12","depth":"complete","folderId":"316","name":"RSS_APP_FOOTER","permissions":"fullControl","updatedAt":"1459409969","updatedBy":"12","body":"","fieldMerges":[],"hyperlinks":[],"text":""},{"type":"EmailFooter","id":"11","createdAt":"1465285757","createdBy":"12","depth":"complete","folderId":"316","name":"subscription_managment","permissions":"fullControl","updatedAt":"1465286140","updatedBy":"12","body":"<div style=\"text-align: center;\"><a data-targettype=\"sysaction\" href=\"http://s1926145509.t.en25.com/e/sl?s=~~eloqua..type--emailfield..syntax--siteid..encodeFor--url~~&elq=~~eloqua..type--emailfield..syntax--recipientid..encodeFor--url~~\">subscriptions</a></div>\r\n","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"subscriptions","href":"http://<elqdomain type=1/>/e/sl?s=~~eloqua..type--emailfield..syntax--siteid..encodeFor--url~~"}],"text":"\r\nsubscriptions <http://s1926145509.t.en25.com/e/sl?s=~~eloqua..type--emailfield..syntax--siteid..encodeFor--url~~&elq=~~eloqua..type--emailfield..syntax--recipientid..encodeFor--url~~>\r\n\r\n"}];
            
            spyOn(NewsletterEntity, 'query').and.callFake(function(a, cb) 
            {
                return cb([]);
            });

            spyOn(EloquaService, 'segments').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(segments);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'emailGroups').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailGroups);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'emailHeaders').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailHeader);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'emailFooters').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailFooter);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'eloquaEmailEncoding').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(encoding);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'eloquaEmailConfig').and.callFake(function(a, cb) 
            {
                // console.log('eloquaEmailConfig -----------!!!!!!!!!!!-----------');
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailConfig);
                };
                return mySpy;
            });

            spyOn(ProductSettings.byProductName, 'get').and.callFake(function(a, cb) 
            {
                // console.log('byProductName  get-----------!!!!!!!!!!!-----------');
                // var  mySpy = {};
                // mySpy.get = function(a,cb) 
                // {
                //     return cb();
                // };
                var pSettings = {
                    defaults:
                    {
                        campaignFolder: '1',
                        emailFolder: '1',
                        replyToName: '1',
                        replyToEmail: '1',
                        segmentFolder: '1',
                    }
                };
                return cb(pSettings);
            });

            // spyOn(Circles, 'mineCompany').and.callFake(function(a, cb) 
            // {
            //    return cb(mineCompany);
            // });

            $httpBackend.when('GET', 'system/views/index.html').respond('<section data-ng-controller="IndexController"></section>');
            $httpBackend.when('GET', '/api/users/me').respond({});
            $httpBackend.when('GET', '/api/emaileditor/emailmodule').respond({});
            $httpBackend.when('GET', '/api/companies/settings/product/EMAILEDITOR').respond({});
            $httpBackend.when('GET', 'meanStarter/views/system/index.html').respond({});

            $scope.load(function()
            {
                // $scope.init();
                expect(NewsletterEntity.query).toHaveBeenCalled();
                expect(EloquaService.segments).toHaveBeenCalled();
                expect(EloquaService.emailGroups).toHaveBeenCalled();
                expect(EloquaService.eloquaEmailEncoding).toHaveBeenCalled();
                expect(EloquaService.eloquaEmailConfig).toHaveBeenCalled();
                expect(ProductSettings.byProductName.get).toHaveBeenCalled();
                // expect(Circles.mineCompany).toHaveBeenCalled();

                expect($scope.entity).not.toBe(null);
                //TODO doublecheck test


                // expect($scope.entity).toBe(undefined);
                // console.log($scope.entity);
                // expect($scope.entity.eloquaEmailGroup).toBe('');
                // expect($scope.entity.bounceBackAddress).toBe(entity1[0].bounceBackAddress);
                // expect($scope.entity.eloquaEmailEncoding).toBe('');
                // expect($scope.entity.replyToName).toBe(entity1[0].replyToName);
                // expect($scope.entity.replyToEmail).toBe(entity1[0].replyToEmail);
                // expect($scope.entity.fromAddress).toBe(entity1[0].fromAddress);
                // expect($scope.entity.senderName).toBe(entity1[0].senderName);

                done();
            });
            $timeout.flush();
        });

        it('load - but Eloqua token timedout', function (done)
        {
            // console.log($scope);
            expect($scope.rssContent).toEqual('omg');  

            var segments    = [{"type":"ContactSegment","currentStatus":"Active","id":"3","createdAt":"1459410210","createdBy":"12","depth":"minimal","folderId":"484","name":"test segment - simon only","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1476724194","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"5","createdAt":"1461793374","createdBy":"17","depth":"minimal","folderId":"484","name":"JR Only","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1461793430","updatedBy":"17"},{"type":"ContactSegment","currentStatus":"Draft","id":"8","createdAt":"1468221078","createdBy":"12","depth":"minimal","folderId":"484","name":"litmus_spam_test","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1476724071","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"11","createdAt":"1486543292","createdBy":"12","depth":"minimal","folderId":"484","name":"Bonava_Demo","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1486543332","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"12","createdAt":"1493067346","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment A","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186001","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"13","createdAt":"1493067382","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment B","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186013","updatedBy":"12"},{"type":"ContactSegment","currentStatus":"Draft","id":"14","createdAt":"1493067391","createdBy":"12","depth":"minimal","folderId":"484","name":"Segment C","permissions":["Retrieve","SetSecurity","Delete","Update"],"updatedAt":"1493186025","updatedBy":"12"}];
            var emailGroups = [{"type":"EmailGroup","id":"1","depth":"complete","description":"","name":"My Emails","permissions":"fullControl","displayName":"","emailFooterId":"1","emailHeaderId":"1","emailIds":["100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","184","185","186","187","188","189","190","191"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"96dd078f-e463-4928-95ca-1abfd79993df","subscriptionListId":"2","unSubscriptionListDataLookupId":"21416d74-67f1-4c49-8c8b-88870e682137","unSubscriptionListId":"3","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"2","depth":"complete","name":"Newsletter","permissions":"fullControl","emailFooterId":"1","emailHeaderId":"1","emailIds":["122","123","124","259"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"e9f41629-b336-49bd-b25f-39d35a09e9bf","subscriptionListId":"4","unSubscriptionListDataLookupId":"1e511703-8ea1-45f3-b743-0cb8da712b34","unSubscriptionListId":"5","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"3","depth":"complete","name":"Events","permissions":"fullControl","updatedAt":"1465286039","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":["60"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"b596fcee-1d1b-4c08-bfa0-dfe7ed98653f","subscriptionListId":"6","unSubscriptionListDataLookupId":"44d6c38b-a47d-4278-b400-420af5a40483","unSubscriptionListId":"7","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"4","depth":"complete","name":"Testing Area","permissions":"fullControl","updatedAt":"1465286047","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":["137","139","138","142","143","147","152","153","154","158","159","213","212","219","55","163","237","238","239","240","241","244","210","211","214","215","216","218","217","227","59","125","144","145","62","118","119","120","121","132","133","134","135","136","141","148","151","208","156","246","245","247","248","249","250","255","256","257","258","242","243","197","196","204","205","58","56","160","161","162","182","183","200","198","199","201","202","203","206","207","209","140","57","117","164","169","165","172","166","174","175","177","173","167","171","170","168","176","178","194","195","192","193","179","180","181","99","260","223","224","225","235","236","251","252","253","254","146"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"9e07fc25-0ed5-4136-acf9-e31fe3e32806","subscriptionListId":"8","unSubscriptionListDataLookupId":"d46d51d2-ae11-4adc-b84e-c545472d4a10","unSubscriptionListId":"9","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"6","depth":"complete","description":"","name":"BP - Templates","permissions":"fullControl","updatedAt":"1306513777","displayName":"","emailFooterId":"1","emailHeaderId":"1","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"c82aed33-0ead-46cb-aa2a-587cf99a96aa","subscriptionListId":"24","unSubscriptionListDataLookupId":"cef06117-4668-46f6-8801-a4ba5e4c57e2","unSubscriptionListId":"25","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"10","createdAt":"1450124980","createdBy":"12","depth":"complete","name":"Transactional Emails","permissions":"fullControl","updatedAt":"1450124990","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"5","subscriptionListDataLookupId":"162b63aa-afbe-4ac2-acab-bd11dfe4fc26","subscriptionListId":"58","unSubscriptionListDataLookupId":"fc4eec4a-48b3-42bf-8d73-4fc2b8bfb613","unSubscriptionListId":"59","unsubscriptionLandingPageId":"5"},{"type":"EmailGroup","id":"11","createdAt":"1461170777","createdBy":"12","depth":"complete","name":"TEST","permissions":"fullControl","updatedAt":"1461170777","updatedBy":"12","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"8","subscriptionListDataLookupId":"07eab9ce-d7ea-4c95-8413-f516e75f00ad","subscriptionListId":"62","unSubscriptionListDataLookupId":"e2c5ebf2-86c7-458e-b9ae-dd814e617493","unSubscriptionListId":"63","unsubscriptionLandingPageId":"1"},{"type":"EmailGroup","id":"12","createdAt":"1461793011","createdBy":"17","depth":"complete","name":"JR Sandbox","permissions":"fullControl","updatedAt":"1461793011","updatedBy":"17","emailFooterId":"1","emailHeaderId":"1","emailIds":["126","128","127","149","150","157","155"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"2","subscriptionListDataLookupId":"3e92d9e0-9461-4dc2-8d70-8533d5d99947","subscriptionListId":"64","unSubscriptionListDataLookupId":"5ad7a051-bcfa-4b1e-a3aa-a6448206349a","unSubscriptionListId":"65","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"13","createdAt":"1465561679","createdBy":"12","depth":"complete","name":"test123","permissions":"fullControl","updatedAt":"1465561679","updatedBy":"12","emailFooterId":"10","emailHeaderId":"7","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"0604bf0e-dc18-4100-98b5-5415c32482c0","subscriptionListId":"68","unSubscriptionListDataLookupId":"a9099dbd-1437-4c45-93be-de7995cfc739","unSubscriptionListId":"69","unsubscriptionLandingPageId":"1"}];
            var encoding    = [{"type":"EmailEncoding","id":"4","name":"Arabic"},{"type":"EmailEncoding","id":"5","name":"Bulgarian"},{"type":"EmailEncoding","id":"6","name":"Catalan"},{"type":"EmailEncoding","id":"7","name":"Chinese (Simplified)"},{"type":"EmailEncoding","id":"8","name":"Chinese (Traditional)"},{"type":"EmailEncoding","id":"9","name":"Croatian"},{"type":"EmailEncoding","id":"10","name":"Czech"},{"type":"EmailEncoding","id":"11","name":"Danish"},{"type":"EmailEncoding","id":"12","name":"Dutch"},{"type":"EmailEncoding","id":"1","name":"English"},{"type":"EmailEncoding","id":"13","name":"Estonian"},{"type":"EmailEncoding","id":"14","name":"Finnish"},{"type":"EmailEncoding","id":"2","name":"French"},{"type":"EmailEncoding","id":"15","name":"German"},{"type":"EmailEncoding","id":"16","name":"Greek"},{"type":"EmailEncoding","id":"17","name":"Hebrew"},{"type":"EmailEncoding","id":"18","name":"Hungarian"},{"type":"EmailEncoding","id":"19","name":"Icelandic"},{"type":"EmailEncoding","id":"20","name":"Indonesian"},{"type":"EmailEncoding","id":"21","name":"Italian"},{"type":"EmailEncoding","id":"22","name":"Japanese"},{"type":"EmailEncoding","id":"23","name":"Korean"},{"type":"EmailEncoding","id":"24","name":"Latvian"},{"type":"EmailEncoding","id":"25","name":"Lithuanian"},{"type":"EmailEncoding","id":"26","name":"Norwegian"},{"type":"EmailEncoding","id":"27","name":"Polish"},{"type":"EmailEncoding","id":"28","name":"Portuguese"},{"type":"EmailEncoding","id":"29","name":"Romanian"},{"type":"EmailEncoding","id":"30","name":"Russian"},{"type":"EmailEncoding","id":"31","name":"Serbian"},{"type":"EmailEncoding","id":"32","name":"Slovak"},{"type":"EmailEncoding","id":"33","name":"Slovenian"},{"type":"EmailEncoding","id":"34","name":"Spanish"},{"type":"EmailEncoding","id":"35","name":"Swedish"},{"type":"EmailEncoding","id":"37","name":"Thai"},{"type":"EmailEncoding","id":"36","name":"Turkish"},{"type":"EmailEncoding","id":"3","name":"Unicode (UTF-8)"}];
            var emailConfig = {"type":"EmailConfig","bouncebackAddresses":["differentBOUNCEBACK@s1926145509.m.en25.com"],"fromAddress":"test333@en25.com","replyToAddress":"replytest333@en25.com","replyToName":"Technology Partner - Lead Mgt Tech Solutions AB","subscriptionLandingPageId":"1","unsubscriptionLandingPageId":"3"};
            var mineCompany = {"allowed":["Company_Admin","RSSAPP"],"descendants":{"Company_Admin":[],"RSSAPP":[]}};
            var emailHeader = [{"type":"EmailHeader","id":"1","depth":"complete","folderId":"315","name":"Default - Show Email Link","permissions":"fullControl","updatedAt":"1243267870","body":"<TABLE width=550 class=\"emailheader\" align=center>  <TBODY>  <TR>  <TD align=middle><FONT face=Arial size=1>If you are having trouble reading this email, <A href=\"http://now.eloqua.com/es.asp?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqEmailSaveGUID</span>&elq=<span class=eloquaemail>recipientid</span>\">read the online version</A>. </FONT></TD></TR></TBODY></TABLE><BR>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"read the online version","href":"http://now.eloqua.com/es.asp?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqEmailSaveGUID..innerText--elqEmailSaveGUID..encodeFor--url~~&elqTrackId=5b0c65074e3145ce8f404f8cc0a7558e"}],"text":"If you have trouble viewing this email, read the online version.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]     "},{"type":"EmailHeader","id":"3","depth":"complete","folderId":"315","name":"BP - Show Email Link II","permissions":"fullControl","updatedAt":"1243267766","body":"<TABLE width=650 align=center>\r\n<TBODY>\r\n<TR>\r\n<TD align=middle><FONT face=Arial size=1><A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\">If you have trouble displaying this email, view it as a web page.</A></FONT> </TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"If you have trouble displaying this email, view it as a web page.","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=705b39fa4ad94ab393cdbc2ed47d3b8a"}],"text":"If you have trouble displaying this email, view it as a web page.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]"},{"type":"EmailHeader","id":"4","createdAt":"1210815116","depth":"complete","folderId":"315","name":"BP - Show Email Link w/ Safe Senders Message","permissions":"fullControl","updatedAt":"1243267810","body":"<TABLE width=650 align=center>\r\n<TBODY>\r\n<TR>\r\n<TD align=middle><FONT face=Arial size=1>To ensure you continue to receive&nbsp;COMPANYNAME's communications in a timely manner and also directly into your inbox, <BR>please add&nbsp;EMAILADDRESS to your safe senders list or address book within your email client.</FONT><BR><FONT face=Arial size=1>If you&nbsp;have trouble reading this email, </FONT><A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\"><FONT face=Arial size=1>read the online version</FONT></A><FONT face=Arial size=1>.</FONT> </TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"read the online version","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=372ec109e946425db18c4d2445772956"}],"text":"To ensure you continue to receive COMPANYNAME's communications in a timely manner and also directly into your inbox, \r\nplease add EMAILADDRESS to your safe senders list or address book within your email client.\r\n\r\nIf you have trouble reading this email, read the online version.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]"},{"type":"EmailHeader","id":"5","createdAt":"1243263534","depth":"complete","folderId":"315","name":"BP - View on Mobile","permissions":"fullControl","updatedAt":"1243267815","body":"<TABLE width=650 align=center>\r\n<TBODY>\r\n<TR>\r\n<TD align=middle><FONT face=Arial size=1><A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\">View on Mobile Phone</A> | <A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\">View as Web page</A> </FONT></TD></TR></TBODY></TABLE><BR>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"View on Mobile Phone","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=d2808d4ab6014c8098d1d495907b82a9"},{"type":"Hyperlink","id":"-2","name":"View as Web page","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=24e165a4973c404fbe5801c0ac44a0ad"}],"text":"To view on a mobile phone or to view as a web page, please cut and paste the following link into a browser.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]"},{"type":"EmailHeader","id":"7","createdAt":"1459409934","createdBy":"12","depth":"complete","folderId":"315","name":"RSS_APP_HEADER","permissions":"fullControl","updatedAt":"1493067847","updatedBy":"12","body":"","fieldMerges":[],"hyperlinks":[],"text":""}];
            var emailFooter = [{"type":"EmailFooter","id":"1","depth":"complete","description":"","folderId":"317","name":"Default - Global unsubscribe","permissions":"fullControl","updatedAt":"1266873936","body":"<TABLE style=\"WIDTH: 650px\" align=center>\r\n<TBODY>\r\n<TR>\r\n<TD>\r\n<CENTER><BR>To unsubscribe from future emails or to update your email preferences <A href=\"http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR><BR>Your Company Name<BR>Your Company Address<BR>Your Company City and State</CENTER>\r\n<CENTER>Your Company Postal Code/Zip Code<BR>Your Business Phone<BR><A href=\"LINK TO CLIENT PRIVACY POLICY GOES HERE\">Privacy Policy</A></FONT> </CENTER></TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"click here","href":"http://<elqdomain type=1/>/e/u.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~"},{"type":"Hyperlink","id":"-2","name":"Privacy Policy","href":"LINK TO CLIENT PRIVACY POLICY GOES HERE"}],"text":"To unsubscribe from future emails or to update your email preferences, please cut and paste this link into the browser. \r\n[http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\nYour Company Name\r\nYour Company Address\r\nYour Company City and State\r\nYour Company Postal Code/Zip Code\r\nYour Company Phone\r\n\r\nPrivacy Policy\r\n[LINK TO CLIENT PRIVACY POLICY GOES HERE]"},{"type":"EmailFooter","id":"5","depth":"complete","description":"","folderId":"317","name":"BP - Manage your subscriptions","permissions":"fullControl","updatedAt":"1266872997","body":"<TABLE style=\"WIDTH: 650px\" align=center>\r\n<TBODY>\r\n<TR>\r\n<TD>\r\n<CENTER><BR>To unsubscribe from future emails or to update your e-mail preferences <A href=\"http://s1926145509.t.en25.com/e/sl.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR><BR>Your Company Name Here<BR>Your Company Address<BR>Your City and State<BR>Your Postal Code/Zip Code<BR>Your Business Phone<BR><A href=\"LINK TO CLIENT PRIVACY POLICY GOES HERE\">Privacy Policy</A></FONT> </CENTER></TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"click here","href":"http://<elqdomain type=1/>/e/sl.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~"},{"type":"Hyperlink","id":"-2","name":"Privacy Policy","href":"LINK TO CLIENT PRIVACY POLICY GOES HERE"}],"text":"To unsubscribe from future emails or to update your email preferences, please cut and paste the link into your browser. \r\n[http://s1926145509.t.en25.com/e/sl.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\nYour Company Name\r\nYour Company Address\r\nYour Company City and State\r\nYour Company Postal Code/Zip Code\r\nYour Company Business Phone Number\r\n\r\nPrivacy Policy\r\n[LINK TO CLIENT PRIVACY POLICY GOES HERE]"},{"type":"EmailFooter","id":"8","createdAt":"1184865128","depth":"complete","description":"","folderId":"317","name":"BP - Unsubscribe from similar communications","permissions":"fullControl","updatedAt":"1266873812","body":"<TABLE style=\"WIDTH: 650px\" align=center>\r\n<TBODY>\r\n<TR>\r\n<TD><BR>\r\n<CENTER>If you wish to unsubscribe from similar <SPAN class=eloquaemail>Company</SPAN> email communications, <A href=\"http://s1926145509.t.en25.com/e/cu.aspx?s=<span class=eloquaemail>siteid</span>&elqc=<span class=eloquaemail>campaignid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR>If you wish to unsubscribe from all <SPAN class=eloquaemail>Company</SPAN> email, <A href=\"http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR><BR>Your Company Name<BR>Your Company Address<BR>Your Company City and State<BR>Your Postal Code/Zip Code<BR><BR><A href=\"LINK TO CLIENT PRIVACY POLICY GOES HERE\">Privacy Policy</A></FONT> </CENTER></TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"click here","href":"http://<elqdomain type=1/>/e/cu.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&elqc=~~eloqua..type--emailfield..syntax--campaignid..innerText--campaignid..encodeFor--url~~"},{"type":"Hyperlink","id":"-2","name":"click here","href":"http://<elqdomain type=1/>/e/u.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~"},{"type":"Hyperlink","id":"-3","name":"Privacy Policy","href":"LINK TO CLIENT PRIVACY POLICY GOES HERE"}],"text":"\r\nIf you wish to unsubscribe from similar <span class=\"eloquaemail\">Company</span>\r\nemail communications, click here.\r\n[http://s1926145509.t.en25.com/e/cu.aspx?s=<span class=eloquaemail>siteid</span>&elqc=<span class=eloquaemail>campaignid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\n\r\nIf you wish to unsubscribe from all <span class=\"eloquaemail\">Company</span> email, click here.\r\n[http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\nYour Company Name\r\nYour Company Address\r\nYour Company City and State\r\nYour Company Postal Code/Zip Code\r\nYour Company Phone Number\r\n\r\nPrivacy Policy\r\n[LINK TO CLIENT PRIVACY POLICY GOES HERE]"},{"type":"EmailFooter","id":"10","createdAt":"1459409969","createdBy":"12","depth":"complete","folderId":"316","name":"RSS_APP_FOOTER","permissions":"fullControl","updatedAt":"1459409969","updatedBy":"12","body":"","fieldMerges":[],"hyperlinks":[],"text":""},{"type":"EmailFooter","id":"11","createdAt":"1465285757","createdBy":"12","depth":"complete","folderId":"316","name":"subscription_managment","permissions":"fullControl","updatedAt":"1465286140","updatedBy":"12","body":"<div style=\"text-align: center;\"><a data-targettype=\"sysaction\" href=\"http://s1926145509.t.en25.com/e/sl?s=~~eloqua..type--emailfield..syntax--siteid..encodeFor--url~~&elq=~~eloqua..type--emailfield..syntax--recipientid..encodeFor--url~~\">subscriptions</a></div>\r\n","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"subscriptions","href":"http://<elqdomain type=1/>/e/sl?s=~~eloqua..type--emailfield..syntax--siteid..encodeFor--url~~"}],"text":"\r\nsubscriptions <http://s1926145509.t.en25.com/e/sl?s=~~eloqua..type--emailfield..syntax--siteid..encodeFor--url~~&elq=~~eloqua..type--emailfield..syntax--recipientid..encodeFor--url~~>\r\n\r\n"}];
         
            spyOn(NewsletterEntity, 'query').and.callFake(function(a, cb) 
            {
                return cb(entity1);
            });

            spyOn(EloquaService, 'segments').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb, errorCb) 
                {
                    return errorCb({code: 401});
                };
                return mySpy;
            });

            spyOn(EloquaService, 'emailGroups').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailGroups);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'emailHeaders').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailHeader);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'emailFooters').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailFooter);
                };
                return mySpy;
            });
            
            spyOn(EloquaService, 'eloquaEmailEncoding').and.callFake(function(a, cb) 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(encoding);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'eloquaEmailConfig').and.callFake(function(a, cb) 
            {
                // console.log('eloquaEmailConfig -----------!!!!!!!!!!!-----------');
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailConfig);
                };
                return mySpy;
            });

            spyOn(ProductSettings.byProductName, 'get').and.callFake(function(a, cb) 
            {
                // console.log('byProductName  get-----------!!!!!!!!!!!-----------');
                // var  mySpy = {};
                // mySpy.get = function(a,cb) 
                // {
                //     return cb();
                // };
                var pSettings = {
                    defaults:
                    {
                        campaignFolder: '1',
                        emailFolder: '1',
                        replyToName: '1',
                        replyToEmail: '1',
                        segmentFolder: '1',
                    }
                };
                return cb(pSettings);
            });

            // spyOn(Circles, 'mineCompany').and.callFake(function(a, cb) 
            // {
            //     return cb(mineCompany);
            // });

            $httpBackend.when('GET', 'system/views/index.html').respond('<section data-ng-controller="IndexController"></section>');
            $httpBackend.when('GET', '/api/users/me').respond({});
            $httpBackend.when('GET', '/api/emaileditor/emailmodule').respond({});
            $httpBackend.when('GET', '/api/companies/settings/product/EMAILEDITOR').respond({});
            $httpBackend.when('GET', 'meanStarter/views/system/index.html').respond({});

            $scope.load(function()
            {
                // $scope.init();
                expect(NewsletterEntity.query).toHaveBeenCalled();
                expect(EloquaService.segments).toHaveBeenCalled();
                expect(EloquaService.emailGroups).toHaveBeenCalled();
                expect(EloquaService.eloquaEmailEncoding).toHaveBeenCalled();
                expect(EloquaService.eloquaEmailConfig).toHaveBeenCalled();
                expect(ProductSettings.byProductName.get).toHaveBeenCalled();
                // expect(Circles.mineCompany).toHaveBeenCalled();

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
    });

    describe('init - without entity', function ()
    {
        beforeEach(function()
        {   
            module('mean');
            module('mean.system');
            module('mean.admin');
            module('mean.circles');
            // module('mean.swagger');
            module('mean.users');
            module('mean.meanStarter');
            module('mean.companies');
            module('mean.emaileditor');
        });

        var $controller;
        var $scope, NewsletterEntity, EloquaService, ProductSettings, Circles, $timeout, $httpBackend;
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
                "replyToEmail": "su pport@leadteq.com",
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
        
        beforeEach(inject(function(_$controller_, $rootScope, _$httpBackend_ ,_$q_, _$timeout_, _NewsletterEntity_, _EloquaService_, _ProductSettings_, _Circles_) 
        {
            $scope              = $rootScope.$new();
            $timeout            = _$timeout_;
            NewsletterEntity    = _NewsletterEntity_;
            EloquaService       = _EloquaService_;
            ProductSettings     = _ProductSettings_;
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
            var emailGroups = 
            [
                {"type":"EmailGroup","id":"1","depth":"complete","description":"","name":"My Emails","permissions":"fullControl","displayName":"","emailFooterId":"1","emailHeaderId":"1","emailIds":["100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","184","185","186","187","188","189","190","191"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"96dd078f-e463-4928-95ca-1abfd79993df","subscriptionListId":"2","unSubscriptionListDataLookupId":"21416d74-67f1-4c49-8c8b-88870e682137","unSubscriptionListId":"3","unsubscriptionLandingPageId":"3"},
                {"type":"EmailGroup","id":"2","depth":"complete","name":"Newsletter","permissions":"fullControl","emailFooterId":"1","emailHeaderId":"1","emailIds":["122","123","124","259"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"e9f41629-b336-49bd-b25f-39d35a09e9bf","subscriptionListId":"4","unSubscriptionListDataLookupId":"1e511703-8ea1-45f3-b743-0cb8da712b34","unSubscriptionListId":"5","unsubscriptionLandingPageId":"3"},
                {"type":"EmailGroup","id":"3","depth":"complete","name":"Events","permissions":"fullControl","updatedAt":"1465286039","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":["60"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"b596fcee-1d1b-4c08-bfa0-dfe7ed98653f","subscriptionListId":"6","unSubscriptionListDataLookupId":"44d6c38b-a47d-4278-b400-420af5a40483","unSubscriptionListId":"7","unsubscriptionLandingPageId":"3"},
                {"type":"EmailGroup","id":"4","depth":"complete","name":"Testing Area","permissions":"fullControl","updatedAt":"1465286047","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":["137","139","138","142","143","147","152","153","154","158","159","213","212","219","55","163","237","238","239","240","241","244","210","211","214","215","216","218","217","227","59","125","144","145","62","118","119","120","121","132","133","134","135","136","141","148","151","208","156","246","245","247","248","249","250","255","256","257","258","242","243","197","196","204","205","58","56","160","161","162","182","183","200","198","199","201","202","203","206","207","209","140","57","117","164","169","165","172","166","174","175","177","173","167","171","170","168","176","178","194","195","192","193","179","180","181","99","260","223","224","225","235","236","251","252","253","254","146"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"9e07fc25-0ed5-4136-acf9-e31fe3e32806","subscriptionListId":"8","unSubscriptionListDataLookupId":"d46d51d2-ae11-4adc-b84e-c545472d4a10","unSubscriptionListId":"9","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"6","depth":"complete","description":"","name":"BP - Templates","permissions":"fullControl","updatedAt":"1306513777","displayName":"","emailFooterId":"1","emailHeaderId":"1","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"c82aed33-0ead-46cb-aa2a-587cf99a96aa","subscriptionListId":"24","unSubscriptionListDataLookupId":"cef06117-4668-46f6-8801-a4ba5e4c57e2","unSubscriptionListId":"25","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"10","createdAt":"1450124980","createdBy":"12","depth":"complete","name":"Transactional Emails","permissions":"fullControl","updatedAt":"1450124990","updatedBy":"12","emailFooterId":"1","emailHeaderId":"1","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"false","subscriptionLandingPageId":"5","subscriptionListDataLookupId":"162b63aa-afbe-4ac2-acab-bd11dfe4fc26","subscriptionListId":"58","unSubscriptionListDataLookupId":"fc4eec4a-48b3-42bf-8d73-4fc2b8bfb613","unSubscriptionListId":"59","unsubscriptionLandingPageId":"5"},{"type":"EmailGroup","id":"11","createdAt":"1461170777","createdBy":"12","depth":"complete","name":"TEST","permissions":"fullControl","updatedAt":"1461170777","updatedBy":"12","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"8","subscriptionListDataLookupId":"07eab9ce-d7ea-4c95-8413-f516e75f00ad","subscriptionListId":"62","unSubscriptionListDataLookupId":"e2c5ebf2-86c7-458e-b9ae-dd814e617493","unSubscriptionListId":"63","unsubscriptionLandingPageId":"1"},{"type":"EmailGroup","id":"12","createdAt":"1461793011","createdBy":"17","depth":"complete","name":"JR Sandbox","permissions":"fullControl","updatedAt":"1461793011","updatedBy":"17","emailFooterId":"1","emailHeaderId":"1","emailIds":["126","128","127","149","150","157","155"],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"2","subscriptionListDataLookupId":"3e92d9e0-9461-4dc2-8d70-8533d5d99947","subscriptionListId":"64","unSubscriptionListDataLookupId":"5ad7a051-bcfa-4b1e-a3aa-a6448206349a","unSubscriptionListId":"65","unsubscriptionLandingPageId":"3"},{"type":"EmailGroup","id":"13","createdAt":"1465561679","createdBy":"12","depth":"complete","name":"test123","permissions":"fullControl","updatedAt":"1465561679","updatedBy":"12","emailFooterId":"10","emailHeaderId":"7","emailIds":[],"isVisibleInOutlookPlugin":"false","isVisibleInPublicSubscriptionList":"true","subscriptionLandingPageId":"1","subscriptionListDataLookupId":"0604bf0e-dc18-4100-98b5-5415c32482c0","subscriptionListId":"68","unSubscriptionListDataLookupId":"a9099dbd-1437-4c45-93be-de7995cfc739","unSubscriptionListId":"69","unsubscriptionLandingPageId":"1"}];
            var encoding    = [{"type":"EmailEncoding","id":"4","name":"Arabic"},{"type":"EmailEncoding","id":"5","name":"Bulgarian"},{"type":"EmailEncoding","id":"6","name":"Catalan"},{"type":"EmailEncoding","id":"7","name":"Chinese (Simplified)"},{"type":"EmailEncoding","id":"8","name":"Chinese (Traditional)"},{"type":"EmailEncoding","id":"9","name":"Croatian"},{"type":"EmailEncoding","id":"10","name":"Czech"},{"type":"EmailEncoding","id":"11","name":"Danish"},{"type":"EmailEncoding","id":"12","name":"Dutch"},{"type":"EmailEncoding","id":"1","name":"English"},{"type":"EmailEncoding","id":"13","name":"Estonian"},{"type":"EmailEncoding","id":"14","name":"Finnish"},{"type":"EmailEncoding","id":"2","name":"French"},{"type":"EmailEncoding","id":"15","name":"German"},{"type":"EmailEncoding","id":"16","name":"Greek"},{"type":"EmailEncoding","id":"17","name":"Hebrew"},{"type":"EmailEncoding","id":"18","name":"Hungarian"},{"type":"EmailEncoding","id":"19","name":"Icelandic"},{"type":"EmailEncoding","id":"20","name":"Indonesian"},{"type":"EmailEncoding","id":"21","name":"Italian"},{"type":"EmailEncoding","id":"22","name":"Japanese"},{"type":"EmailEncoding","id":"23","name":"Korean"},{"type":"EmailEncoding","id":"24","name":"Latvian"},{"type":"EmailEncoding","id":"25","name":"Lithuanian"},{"type":"EmailEncoding","id":"26","name":"Norwegian"},{"type":"EmailEncoding","id":"27","name":"Polish"},{"type":"EmailEncoding","id":"28","name":"Portuguese"},{"type":"EmailEncoding","id":"29","name":"Romanian"},{"type":"EmailEncoding","id":"30","name":"Russian"},{"type":"EmailEncoding","id":"31","name":"Serbian"},{"type":"EmailEncoding","id":"32","name":"Slovak"},{"type":"EmailEncoding","id":"33","name":"Slovenian"},{"type":"EmailEncoding","id":"34","name":"Spanish"},{"type":"EmailEncoding","id":"35","name":"Swedish"},{"type":"EmailEncoding","id":"37","name":"Thai"},{"type":"EmailEncoding","id":"36","name":"Turkish"},{"type":"EmailEncoding","id":"3","name":"Unicode (UTF-8)"}];
            var emailConfig = {"type":"EmailConfig","bouncebackAddresses":["TechnologyPartnerLeadMgtTechSolutionsAB@s1926145509.m.en25.com"],"fromAddress":"newclient@en25.com","replyToAddress":"newclient@en25.com","replyToName":"Technology Partner - Lead Mgt Tech Solutions AB","subscriptionLandingPageId":"1","unsubscriptionLandingPageId":"3"};
            var mineCompany = {"allowed":["Company_Admin","RSSAPP"],"descendants":{"Company_Admin":[],"RSSAPP":[]}};
            var emailHeader = [{"type":"EmailHeader","id":"1","depth":"complete","folderId":"315","name":"Default - Show Email Link","permissions":"fullControl","updatedAt":"1243267870","body":"<TABLE width=550 class=\"emailheader\" align=center>  <TBODY>  <TR>  <TD align=middle><FONT face=Arial size=1>If you are having trouble reading this email, <A href=\"http://now.eloqua.com/es.asp?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqEmailSaveGUID</span>&elq=<span class=eloquaemail>recipientid</span>\">read the online version</A>. </FONT></TD></TR></TBODY></TABLE><BR>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"read the online version","href":"http://now.eloqua.com/es.asp?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqEmailSaveGUID..innerText--elqEmailSaveGUID..encodeFor--url~~&elqTrackId=5b0c65074e3145ce8f404f8cc0a7558e"}],"text":"If you have trouble viewing this email, read the online version.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]     "},{"type":"EmailHeader","id":"3","depth":"complete","folderId":"315","name":"BP - Show Email Link II","permissions":"fullControl","updatedAt":"1243267766","body":"<TABLE width=650 align=center>\r\n<TBODY>\r\n<TR>\r\n<TD align=middle><FONT face=Arial size=1><A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\">If you have trouble displaying this email, view it as a web page.</A></FONT> </TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"If you have trouble displaying this email, view it as a web page.","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=705b39fa4ad94ab393cdbc2ed47d3b8a"}],"text":"If you have trouble displaying this email, view it as a web page.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]"},{"type":"EmailHeader","id":"4","createdAt":"1210815116","depth":"complete","folderId":"315","name":"BP - Show Email Link w/ Safe Senders Message","permissions":"fullControl","updatedAt":"1243267810","body":"<TABLE width=650 align=center>\r\n<TBODY>\r\n<TR>\r\n<TD align=middle><FONT face=Arial size=1>To ensure you continue to receive&nbsp;COMPANYNAME's communications in a timely manner and also directly into your inbox, <BR>please add&nbsp;EMAILADDRESS to your safe senders list or address book within your email client.</FONT><BR><FONT face=Arial size=1>If you&nbsp;have trouble reading this email, </FONT><A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\"><FONT face=Arial size=1>read the online version</FONT></A><FONT face=Arial size=1>.</FONT> </TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"read the online version","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=372ec109e946425db18c4d2445772956"}],"text":"To ensure you continue to receive COMPANYNAME's communications in a timely manner and also directly into your inbox, \r\nplease add EMAILADDRESS to your safe senders list or address book within your email client.\r\n\r\nIf you have trouble reading this email, read the online version.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]"},{"type":"EmailHeader","id":"5","createdAt":"1243263534","depth":"complete","folderId":"315","name":"BP - View on Mobile","permissions":"fullControl","updatedAt":"1243267815","body":"<TABLE width=650 align=center>\r\n<TBODY>\r\n<TR>\r\n<TD align=middle><FONT face=Arial size=1><A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\">View on Mobile Phone</A> | <A href=\"http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>\">View as Web page</A> </FONT></TD></TR></TBODY></TABLE><BR>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"View on Mobile Phone","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=d2808d4ab6014c8098d1d495907b82a9"},{"type":"Hyperlink","id":"-2","name":"View as Web page","href":"http://<elqDomain type=1/>/e/es.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&e=~~eloqua..type--emailfield..syntax--elqemailsaveguid..innerText--elqemailsaveguid..encodeFor--url~~&elqTrackId=24e165a4973c404fbe5801c0ac44a0ad"}],"text":"To view on a mobile phone or to view as a web page, please cut and paste the following link into a browser.\r\n[http://s1926145509.t.en25.com/e/es.aspx?s=<span class=eloquaemail>siteid</span>&e=<span class=eloquaemail>elqemailsaveguid</span>&elq=<span class=eloquaemail>recipientid</span>]"},{"type":"EmailHeader","id":"7","createdAt":"1459409934","createdBy":"12","depth":"complete","folderId":"315","name":"RSS_APP_HEADER","permissions":"fullControl","updatedAt":"1493067847","updatedBy":"12","body":"","fieldMerges":[],"hyperlinks":[],"text":""}];
            var emailFooter = [{"type":"EmailFooter","id":"1","depth":"complete","description":"","folderId":"317","name":"Default - Global unsubscribe","permissions":"fullControl","updatedAt":"1266873936","body":"<TABLE style=\"WIDTH: 650px\" align=center>\r\n<TBODY>\r\n<TR>\r\n<TD>\r\n<CENTER><BR>To unsubscribe from future emails or to update your email preferences <A href=\"http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR><BR>Your Company Name<BR>Your Company Address<BR>Your Company City and State</CENTER>\r\n<CENTER>Your Company Postal Code/Zip Code<BR>Your Business Phone<BR><A href=\"LINK TO CLIENT PRIVACY POLICY GOES HERE\">Privacy Policy</A></FONT> </CENTER></TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"click here","href":"http://<elqdomain type=1/>/e/u.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~"},{"type":"Hyperlink","id":"-2","name":"Privacy Policy","href":"LINK TO CLIENT PRIVACY POLICY GOES HERE"}],"text":"To unsubscribe from future emails or to update your email preferences, please cut and paste this link into the browser. \r\n[http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\nYour Company Name\r\nYour Company Address\r\nYour Company City and State\r\nYour Company Postal Code/Zip Code\r\nYour Company Phone\r\n\r\nPrivacy Policy\r\n[LINK TO CLIENT PRIVACY POLICY GOES HERE]"},{"type":"EmailFooter","id":"5","depth":"complete","description":"","folderId":"317","name":"BP - Manage your subscriptions","permissions":"fullControl","updatedAt":"1266872997","body":"<TABLE style=\"WIDTH: 650px\" align=center>\r\n<TBODY>\r\n<TR>\r\n<TD>\r\n<CENTER><BR>To unsubscribe from future emails or to update your e-mail preferences <A href=\"http://s1926145509.t.en25.com/e/sl.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR><BR>Your Company Name Here<BR>Your Company Address<BR>Your City and State<BR>Your Postal Code/Zip Code<BR>Your Business Phone<BR><A href=\"LINK TO CLIENT PRIVACY POLICY GOES HERE\">Privacy Policy</A></FONT> </CENTER></TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"click here","href":"http://<elqdomain type=1/>/e/sl.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~"},{"type":"Hyperlink","id":"-2","name":"Privacy Policy","href":"LINK TO CLIENT PRIVACY POLICY GOES HERE"}],"text":"To unsubscribe from future emails or to update your email preferences, please cut and paste the link into your browser. \r\n[http://s1926145509.t.en25.com/e/sl.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\nYour Company Name\r\nYour Company Address\r\nYour Company City and State\r\nYour Company Postal Code/Zip Code\r\nYour Company Business Phone Number\r\n\r\nPrivacy Policy\r\n[LINK TO CLIENT PRIVACY POLICY GOES HERE]"},{"type":"EmailFooter","id":"8","createdAt":"1184865128","depth":"complete","description":"","folderId":"317","name":"BP - Unsubscribe from similar communications","permissions":"fullControl","updatedAt":"1266873812","body":"<TABLE style=\"WIDTH: 650px\" align=center>\r\n<TBODY>\r\n<TR>\r\n<TD><BR>\r\n<CENTER>If you wish to unsubscribe from similar <SPAN class=eloquaemail>Company</SPAN> email communications, <A href=\"http://s1926145509.t.en25.com/e/cu.aspx?s=<span class=eloquaemail>siteid</span>&elqc=<span class=eloquaemail>campaignid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR>If you wish to unsubscribe from all <SPAN class=eloquaemail>Company</SPAN> email, <A href=\"http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>\">click here</A>. <BR><BR>Your Company Name<BR>Your Company Address<BR>Your Company City and State<BR>Your Postal Code/Zip Code<BR><BR><A href=\"LINK TO CLIENT PRIVACY POLICY GOES HERE\">Privacy Policy</A></FONT> </CENTER></TD></TR></TBODY></TABLE>","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"click here","href":"http://<elqdomain type=1/>/e/cu.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~&elqc=~~eloqua..type--emailfield..syntax--campaignid..innerText--campaignid..encodeFor--url~~"},{"type":"Hyperlink","id":"-2","name":"click here","href":"http://<elqdomain type=1/>/e/u.aspx?s=~~eloqua..type--emailfield..syntax--siteid..innerText--siteid..encodeFor--url~~"},{"type":"Hyperlink","id":"-3","name":"Privacy Policy","href":"LINK TO CLIENT PRIVACY POLICY GOES HERE"}],"text":"\r\nIf you wish to unsubscribe from similar <span class=\"eloquaemail\">Company</span>\r\nemail communications, click here.\r\n[http://s1926145509.t.en25.com/e/cu.aspx?s=<span class=eloquaemail>siteid</span>&elqc=<span class=eloquaemail>campaignid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\n\r\nIf you wish to unsubscribe from all <span class=\"eloquaemail\">Company</span> email, click here.\r\n[http://s1926145509.t.en25.com/e/u.aspx?s=<span class=eloquaemail>siteid</span>&elq=<span class=eloquaemail>recipientid</span>]\r\n\r\nYour Company Name\r\nYour Company Address\r\nYour Company City and State\r\nYour Company Postal Code/Zip Code\r\nYour Company Phone Number\r\n\r\nPrivacy Policy\r\n[LINK TO CLIENT PRIVACY POLICY GOES HERE]"},{"type":"EmailFooter","id":"10","createdAt":"1459409969","createdBy":"12","depth":"complete","folderId":"316","name":"RSS_APP_FOOTER","permissions":"fullControl","updatedAt":"1459409969","updatedBy":"12","body":"","fieldMerges":[],"hyperlinks":[],"text":""},{"type":"EmailFooter","id":"11","createdAt":"1465285757","createdBy":"12","depth":"complete","folderId":"316","name":"subscription_managment","permissions":"fullControl","updatedAt":"1465286140","updatedBy":"12","body":"<div style=\"text-align: center;\"><a data-targettype=\"sysaction\" href=\"http://s1926145509.t.en25.com/e/sl?s=~~eloqua..type--emailfield..syntax--siteid..encodeFor--url~~&elq=~~eloqua..type--emailfield..syntax--recipientid..encodeFor--url~~\">subscriptions</a></div>\r\n","fieldMerges":[],"hyperlinks":[{"type":"Hyperlink","id":"-1","name":"subscriptions","href":"http://<elqdomain type=1/>/e/sl?s=~~eloqua..type--emailfield..syntax--siteid..encodeFor--url~~"}],"text":"\r\nsubscriptions <http://s1926145509.t.en25.com/e/sl?s=~~eloqua..type--emailfield..syntax--siteid..encodeFor--url~~&elq=~~eloqua..type--emailfield..syntax--recipientid..encodeFor--url~~>\r\n\r\n"}];
            
            var myproductSettings = {};

            var pSettings = {
                defaults:
                {
                    campaignFolder: '111',
                    emailFolder: '222',
                    replyToName: 'Leadteq-reply-to',
                    replyToEmail: 'replytoemail@leadteq.com',
                    segmentFolder: '333',
                }
            };
            
            spyOn(NewsletterEntity, 'query').and.callFake(function(a, cb) 
            {
                return cb([]);
            });

            spyOn(EloquaService, 'segments').and.callFake(function(a, cb) 
            {
                // console.log('segments -----------!!!!!!!!!!!-----------');
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(segments);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'emailGroups').and.callFake(function(a, cb) 
            {
                // console.log('emailGroups -----------!!!!!!!!!!!-----------');
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailGroups);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'emailHeaders').and.callFake(function(a, cb) 
            {
                // console.log('emailHeaders -----------!!!!!!!!!!!-----------');
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailHeader);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'emailFooters').and.callFake(function(a, cb) 
            {
                // console.log('emailFooters -----------!!!!!!!!!!!-----------');
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailFooter);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'eloquaEmailEncoding').and.callFake(function(a, cb) 
            {
                // console.log('eloquaEmailEncoding -----------!!!!!!!!!!!-----------');
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(encoding);
                };
                return mySpy;
            });

            spyOn(EloquaService, 'eloquaEmailConfig').and.callFake(function(a, cb) 
            {
                // console.log('eloquaEmailConfig -----------!!!!!!!!!!!-----------');
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb(emailConfig);
                };
                return mySpy;
            });

            spyOn(ProductSettings.byProductName, 'get').and.callFake(function(a, cb) 
            {
                // console.log('byProductName  get-----------!!!!!!!!!!!-----------');
                // var  mySpy = {};
                // mySpy.get = function(a,cb) 
                // {
                //     return cb();
                // };
               
                return cb(pSettings);
            });

            // spyOn(Circles, 'mineCompany').and.callFake(function(a, cb) 
            // {
            //    return cb(mineCompany);
            // });

            $httpBackend.when('GET', 'system/views/index.html').respond('<section data-ng-controller="IndexController"></section>');
            $httpBackend.when('GET', '/api/users/me').respond({});
            $httpBackend.when('GET', '/api/emaileditor/emailmodule').respond({});
            $httpBackend.when('GET', '/api/companies/settings/product/EMAILEDITOR').respond({});
            $httpBackend.when('GET', 'meanStarter/views/system/index.html').respond({});

            console.log('---LOAD---');
            $scope.load(function()
            {
                console.log('---LOAD CB---');
                expect(NewsletterEntity.query).not.toHaveBeenCalled();
                expect(EloquaService.segments).toHaveBeenCalled();
                expect(EloquaService.emailGroups).toHaveBeenCalled();
                expect(EloquaService.eloquaEmailEncoding).toHaveBeenCalled();
                expect(EloquaService.eloquaEmailConfig).toHaveBeenCalled();
                expect(ProductSettings.byProductName.get).toHaveBeenCalled();
                // expect(Circles.mineCompany).toHaveBeenCalled();

                expect($scope.entity).not.toBe(null);
                expect($scope.entity).not.toBe(undefined);
                // console.log($scope.entity);
                expect($scope.entity.eloquaEmailGroup).toBe('');
                expect($scope.entity.bounceBackAddress).toBe(entity1[0].bounceBackAddress);
                expect($scope.entity.eloquaEmailEncoding).toBe(undefined);
                expect($scope.entity.replyToName).toBe(pSettings.defaults.replyToName);
                expect($scope.entity.replyToEmail).toBe(pSettings.defaults.replyToEmail);
                expect($scope.entity.eloquaCampaignFolder).toBe(pSettings.defaults.campaignFolder);
                expect($scope.entity.eloquaFolder).toBe(pSettings.defaults.emailFolder);
                
                expect($scope.entity.fromAddress).toBe(emailConfig.fromAddress);
                expect($scope.entity.senderName).toBe(emailConfig.replyToName);
                expect($scope.entity.eloquaFooter).toBe('');//TODO check if thats correct
                expect($scope.entity.eloquaHeader).toBe(''); //TODO check if thats correct

                // expect($scope.entity.eloquaFooter).toBe(emailGroups[3].emailFooterId);
                // expect($scope.entity.eloquaHeader).toBe(emailGroups[3].emailHeaderId);

                done();
            });
            $timeout.flush();
        });
        
    });
});