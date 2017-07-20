'use strict';



/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Emaileditor, app, auth, database, amazingEloqua, circles) 
{

  // app.use(circles.controller.loadCircles);
  // app.use(circles.controller.userAcl);
  // app.use('/api/emaileditor/*', circles.controller.companyAcl);

  var requiresAdmin = circles.controller.hasCircle('admin');
  var requiresCompanyAdminOrAdmin = circles.controller.hasOneOfTheseCircles(['Company_Admin', 'admin']);
  var requiresLogin = circles.controller.hasCircle('authenticated');

  var emailTemplates      = require('../controllers/emailTemplate')();
  var newsletterEntities  = require('../controllers/newsletterEntity')(circles.controller);
  var emailModules        = require('../controllers/emailModule')(circles.controller);
  var eloqua              = require('../controllers/eloqua')(amazingEloqua);
  var email               = require('../controllers/email')(circles.controller);
  var helper              = require('../controllers/helper')();
  var feed                = require('../controllers/feed')();

  app.get('/api/emaileditor/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  }); 

  app.route('/api/emaileditor/template/create').post(emailTemplates.create);
  app.route('/api/emaileditor/template/update').post(emailTemplates.update);
  app.route('/api/emaileditor/template/get').get(emailTemplates.getEmailTemplateById);
  app.route('/api/emaileditor/template/all').get(emailTemplates.getAllEmailTemplates);

  app.route('/api/emaileditor/newsletterentity').post(newsletterEntities.create);
  app.route('/api/emaileditor/newsletterentity/:entityId').post(newsletterEntities.update);
  app.route('/api/emaileditor/newsletterentity/:entityId').get(newsletterEntities.get);
  app.route('/api/emaileditor/newsletterentity/:entityId').delete(newsletterEntities.destroy);
  app.route('/api/emaileditor/newsletterentityfull/:entityId').get(newsletterEntities.getfull);
            //api/emaileditor/newsletterentity/567ebc412f8676f948c8fb65
  app.get('/api/emaileditor/newsletterentity', circles.controller.hasCompany(), newsletterEntities.list);  

  app.route('/api/emaileditor/checkadvertisment/:url').get(helper.isAdvertismentBooked);  


  app.route('/api/emaileditor/emailmodule').post(emailModules.create);
  app.route('/api/emaileditor/emailmodule/:moduleId').post(emailModules.update);
  app.route('/api/emaileditor/emailmodule/:moduleId').get(emailModules.get);
  app.route('/api/emaileditor/emailmodule/:moduleId').delete(emailModules.destroy);
            //api/emaileditor/emailmodule/567ebc412f8676f948c8fb65
  app.route('/api/emaileditor/emailmodule').get(emailModules.list);  

  app.route('/api/emaileditor/email').post(email.create);
  app.route('/api/emaileditor/email/:emailId').post(email.update);
  app.route('/api/emaileditor/email/:emailId').get(email.get);
  app.route('/api/emaileditor/email/:emailId').delete(email.destroy);
            //api/emaileditor/email/567ebc412f8676f948c8fb65
  app.route('/api/emaileditor/email').get(email.list);

  app.route('/api/emaileditor/emailencoding').get(eloqua.getEmailEncoding);
  
  app.route('/api/emaileditor/emailconfig').get(eloqua.getEmailConfig);

  app.route('/api/emaileditor/rss/:url').get(feed.loadRSS);
  app.route('/api/emaileditor/xml/:url').get(feed.loadXML); 

/*
  app.get('/api/admin/newsletterentity', newsletterEntities.list);
  app.get('/api/admin/newsletterentity/:entityId', newsletterEntities.get);

  app.post('/api/admin/newsletterentity', newsletterEntities.create);
  app.put('/api/admin/newsletterentity/:entityId', newsletterEntities.update);*/
//  app.delete('/api/admin/newsletterentity/:entityId', auth.requiresAdmin, newsletterEntities.destroy);

  app.get('/api/emaileditor/templates', function(req, res, next) 
  {  

  });

  app.route('/api/emaileditor/segments/:id').get(eloqua.getSegments);
  app.route('/api/emaileditor/emailgroups/').get(eloqua.getEmailgroups);
  app.route('/api/emaileditor/emailheaders/').get(eloqua.getEmailHeaders);
  app.route('/api/emaileditor/emailfooters/').get(eloqua.getEmailFooters);

  app.route('/api/emaileditor/eloquaemail/').post(eloqua.createEmail);
  app.route('/api/emaileditor/eloquaemail/:eloquaEmailId').post(eloqua.updateEmail);
  app.route('/api/emaileditor/sendtestemail').post(eloqua.sendTestEmail);
  app.route('/api/emaileditor/scheduleemail').post(eloqua.scheduleEmail);
  app.route('/api/emaileditor/scheduleemail/:eloquaCampaignId').post(eloqua.updateEmailSchedule);
  app.route('/api/emaileditor/unscheduleemail/:eloquaCampaignId').post(eloqua.unscheduleEmail); 
  app.route('/api/emaileditor/saveemail').post(eloqua.saveEmail);
   

  app.get('/api/emaileditor/example/auth', requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/api/emaileditor/example/admin', requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/api/emaileditor/example/render', function(req, res, next) {
    Emaileditor.render('index', {
      package: 'emaileditor'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
