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

    describe('init', function ()
    {
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

            spyOn(Emaileditor, "getEmailTemplate").and.callFake(function() 
            {
                return 1001;
            });

            // $scope.password = 'longerthaneightchars';
            // $scope.grade();
            expect($scope.rssContent).toEqual('omg');
            $scope.initAfterLoad();
            var email = $scope.generateEmail(false);
            expect(email).toEqual('<html><head></head><body></body></html>');

            // expect($scope.clickableElementIdentifier).toEqual('dndelement');
        });
    });

    describe('generateEmail', function ()
    {
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
            $scope.initAfterLoad();
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
    });


});