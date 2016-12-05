'use strict';

angular.module('mean.emaileditor').config(['$stateProvider',
  function($stateProvider) 
  {
    $stateProvider.state('emaileditor example page', 
    {
      url: '/emaileditor/example',
      templateUrl: 'emaileditor/views/index.html'
    });    

    $stateProvider.state('email_create', 
    {
      url: '/emaileditor/email/create/:newsletterid',
      templateUrl: 'emaileditor/views/index.html'
    });

    $stateProvider.state('email_edit', 
    {
      url: '/emaileditor/email/edit/:newsletterid/:emailid',
      templateUrl: 'emaileditor/views/index.html'
    });

    $stateProvider.state('newsletter overview', 
    {
      url: '/emaileditor/newsletter',
      templateUrl: 'emaileditor/views/newsletterOverview.html'
    });   

    $stateProvider.state('email_overview', 
    {
      url: '/emaileditor/emails',
      templateUrl: 'emaileditor/views/emailOverview.html'
    });

    $stateProvider.state('template_overview', 
    {
      url: '/emaileditor/templates',
      templateUrl: 'emaileditor/views/templateOverview.html'
    });
    
    $stateProvider.state('template_edit', 
    {
      url: '/emaileditor/templates/edit',
      templateUrl: 'emaileditor/views/editTemplate.html'
    });

    $stateProvider.state('newsletter create', 
    {
      url: '/emaileditor/newsletter/edit',
      templateUrl: 'emaileditor/views/newsletter.html'
    });  

    $stateProvider.state('newsletter edit', 
    {
      url: '/emaileditor/newsletter/edit/:newsletterid',
      templateUrl: 'emaileditor/views/newsletter.html'
    });


     $stateProvider.state('emailmodule_overview', 
    {
      url: '/emaileditor/module',
      templateUrl: 'emaileditor/views/emailmoduleOverview.html'
    });


    $stateProvider.state('emailmodule_create', 
    {
      url: '/emaileditor/module/edit',
      templateUrl: 'emaileditor/views/emailmodule.html'
    });  

    $stateProvider.state('emailmodule_edit', 
    {
      url: '/emaileditor/module/edit/:newsletterid',
      templateUrl: 'emaileditor/views/emailmodule.html'
    });
  }
]);
