'use strict';

angular.module('mean.emaileditor').config(['$stateProvider',
  function($stateProvider) 
  {
    $stateProvider.state('emaileditor example page', 
    {
      url: '/:company/emaileditor/example',
      templateUrl: 'emaileditor/views/index.html'
    });    

    $stateProvider.state('email_create', 
    {
      url: '/:company/emaileditor/email/create/:newsletterid',
      templateUrl: 'emaileditor/views/index.html'
    });

    $stateProvider.state('email_edit', 
    {
      url: '/:company/emaileditor/email/edit/:newsletterid/:emailid',
      templateUrl: 'emaileditor/views/index.html'
    });

    $stateProvider.state('newsletter overview', 
    {
      url: '/:company/emaileditor/newsletter',
      templateUrl: 'emaileditor/views/newsletterOverview.html'
    });   

    $stateProvider.state('email_overview', 
    {
      url: '/:company/emaileditor/emails',
      templateUrl: 'emaileditor/views/emailOverview.html',
      // requiredCircles: {
      //   circles: ['authenticated']
      // }
    });

    $stateProvider.state('template_overview', 
    {
      url: '/:company/emaileditor/templates',
      templateUrl: 'emaileditor/views/templateOverview.html'
    });
    
    $stateProvider.state('template_edit', 
    {
      url: '/:company/emaileditor/templates/edit',
      templateUrl: 'emaileditor/views/editTemplate.html'
    });

    $stateProvider.state('newsletter create', 
    {
      url: '/:company/emaileditor/newsletter/edit',
      templateUrl: 'emaileditor/views/newsletter.html'
    });  

    $stateProvider.state('newsletter edit', 
    {
      url: '/:company/emaileditor/newsletter/edit/:newsletterid',
      templateUrl: 'emaileditor/views/newsletter.html'
    });

    $stateProvider.state('emailmodule_overview', 
    {
      url: '/:company/emaileditor/module',
      templateUrl: 'emaileditor/views/emailmoduleOverview.html'
    });

    $stateProvider.state('emailmodule_create', 
    {
      url: '/:company/emaileditor/module/edit',
      templateUrl: 'emaileditor/views/emailmodule.html'
    });  

    $stateProvider.state('emailmodule_edit', 
    {
      url: '/:company/emaileditor/module/edit/:newsletterid',
      templateUrl: 'emaileditor/views/emailmodule.html'
    });
  }
]);
