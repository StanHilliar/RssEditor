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
            // module('mean.swagger');
            module('mean.users');
            module('mean.meanStarter');
            module('mean.companies');
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
        
        // beforeEach(inject(function(_$controller_, $rootScope, _$q_) 
        // {
        //     $scope      = $rootScope.$new();
        //     q           = _$q_;

        //     // $scope.emailTemplates = $scope.entity;

        //     $controller = _$controller_('EmailModuleEditController', 
        //     {
        //         $scope: $scope
        //     });
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
            // module('mean.swagger');
            module('mean.users');
            module('mean.meanStarter');
            module('mean.companies');
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
                console.log('spyOn(Email, query)');
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
        var originalTimeout;

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
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });

        afterEach(function() 
        {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        var $controller;
        var Email;
        var $scope;
        var Emaileditor;
        var q;
        var stateParams;
        var $httpBackend;
        
        beforeEach(inject(function(_$controller_, $rootScope,  _$httpBackend_, _$q_, _Emaileditor_, _Email_) 
        {
            $scope      = $rootScope.$new();
            Emaileditor = _Emaileditor_;
            Email       = _Email_;
            $httpBackend= _$httpBackend_;
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
            $scope.segment = '3';
            $scope.EmailSubject = '123';
            $scope.hiddenPreviewText = 'my preview text';

            var entity = 
            {
                header: '<html><head></head><body>',
                modules: [],
                footer: '</body></html>',
                eloquaFolder: '3',
                eloquaCampaignFolder: '3',
                eloquaEmailEncoding: 3,
                eloquaHeader: '1', 
                eloquaFooter: '1', 
                eloquaEmailGroup: '1', 
                bunceBackAddress: 'test@test.de',
                replyToName: 'test',
                replyToEmail: 'test@test.de', 
                fromAddress: 'test@test.de', 
                senderName: 'test'
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

            $httpBackend.when('GET', 'system/views/index.html').respond('<section data-ng-controller="IndexController"></section>');
            $httpBackend.when('GET', '/api/get-public-config').respond({});
            $httpBackend.when('GET', '/api/users/me').respond({});

            $scope.load(function()
            {
                // $scope.init();
                expect(Emaileditor.getEmailTemplate).toHaveBeenCalled();
                $scope.saveEmail();
                expect($scope.saveEmail).toHaveBeenCalled();
                expect($scope.storedEmail.subject).toBe('123');
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
            // module('mean.swagger');
            module('mean.users');
            module('mean.meanStarter');
            module('mean.companies');
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
            $scope.init(function()
            {
                var email = $scope.generateEmail(false);
                expect(email).toEqual('<html><head></head><body></body></html>');
            });

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
            $scope.init(function()
            {
                var email = $scope.generateEmail(false);
                expect(email).toEqual('<html><head></head><body><div></div></body></html>');
            });
            // expect($scope.clickableElementIdentifier).toEqual('dndelement');
        });

        it('with dropzone', function ()
        {
            var $scope = {};
            $scope.entity = 
            {
                header: '<html><head></head><body>',
                modules: [{
                    "moduleIdentifier" : "Dropzone",
                    "templatePos" : 2169,
                    "templatePosEnd" : 2183,
                    "_id" : "59cdf663a363ec118478f89d",
                    "placeholderType" : "DROPZONE",
                    "removeable" : true
                }],
                footer: '</body></html>'
            };
            $scope.emailTemplates = $scope.entity;

            var controller = $controller('EmaileditorController', { $scope: $scope });

            // $scope.password = 'longerthaneightchars';
            // $scope.grade();
            expect($scope.rssContent).toEqual('omg');
            $scope.init(function()
            {
                var email = $scope.generateEmail(false);
                expect(email).toEqual('<html><head></head><body></body></html>');
            });

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
            $scope.feedPositions = [];
            $scope.feedPositions[0] = [0];
            
            var controller = $controller('EmaileditorController', { $scope: $scope });

            // $scope.password = 'longerthaneightchars';
            // $scope.grade();
            $scope.init(function()
            {
                var email = $scope.generateEmail(false);
                expect(email).toEqual('<html><head></head><body><div></div></body></html>');
            });
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
            $scope.init(function()
            {
                var email = $scope.generateEmail(false);
                expect(email).toEqual('<html><head></head><body>hiddenText<div></div></body></html>');
            });
         
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
            $scope.init(function()
            {
                var email = $scope.generateEmail(false);
                expect(email).toEqual('<html><head></head><body>hiddenText<div>hiddenText</div></body></html>');
            });
            // expect($scope.clickableElementIdentifier).toEqual('dndelement');
        });
    });

    xdescribe('EloquaEmail saveEmail', function ()
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
        var EloquaService;

        beforeEach(inject(function (_$controller_, _EloquaService_)
        {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $controller = _$controller_;
            EloquaService = _EloquaService_;
        }));


        xit('with one manual module - save', function (done)
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

            spyOn(EloquaService.eloquaEmail().prototype, '$save').and.callFake(function(a, cb) 
            {
                console.log('$save -----------!!!!!!!!!!!-----------');
                // var  mySpy = {};
                // mySpy.prototype.$save = function(a,cb, errCB) 
                // {
                    return cb({issue:true});
                // };
                // return mySpy;
            });

            $scope.emailTemplates = $scope.entity;
            
            var controller = $controller('EmaileditorController', { $scope: $scope });

            // $scope.password = 'longerthaneightchars';
            // $scope.grade();
            $scope.init(function()
            {
                // var email = $scope.generateEmail(false);
                // expect(email).toEqual('<html><head></head><body><div></div></body></html>');
                $scope.saveEmail(function(res)
                {
                    expect(res).toEqual(undefined);
                    expect($scope.storedEmail.eloquaEmail).toEqual('4');
                    expect($scope.errorMsgs).toEqual([]);
                    expect(true).toEqual(false);
                    done();
                });
            });
            // expect($scope.clickableElementIdentifier).toEqual('dndelement');
        });
    });
});