'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Emaileditor, app, auth, database, circles) 
{
  // app.use(circles.controller.loadCircles);
  // app.use(circles.controller.userAcl);
  // app.use('/api/emaileditor/*', circles.controller.companyAcl);

  var requiresAdmin               = circles.controller.hasCircle('admin');
  var requiresCompanyAdminOrAdmin = circles.controller.hasOneOfTheseCircles(['Company_Admin', 'admin']);
  var requiresLogin               = circles.controller.hasCircle('authenticated');




  // var emailTemplates      = require('../controllers/emailTemplate')();
  var newsletterEntities  = require('../controllers/newsletterEntity')(circles.controller);
  var emailModules        = require('../controllers/emailModule')(circles.controller);
  var eloqua              = require('../controllers/eloqua')(circles);
  var email               = require('../controllers/email')(circles.controller);
  var helper              = require('../controllers/helper')();
  var feed                = require('../controllers/feed')();

  // app.post('/api/emaileditor/template/create',  circles.controller.hasCompany(), emailTemplates.create);
  // app.post('/api/emaileditor/template/update',  circles.controller.hasCompany(), emailTemplates.update);
  // app.get( '/api/emaileditor/template/get',     circles.controller.hasCompany(), emailTemplates.getEmailTemplateById);
  // app.get( '/api/emaileditor/template/all',     circles.controller.hasCompany(), emailTemplates.getAllEmailTemplates);

  app.post(  '/api/emaileditor/newsletterentity',               requiresLogin, circles.controller.hasCompany(), requiresCompanyAdminOrAdmin, newsletterEntities.create);
  app.post(  '/api/emaileditor/newsletterentity/:entityId',     requiresLogin, circles.controller.hasCompany(), requiresCompanyAdminOrAdmin, newsletterEntities.update);
  app.get(   '/api/emaileditor/newsletterentity/:entityId',     requiresLogin, circles.controller.hasCompany(), requiresCompanyAdminOrAdmin, newsletterEntities.get);
  app.delete('/api/emaileditor/newsletterentity/:entityId',     requiresLogin, circles.controller.hasCompany(), requiresCompanyAdminOrAdmin, newsletterEntities.destroy);
  app.get(   '/api/emaileditor/newsletterentity',               circles.controller.hasCompany(), newsletterEntities.list);  
  app.get(   '/api/emaileditor/newsletterentityfull/:entityId', requiresLogin, circles.controller.hasCompany(), newsletterEntities.getfull);

  app.get('/api/emaileditor/checkadvertisment/:url', requiresLogin, helper.isAdvertismentBooked);  

  app.post(  '/api/emaileditor/emailmodule',            requiresLogin, circles.controller.hasCompany(), requiresCompanyAdminOrAdmin, emailModules.create);
  app.post(  '/api/emaileditor/emailmodule/:moduleId',  requiresLogin, circles.controller.hasCompany(), requiresCompanyAdminOrAdmin, emailModules.update);
  app.get(   '/api/emaileditor/emailmodule/:moduleId',  requiresLogin, circles.controller.hasCompany(), requiresCompanyAdminOrAdmin, emailModules.get);
  app.delete('/api/emaileditor/emailmodule/:moduleId',  requiresLogin, circles.controller.hasCompany(), requiresCompanyAdminOrAdmin, emailModules.destroy);
  app.get(   '/api/emaileditor/emailmodule',            requiresLogin, circles.controller.hasCompany(), requiresCompanyAdminOrAdmin, emailModules.list);  

  app.post(  '/api/emaileditor/email',          requiresLogin, circles.controller.hasCompany(), email.create);
  app.post(  '/api/emaileditor/email/:emailId', requiresLogin, circles.controller.hasCompany(), email.update);
  app.get(   '/api/emaileditor/email/:emailId', requiresLogin, circles.controller.hasCompany(), email.get);
  app.delete('/api/emaileditor/email/:emailId', requiresLogin, circles.controller.hasCompany(), email.destroy);
  app.get(   '/api/emaileditor/email',          circles.controller.hasCompany(), email.list);

  app.get('/api/emaileditor/rss/:url', requiresLogin, feed.loadRSS);
  app.get('/api/emaileditor/xml/:url', requiresLogin, feed.loadXML); 

/*
  app.get('/api/admin/newsletterentity', newsletterEntities.list);
  app.get('/api/admin/newsletterentity/:entityId', newsletterEntities.get);

  app.post('/api/admin/newsletterentity', newsletterEntities.create);
  app.put('/api/admin/newsletterentity/:entityId', newsletterEntities.update);*/
//  app.delete('/api/admin/newsletterentity/:entityId', auth.requiresAdmin, newsletterEntities.destroy);

  app.get('/api/emaileditor/segments/:id',  circles.controller.hasCompany(), eloqua.getSegments);
  app.get('/api/emaileditor/emailencoding', circles.controller.hasCompany(), eloqua.getEmailEncoding);
  app.get('/api/emaileditor/emailconfig',   circles.controller.hasCompany(), eloqua.getEmailConfig);
  app.get('/api/emaileditor/emailgroups/',  circles.controller.hasCompany(), eloqua.getEmailgroups);
  app.get('/api/emaileditor/emailheaders/', circles.controller.hasCompany(), eloqua.getEmailHeaders);
  app.get('/api/emaileditor/emailfooters/', circles.controller.hasCompany(), eloqua.getEmailFooters);
  app.get('/api/emaileditor/refreshtoken',  circles.controller.hasCompany(), eloqua.refreshToken);

  app.post('/api/emaileditor/eloquaemail/',                       circles.controller.hasCompany(), eloqua.createEmail);
  app.post('/api/emaileditor/eloquaemail/:eloquaEmailId',         circles.controller.hasCompany(), eloqua.updateEmail);
  app.post('/api/emaileditor/sendtestemail',                      circles.controller.hasCompany(), eloqua.sendTestEmail);
  app.post('/api/emaileditor/scheduleemail',                      circles.controller.hasCompany(), eloqua.scheduleEmail);
  app.post('/api/emaileditor/scheduleemail/:eloquaCampaignId',    circles.controller.hasCompany(), eloqua.updateEmailSchedule);
  app.post('/api/emaileditor/unscheduleemail/:eloquaCampaignId',  circles.controller.hasCompany(), eloqua.unscheduleEmail); 
  app.post('/api/emaileditor/saveemail',                          circles.controller.hasCompany(), eloqua.saveEmail);
   
  app.get('/api/emaileditor/example/render', function(req, res, next) {
    Emaileditor.render('index', {
      package: 'emaileditor'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};