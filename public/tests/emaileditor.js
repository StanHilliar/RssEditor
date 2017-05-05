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

describe('EmaileditorController', function ()
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
        var $scope, Emaileditor;
        var q;

        // beforeEach(inject(function (_$controller_)
        // {
        //     // The injector unwraps the underscores (_) from around the parameter names when matching
        //     $controller = _$controller_;
        // }));
        
        beforeEach(inject(function(_$controller_, $rootScope, _$q_, _Emaileditor_) 
        {
            $scope      = $rootScope.$new();
            Emaileditor = _Emaileditor_;
            q           = _$q_;

            // $scope.emailTemplates = $scope.entity;

            $controller = _$controller_('EmaileditorController', 
            {
                $scope: $scope,
                Emaileditor: Emaileditor
            });
        }));

        it('test1', function (done)
        {
            expect($scope.rssContent).toEqual('omg');

            var entity = 
            {
                header: '<html><head></head><body>',
                modules: [],
                footer: '</body></html>',
                eloquaEmailEncoding: 3
            };

            spyOn(Emaileditor, 'getEmailTemplate').and.callFake(function() 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb([entity]);
                };
                return mySpy;
            });

            $scope.load(function()
            {
                // $scope.init();
                expect(Emaileditor.getEmailTemplate).toHaveBeenCalled();
                expect($scope.entity).not.toBe(null);
                expect($scope.entity).not.toBe(undefined);
                var email = $scope.generateEmail(false);
                expect(email).toEqual('<html><head></head><body></body></html>');
                done();
            });
        });
    });

    describe('init & load - entity & email', function ()
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
        var Email;
        var $scope;
        var Emaileditor;
        var q;
        var stateParams;

        // beforeEach(inject(function (_$controller_)
        // {
        //     // The injector unwraps the underscores (_) from around the parameter names when matching
        //     $controller = _$controller_;
        // }));

        // beforeEach(function() 
        // {
        //     Email = function()
        //     {
        //         var myEmail = {};
                
        //         myEmail.$save = function(){};
        //         return myEmail;
        //     };
        // });
        
        beforeEach(inject(function(_$controller_, $rootScope, _$q_, _Emaileditor_, _Email_) 
        {
            $scope      = $rootScope.$new();
            Emaileditor = _Emaileditor_;
            Email       = _Email_;
            q           = _$q_;

            stateParams = {};
            stateParams.emailid = '1234';

            $controller = _$controller_('EmaileditorController', 
            {
                $scope: $scope,
                Emaileditor: Emaileditor,
                Email: Email,
                $stateParams: stateParams
            });
        }));

        it('test1', function (done)
        {
            expect($scope.rssContent).toEqual('omg');

            var entity = 
            {
                header: '<html><head></head><body>',
                modules: [],
                footer: '</body></html>',
                eloquaEmailEncoding: 3
            };
            
            // $scope.emailTemplates = $scope.entity;

            spyOn(Emaileditor, 'getEmailTemplate').and.callFake(function() 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb([entity]);
                };
                return mySpy;
            });

            spyOn(Email, 'query').and.callFake(function(a,cb) 
            {
                console.log(a);
                return cb([{name: 'this is a test'}]);
            });
           
            $scope.load(function()
            {
                // $scope.init();
                expect(Emaileditor.getEmailTemplate).toHaveBeenCalled();
                expect(Email.query).toHaveBeenCalled();
                // spyOn($scope.storedEmail, '$save').toHaveBeenCalled();
                expect($scope.entity).not.toBe(null);
                expect($scope.entity).not.toBe(undefined);
                expect($scope.EmailName).toBe('this is a test');
                var email = $scope.generateEmail(false);
                expect(email).toEqual('<html><head></head><body></body></html>');
                done();
            });
        });
    });

    describe('init & load - entity & email - save', function ()
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
        var Email;
        var $scope;
        var Emaileditor;
        var q;
        var stateParams;
        
        beforeEach(inject(function(_$controller_, $rootScope, _$q_, _Emaileditor_, _Email_) 
        {
            $scope      = $rootScope.$new();
            Emaileditor = _Emaileditor_;
            Email       = _Email_;
            q           = _$q_;

            stateParams = {};
            stateParams.emailid = '1234';

            $controller = _$controller_('EmaileditorController', 
            {
                $scope: $scope,
                Emaileditor: Emaileditor,
                Email: Email,
                $stateParams: stateParams
            });
        }));

        it('test1', function (done)
        {
            var entity = 
            {
                header: '<html><head></head><body>',
                modules: [],
                footer: '</body></html>',
                eloquaEmailEncoding: 3
            };
            
            spyOn(Emaileditor, 'getEmailTemplate').and.callFake(function() 
            {
                var  mySpy = {};
                mySpy.query = function(a,cb) 
                {
                    return cb([entity]);
                };
                return mySpy;
            });

            spyOn(Email, 'query').and.callFake(function(a,cb) 
            {
                console.log(a);
                return cb([
                    {
                        name: 'this is a test',
                        hiddenPreviewText: 'my preview text',
                        data: []
                    }]);
            });

            spyOn($scope, 'saveEmail').and.callThrough();

            $scope.load(function()
            {
                // $scope.init();
                expect(Emaileditor.getEmailTemplate).toHaveBeenCalled();
                $scope.saveEmail();
                expect($scope.saveEmail).toHaveBeenCalled();
                expect($scope.storedEmail.subject).toBe(undefined);
                expect($scope.storedEmail.eloquaEmailEncoding).toBe(3);
                expect($scope.storedEmail.hiddenPreviewText).toBe('my preview text');
                expect($scope.errorMsgs).toEqual([]);
 
                expect($scope.entity).not.toBe(null);
                expect($scope.entity).not.toBe(undefined);
                var email = $scope.generateEmail(false);
                expect(email).toEqual('<html><head></head><body></body></html>');
                done();
            });
        });
    });

    describe('generateEmail', function ()
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

        beforeEach(inject(function (_$controller_)
        {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $controller = _$controller_;
        }));

        it('without modules', function ()
        {
            var $scope = {};
            $scope.entity = 
            {
                header: '<html><head></head><body>',
                modules: [],
                footer: '</body></html>'
            };
            $scope.emailTemplates = $scope.entity;

            var controller = $controller('EmaileditorController', { $scope: $scope });

            // $scope.password = 'longerthaneightchars';
            // $scope.grade();
            expect($scope.rssContent).toEqual('omg');
            $scope.init();
            var email = $scope.generateEmail(false);
            expect(email).toEqual('<html><head></head><body></body></html>');

            // expect($scope.clickableElementIdentifier).toEqual('dndelement');
        });

        it('with one manual module', function ()
        {
            var $scope = {};
            $scope.entity = 
            {
                header: '<html><head></head><body>',
                modules: 
                [
                    {
                        defaultNumberOfEntries: 1,
                        type: '3',
                        preBody:'',
                        postBody:'',
                        preModule:'',
                        postModule:'',
                        ads: [],
                        variables: [],
                        bodyVariables: [],
                        views: 
                        [
                            {
                                name: 'defaultView',
                                source: '<div></div>',
                                childTagName: 'div',
                            }
                        ]
                    }
                ],
                footer: '</body></html>'
            };

            $scope.emailTemplates = $scope.entity;
            
            var controller = $controller('EmaileditorController', { $scope: $scope });

            // $scope.password = 'longerthaneightchars';
            // $scope.grade();
            $scope.init();
            var email = $scope.generateEmail(false);
            expect(email).toEqual('<html><head></head><body><div></div></body></html>');
            // expect($scope.clickableElementIdentifier).toEqual('dndelement');
        });

        it('hiddenPreviewText - empty', function ()
        {
            var $scope = {};
            $scope.entity = 
            {
                header: '<html><head></head><body>{{hiddenPreviewText}}',
                modules: 
                [
                    {
                        defaultNumberOfEntries: 1,
                        type: '3',
                        preBody:'',
                        postBody:'',
                        preModule:'',
                        postModule:'',
                        ads: [],
                        variables: [],
                        bodyVariables: [],
                        views: 
                        [
                            {
                                name: 'defaultView',
                                source: '<div></div>',
                                childTagName: 'div',
                            }
                        ]
                    }
                ],
                footer: '</body></html>'
            };
            $scope.hiddenPreviewText = '';

            $scope.emailTemplates = $scope.entity;
            
            var controller = $controller('EmaileditorController', { $scope: $scope });

            // $scope.password = 'longerthaneightchars';
            // $scope.grade();
            $scope.init();
            var email = $scope.generateEmail(false);
            expect(email).toEqual('<html><head></head><body><div></div></body></html>');
            // expect($scope.clickableElementIdentifier).toEqual('dndelement');
        });

        it('hiddenPreviewText - not empty', function ()
        {
            var $scope = {};
            $scope.entity = 
            {
                header: '<html><head></head><body>{{hiddenPreviewText}}',
                modules: 
                [
                    {
                        defaultNumberOfEntries: 1,
                        type: '3',
                        preBody:'',
                        postBody:'',
                        preModule:'',
                        postModule:'',
                        ads: [],
                        variables: [],
                        bodyVariables: [],
                        views: 
                        [
                            {
                                name: 'defaultView',
                                source: '<div></div>',
                                childTagName: 'div',
                            }
                        ]
                    }
                ],
                footer: '</body></html>'
            };      
            
            $scope.hiddenPreviewText = 'hiddenText';

            $scope.emailTemplates = $scope.entity;
            
            var controller = $controller('EmaileditorController', { $scope: $scope });

            // $scope.password = 'longerthaneightchars';
            // $scope.grade();
            $scope.init();
            var email = $scope.generateEmail(false);
            expect(email).toEqual('<html><head></head><body>hiddenText<div></div></body></html>');
            // expect($scope.clickableElementIdentifier).toEqual('dndelement');
        });

        it('hiddenPreviewText - not empty - twice', function ()
        {
            var $scope = {};
            $scope.entity = 
            {
                header: '<html><head></head><body>{{hiddenPreviewText}}',
                modules: 
                [
                    {
                        defaultNumberOfEntries: 1,
                        type: '3',
                        preBody:'',
                        postBody:'',
                        preModule:'',
                        postModule:'',
                        ads: [],
                        variables: [],
                        bodyVariables: [],
                        views: 
                        [
                            {
                                name: 'defaultView',
                                source: '<div>{{hiddenPreviewText}}</div>',
                                childTagName: 'div',
                            }
                        ]
                    }
                ],
                footer: '</body></html>'
            };      

            $scope.hiddenPreviewText = 'hiddenText';

            $scope.emailTemplates = $scope.entity;
            
            var controller = $controller('EmaileditorController', { $scope: $scope });

            // $scope.password = 'longerthaneightchars';
            // $scope.grade();
            $scope.init();
            var email = $scope.generateEmail(false);
            expect(email).toEqual('<html><head></head><body>hiddenText<div>hiddenText</div></body></html>');
            // expect($scope.clickableElementIdentifier).toEqual('dndelement');
        });

        it('timestamp - 1', function ()
        {
            var $scope = {};
            $scope.entity = 
            {
                header: '<html><head></head><body>#1{{timestamp}}#2',
                modules: 
                [
                    {
                        defaultNumberOfEntries: 1,
                        type: '3',
                        preBody:'',
                        postBody:'',
                        preModule:'',
                        postModule:'',
                        ads: [],
                        variables: [],
                        bodyVariables: [],
                        views: 
                        [
                            {
                                name: 'defaultView',
                                source: '<div></div>',
                                childTagName: 'div',
                            }
                        ]
                    }
                ],
                footer: '</body></html>'
            };      
            
            $scope.emailTemplates = $scope.entity;
            
            var controller = $controller('EmaileditorController', { $scope: $scope });

            $scope.init();
            var email = $scope.generateEmail(false);
            var marker1 = email.indexOf('#1');
            var marker2 = email.indexOf('#2');
            // console.log(marker1);
            // console.log(marker2);
            expect(marker1).not.toEqual(-1);
            expect(marker2).not.toEqual(-1);
            var emailPart1 = email.substring(0, marker1);
            var timestamp = email.substring(marker1+2, marker2);
            var emailPart2 = email.substring(marker2+2, email.length);

            expect(emailPart1).toEqual('<html><head></head><body>');
            expect(timestamp).not.toEqual('');
            expect(timestamp).not.toEqual('{{timestamp}}');
            expect(timestamp.length).toEqual(13);
            expect(emailPart2).toEqual('<div></div></body></html>');
        });

        it('timestamp in adImage', function ()
        {
            var $scope = {};
            $scope.entity = 
            {
                "_id":"5909707da8593cf00b5c96e4",
                "createdAt":"2017-05-03T05:54:05.024Z",
                "updatedAt":"2017-05-03T06:05:28.931Z",
                "updatedBy":"Simon.Eckhardt",
                "createdBy":"Simon.Eckhardt",
                "name":"timestamp test",
                "type":"BBMObject1",
                "header":"<html><head></head><body>",
                "footer":"</body></html>",
                "eloquaFolder":"483",
                "eloquaCampaignFolder":"482",
                "eloquaFooter":"1",
                "eloquaHeader":"1",
                "bounceBackAddress":"TechnologyPartnerLeadMgtTechSolutionsAB@s1926145509.m.en25.com",
                "replyToName":"Leadteq",
                "replyToEmail":"support@leadteq.com",
                "eloquaEmailGroup":"4",
                "eloquaEmailEncoding":"15",
                "fromAddress":"test@leadteq.com",
                "senderName":"test",
                "company":"588788e44cb14e490e56997b"
                ,"__v":2,
                "modules":
                [
                    {
                        "templatePosEnd":136,
                        "templatePos":124,
                        "moduleIdentifier":"1",
                        "_id":"59097048a8593cf00b5c96e3",
                        "createdAt":"2017-05-03T05:53:12.976Z",
                        "updatedAt":"2017-05-03T07:01:45.046Z",
                        "name":"timestamp test",
                        "defaultURL":"",
                        "defaultNumberOfEntries":"5",
                        "type":"3","header":"",
                        "footer":"",
                        "createdBy":"Simon.Eckhardt",
                        "updatedBy":"Simon.Eckhardt",
                        "company":"588788e44cb14e490e56997b",
                        "__v":4,
                        "childTagName":"div",
                        "postBody":"</div>",
                        "preBody":"<div>",
                        "xmlVariables":[],
                        "bodyVariables":[],
                        "variables":[],
                        "views":[{"_id":"BJZUlxv1-",
                        "name":"default",
                        "source":"<div>fsd</div>",
                        "variables":[],
                        "isDefault":false,
                        "childTagName":"div"}],
                        "adViews":[{"source":"<div>#1[[adImage]]#2</div>",
                        "name":"",
                        "_id":""}],
                        "ads":
                        [
                            {
                                "link":"http://www.leadteq.com",
                                "img":"http://www.leadteq.com/wp-content/uploads/2014/02/leadteq_logo.png?t={{timestamp}}",
                                "pos":"2",
                                "_id":"",
                                "booked": true
                            }
                        ]
                    }
                ],
                "circles":["leadteq"],
                "segments":[{"id":"3",
                "name":"test segment - simon only"}]};      
            
            $scope.emailTemplates = $scope.entity;
            
            var controller = $controller('EmaileditorController', { $scope: $scope });

            $scope.init();
            var email = $scope.generateEmail(false);
            // console.log(email);
            var marker1 = email.indexOf('#1');
            var marker2 = email.indexOf('#2');
            // console.log(marker1);
            // console.log(marker2);
            expect(marker1).not.toEqual(-1);
            expect(marker2).not.toEqual(-1);
            var emailPart1 = email.substring(0, marker1);
            var adImage = email.substring(marker1+2, marker2);
            var timestamp = adImage.substring("http://www.leadteq.com/wp-content/uploads/2014/02/leadteq_logo.png?t=".length, adImage.length);
            var emailPart2 = email.substring(marker2+2, email.length);
            // console.log(timestamp);

            // expect(emailPart1).toEqual('<html><head></head><body>');
            expect(timestamp).not.toEqual('');
            expect(timestamp).not.toEqual('{{timestamp}}');
            expect(timestamp.length).toEqual(13);
            // expect(emailPart2).toEqual('<div></div></body></html>');
        });
    });

});