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

});