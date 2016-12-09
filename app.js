'use strict';

/*
 * Defining the Package
 */
var meanio = require('meanio');
var Module = meanio.Module;

var Emaileditor = new Module('emaileditor');

var config = require('meanio').loadConfig();

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Emaileditor.register(function(app, auth, database, circles) 
{
  var amazingEloqua = require('amazing-eloqua')();

  //var eloqua = amazingEloqua.login('TechnologyPartnerLeadMgtTechSolutionsAB', 'Simon.Diel', '5urcluVIFb8pYkg0', 'https://www02.secure.eloqua.com');
  var eloqua = amazingEloqua.login(config.eloqua.company, config.eloqua.username, config.eloqua.password, config.eloqua.host);
  //var eloqua = amazingEloqua.login('BonnierBusinessMediaTest', 'Eloqua.Api', 'cX7mquRGww6qW8pBQ1qw1hzJ', 'https://secure.p06.eloqua.com');
  
  //We enable routing. By default the Package Object is passed to the routes
  Emaileditor.routes(app, auth, database, eloqua, circles);

  //We are adding a link to the main menu for all authenticated users
  /*
  Emaileditor.menus.add({
    title: 'create new Email',
    link: 'emaileditor example page',
    roles: ['RSSEditor', 'RSSAdmin','authenticated'],
    menu: 'main'
  });*/
  

   Emaileditor.menus.add({
    title: 'Newsletter',
    link: 'email_overview',
    roles: ['authenticated'],
    menu: 'main'
   });  

   Emaileditor.menus.add({
    title: 'Entities',
    link: 'newsletter overview',
    roles: ['authenticated'],
    weight: ['Company_Admin'],
    menu: 'main'
   });   

   Emaileditor.menus.add({
    title: 'Modules',
    link: 'emailmodule_overview',
    roles: ['authenticated'],
    weight: ['Company_Admin'],
    menu: 'main'
  });

  /*
   Emaileditor.menus.add({
    title: 'Templates',
    link: 'template_overview',
    roles: ['RSSAdmin'],
    menu: 'main'
  });*/

  //  <link rel="stylesheet" href="bower_components/ngWYSIWYG/css/editor.css" />
  //<script src="bower_components/ngWYSIWYG/js/wysiwyg.js"></script>


  Emaileditor.aggregateAsset('css', '../lib/ngWYSIWYG/css/editor.css', { weight: 1 });
  Emaileditor.aggregateAsset('js', '../lib/ngWYSIWYG/js/wysiwyg.js', { weight: 2 });

  Emaileditor.aggregateAsset('js', '../lib/angular-ui-ace/ui-ace.js', { weight: 2 });

  Emaileditor.aggregateAsset('css', 'emaileditor.css');
  
  Emaileditor.angularDependencies(['ngWYSIWYG','ui.ace']);



  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Emaileditor.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Emaileditor.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Emaileditor.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Emaileditor;
});
