'use strict';

var  async = require('async');
/**
 * Module dependencies.
 */
var email         = require('../controllers/email')();
var mongoose 		  = require('mongoose');
var Q           	= require('q');
var amazingEloqua = require('amazing-eloqua')();
var EloquaMngr		= require('../../../companies/server/controllers/eloquaManager');
var eloquaMngr    = new EloquaMngr();
var Company 		  = mongoose.model('Company');

// function getCompanyById(companyId)
// {
// 	var deferred = Q.defer();

// 	Company.findOne({_id: companyId}, function (err, data) 
// 	{
// 		// console.log('findOne');
// 		// console.log(err);
// 		// console.log(data);
// 		if (!err && data) 
// 		{
// 			deferred.resolve(data)   
// 		}
// 		else
// 		{
//       console.error(err);
// 			deferred.reject(err);
// 		} 
// 	});

// 	return deferred.promise;
// }

function getAmazingEloqua(companyId)
{
  var deferred = Q.defer();
  console.log('getAmazingEloqua('+companyId+')');

	eloquaMngr.getCompanyById(companyId).then(function(company)
  {
    console.log('getCompanyById cb');
    console.log(company);

    if(company && company.eloquaAccounts && (company.eloquaAccounts.length > 0))
    {
			console.log(' ---------------------company not null--------------------');
      var elqAccount = {};
      elqAccount.company      = company.eloquaAccounts[0].company;
      elqAccount.accessToken  = company.eloquaAccounts[0].accessToken ? true : false;
      elqAccount.refreshToken = company.eloquaAccounts[0].refreshToken ? true : false;
      var eloqua = eloquaMngr.loginWithToken(company.eloquaAccounts[0].accessToken, company.eloquaAccounts[0].baseUrl);
      deferred.resolve(eloqua)   
    }
    else
    { 
      deferred.reject();
    }
  }).fail(function (error) 
  {
    deferred.reject(error);
  });   

  return deferred.promise;
}
					

module.exports = function(circles) {
  
  function activateCampaignAndUpdateEmail(amazingEloqua, response, campaignId,  req, res, next)
  {
    console.log('activateCampaignAndUpdateEmail');

    var activationOptions = {};
    if(req.body.sendRightNow)
    {
      activationOptions = { activateNow: true};
    }
    else
    {
      activationOptions = { scheduledFor: req.body.startAt};
    }
    
    console.log(activationOptions);

    amazingEloqua.campaign.acitivate(campaignId, activationOptions, function(activationErr, activationRes)
    {
      console.log('acitivateCampaign callback');
      console.error(activationErr);
      console.log(activationRes);

      email.getEmailById(req.body.emailId, function(err, email)
      {
        console.log('getEmailById callback');
        console.log(err);
        console.log(email);

        email.eloquaCampaign = campaignId;
        email.status = 'active';
        email.save(function(saveErr, saveRes)
        {
          console.log('save callback');
          console.log(saveErr);
          console.log(saveRes);

          res.jsonp(response);
        });
      });
    });
  }
  
    return {
        /**
         * Create user
         */
        getSegments: function(req, res, next) 
        {
          console.log('++++++++++1++++++++++++++');
          getAmazingEloqua(req.query.company).then(function(amazingEloqua)
          {
            console.log('+++++++++2++++++++++');
            console.log('segments ('+req.params.id+')');
            amazingEloqua.getSegmentsByFolderId(req.params.id, '1', '300', 'minimal', function(err, response)
            {
              console.log('getSegmentsByFolderId callback');
              console.log(err);
              console.log(response);
              if(err != null)
              {
                res.status(400).json(err);
              }
              else
              {
                if(response != null)
                {
                  res.jsonp(response.elements);
                }
                else
                {
                   res.status(400).json('response is null');
                }
              }
            }); 
          }).fail(function(error) 
          {
            console.error(error);
            res.status(400).json('response is null');
          }); 
        },
        getEmailgroups: function(req, res, next) 
        { 
          // console.dir('emailgroups');
          getAmazingEloqua(req.query.company).then(function(amazingEloqua)
          {
            amazingEloqua.searchEmailGroups('*', '1', '300', 'complete', function(err, response)
            {
              // console.log('searchEmailGroups callback');
              // console.log(err);
              // console.log(response);

              if(err != null)
              {
                res.status(400).json(err);
              }
              else
              {
                if(response != null)
                {
                  res.jsonp(response.elements);
                }
                else
                {
                   res.status(400).json('response is null');
                }
              }
            });   
          });   
        },
        getEmailEncoding: function(req, res, next) 
        { 
          console.dir('getEmailEncoding');
          getAmazingEloqua(req.query.company).then(function(amazingEloqua)
          {
            amazingEloqua.getEmailEncoding('minimal', function(err, response)
            {
              console.log('getEmailEncoding callback');
              console.log(err);
              console.log(response);

              if(err != null)
              {
                res.status(400).json(err);
              }
              else
              {
                if(response != null)
                {
                  res.jsonp(response);
                }
                else
                {
                   res.status(400).json('response is null');
                }
              }
            });   
          });   
        },
        getEmailHeaders: function(req, res, next) 
        { 
          console.dir('getEmailHeaders');
          getAmazingEloqua(req.query.company).then(function(amazingEloqua)
          {
            amazingEloqua.searchEmailHeaders('*', '1', '300', 'complete', function(err, response)
            {
              console.log('searchEmailHeaders callback');
              console.log(err);
              console.log(response);

              if(err != null)
              {
                res.status(400).json(err);
              }
              else
              {
                if(response != null)
                {
                  res.jsonp(response.elements);
                }
                else
                {
                   res.status(400).json('response is null');
                }
              }
            });   
          });   
        },
        getEmailFooters: function(req, res, next) 
        { 
          console.dir('getEmailFooters');
          getAmazingEloqua(req.query.company).then(function(amazingEloqua)
          {
            amazingEloqua.searchEmailFooters('*', '1', '300', 'complete', function(err, response)
            {
              console.log('searchEmailFooters callback');
              console.log(err);
              console.log(response);

              if(err != null)
              {
                res.status(400).json(err);
              }
              else
              {
                if(response != null)
                {
                  res.jsonp(response.elements);
                }
                else
                {
                   res.status(400).json('response is null');
                }
              }
            });   
          });   
        },
        getEmailConfig: function(req, res, next) 
        { 
          console.dir('getEmailConfig');
          getAmazingEloqua(req.query.company).then(function(amazingEloqua)
          {
             amazingEloqua.getEmailConfig('complete', function(err, response)
             {
               console.log('getEmailConfig callback');
               console.log(response);
 
               if(err != null)
               {
                 console.error(err);
                 return res.status(400).json(err);
               }
               else
               {
                 if(response != null)
                 {
                   return res.jsonp(response);
                 }
                 else
                 {
                   return res.status(400).json('response is null');
                 }
               }
             });   
          });   
         },
        createEmail: function(req, res, next) 
        {
          console.log('create');
          getAmazingEloqua(req.query.company).then(function(amazingEloqua)
          {
            amazingEloqua.createHTMLEmail(req.body.name, req.body.eloquaFolder, req.body.eloquaFooter, req.body.eloquaHeader, req.body.eloquaEmailGroup, req.body.eloquaEmailEncoding, req.body.subject, req.body.html, req.body.fromAddress, req.body.senderName, req.body.bounceBackAddress, req.body.replyToName, req.body.replyToEmail,  function(err, response)
            {
              console.log('create eloquaEmail callback');
              if(err)
              {
                console.error(err);
                res.status(400).json(err);
              }
              else
              {
                console.log(response);

                email.getEmailById(req.body.emailId, function(getEmailByIdErr, email)
                {
                  console.log('getEmailById callback');
                  //console.log(email);
                  if(getEmailByIdErr != null)
                  {
                    console.log(getEmailByIdErr);
                    res.status(400).json(getEmailByIdErr);
                  }
                  else
                  {
                    email.eloquaEmail = response.id;
                    email.save(function(saveErr, saveRes)
                    {
                      console.log('save callback');
                      //console.log(saveErr);
                      //console.log(saveRes);
                      if(saveErr != null)
                      {
                        res.status(400).json(saveErr);
                      }
                      else
                      {
                        res.jsonp(response);
                      }
                    });
                  }
                });
              }
            });
          });
        },
        updateEmail: function(req, res, next) 
        {
          console.dir('update eloquaEmail');
          //console.log(req.body.replyToName);
          //console.log(req.body.replyToEmail);
          getAmazingEloqua(req.query.company).then(function(amazingEloqua)
          {
            amazingEloqua.updateHTMLEmail(req.params.eloquaEmailId, req.body.name, req.body.eloquaFolder, req.body.eloquaFooter, req.body.eloquaHeader, req.body.eloquaEmailGroup, req.body.eloquaEmailEncoding, req.body.subject, req.body.html, req.body.fromAddress, req.body.senderName, req.body.bounceBackAddress, req.body.replyToName, req.body.replyToEmail, function(err, response)
            {
              console.log('updateHTMLEmail callback');
              console.log(err);
              //console.log(response);
              if(err != null)
              {
                res.status(400).json(err);
              }
              else
              {
                email.getEmailById(req.body.emailId, function(getEmailByIdErr, email)
                {
                  console.log('getEmailById callback');
                  //console.log(email);
                  if(getEmailByIdErr != null)
                  {
                    console.log(getEmailByIdErr);
                    res.status(400).json(getEmailByIdErr);
                  }
                  else
                  {
                    email.eloquaEmail = response.id;
                    email.save(function(saveErr, saveRes)
                    {
                      console.log('save callback');
                    
                      if(saveErr != null)
                      {
                        console.log(saveErr);
                        res.status(400).json(saveErr);
                      }
                      else
                      {
                        res.jsonp(response);
                      }
                    });
                  }
                });
              }
            }); 
          }); 
        },
        sendTestEmail: function(req, res, next)
        {
          console.dir('update sendtestemail');
          console.log(req.body.eloquaEmailId);
          console.log(req.body.emailAddresses);

          req.assert('emailAddresses', 'You must enter a email address').notEmpty();

          var errors = req.validationErrors();
          if (errors) 
          {
              return res.status(400).send(errors);
          }

          var addresses = req.body.emailAddresses.split(',');
          
          // console.log(addresses);
          getAmazingEloqua(req.query.company).then(function(amazingEloqua)
          {

           async.map(addresses, 
            function(emailAddress, cb)
            {
              if(emailAddress != '')
              {
                amazingEloqua.searchContacts(emailAddress.trim(), 1, 1, 'minimal', function(contactErr, contactRes)
                {
                  console.log(contactErr);
                  //console.log(contactRes);
                  if(contactErr == null && contactRes.total == 1)
                  {
                    if(emailAddress.trim() == contactRes.elements[0].emailAddress && emailAddress != '')
                    {
                      amazingEloqua.sendTestEmail(contactRes.elements[0].id, req.body.eloquaEmailId, 'TestEmail', function(emailErr, emailRes)
                      {
                        console.log(emailErr);
                        //console.log(emailRes);
                        return cb(null, emailRes);
                      });
                    }
                    else
                    {
                      return cb({
                        param: emailAddress,
                        msg: 'search emailAddress error 2',
                        value: emailAddress
                      });
                    }
                  }
                  else
                  {
                    if(contactErr.code && contactErr.code == 401)
                    {
                      return cb({
                        param: 401,
                        code: 401,
                        msg: 'unauthorized'
                      });
                    }
                    else
                    {

                      return cb({
                        param: emailAddress,
                        msg: 'search emailAddress error',
                        value: emailAddress
                      });
                    }
                  }
                });
              }
              else
              {
                return cb({
                  param: 'emailAddress',
                  msg: 'email address is empty',
                  value: ''
                });
              }
            }, 
            function(mapErr, mapRes)
            {
              console.log('map Callback');
              console.log(mapErr);
              //console.log(mapRes);

              if(mapErr != null)
              {
                res.status(400).json([mapErr]);
              }
              else
              {
                res.jsonp({success: true});
              }
           });
          });         
        },
        scheduleEmail: function(req, res, next)
        {
          console.log('create SimpleCampaign');
          getAmazingEloqua(req.query.company).then(function(amazingEloqua)
          {
            amazingEloqua.campaign.createSimple({name: req.body.name, folderId: req.body.eloquaFolder, segmentId: req.body.eloquaSegment, emailId: req.body.eloquaEmail, startAt: req.body.startAt, endAt: req.body.endAt}, function(err, response)
            {
              console.log('createSimpleCampaign callback');
              console.log(err);
              console.log(response);

              if(err !=  null)
              {
                var errors = [];

                console.error(err);
                errors.push(
                {
                    param: 'schedule',
                    msg: 'there was an error - could not schedule email',
                    value: ''
                });
                            
                res.status(400).json(errors);
              } 
              else
              {
                activateCampaignAndUpdateEmail(amazingEloqua, response, response.id,  req,res,next);
              }
            });   
          });   
        },
        updateEmailSchedule: function(req, res, next)
        {
          console.log('update SimpleCampaign');
          getAmazingEloqua(req.query.company).then(function(amazingEloqua)
          {
            amazingEloqua.campaign.updateSimple(req.params.eloquaCampaignId, {name: req.body.name, folderId:req.body.eloquaFolder, segmentId: req.body.eloquaSegment, emailId: req.body.eloquaEmail, startAt: req.body.startAt, endAt: req.body.endAt}, function(err, response)
            {
              console.log('updateSimpleCampaign callback');
             
              if(err !=  null)
              {
                var errors = [];

                console.error(err);
                errors.push(
                {
                    param: 'schedule',
                    msg: 'there was an error - could not schedule email',
                    value: ''
                });
                            
                res.status(400).json(errors);
              } 
              else
              {
                console.log(response);
                activateCampaignAndUpdateEmail(amazingEloqua, response, req.params.eloquaCampaignId, req, res, next);
              }
            });   
          });   
        },
        unscheduleEmail: function(req, res, next)
        {
          console.log('unscheduleemail');
          getAmazingEloqua(req.query.company).then(function(amazingEloqua)
          {
            amazingEloqua.campaign.deacitivate(req.params.eloquaCampaignId, function(activationErr, activationRes)
            {
              console.log('deacitivateCampaign callback');
              console.log(activationErr);
              console.log(activationRes);

              if(activationErr)
              {
                res.status(400).json(activationErr);
              }
              else
              { 
                email.getEmailById(req.body.emailId, function(err, email)
                {
                  console.log('getEmailById callback');
                  //console.log(err);
                  //console.log(email);
                  
                  email.status = 'draft';
                  email.save(function(saveErr, saveRes)
                  {
                    console.log('save callback');
                    console.log(saveErr);
                    console.log(saveRes);
                    
                    res.jsonp(saveRes);
                  });
                });
              }
            });
          });
        }, 
        saveEmail: function(req, res, next)
        {
            console.log('saveemail');
            //console.dir(req.body.source);
            
            var contacts = [  
              {  
                'emailAddress': 'simon@leadteq.com',  
                'id': 1  
              },
              {  
                'emailAddress': 'bjorn.sperling@leadteq.com',  
                'id': 8  
              }
              ];

            var contacts2 = [  
              {  
                'emailAddress': 'simon@leadteq.com',  
                'id': 1  
              }  
              ];

            var segment = contacts;
            if(req.body.segment == 1)
            {
              console.log('OTHER Segement');
              segment = contacts;
            }


            var html = req.body.source;
            var subject = req.body.subject;
            var name = req.body.name;
            var deployname = name+' deployment';

            getAmazingEloqua(req.query.company).then(function(amazingEloqua)
            {      
              amazingEloqua.sendInlineEmail(segment, html, subject, name, deployname, function(err, response)
              {
                console.log('send Inline Email callback');
                //console.log(err);
                //console.log(response);
              
                res.status(200).json(
                {
                  success: true,
                  error: null
                });
              });
            });

            /*
            res.status(200).json(
              {
                success: true,
                error: null
              });*/
            
        },
        refreshToken: function(req, res, next)
        {
          eloquaMngr.getCompanyById(req.query.company).then(function(company)
          {
            eloquaMngr.refreshToken(company, function(err, response)
            {
              if(err != null)
              {
                res.status(400).json(err);
              }
              else
              {
                if(response != null)
                {
                  res.status(200).end();
                }
                else
                {
                  res.status(400).json('response is null');
                }
              }
            });
          }).catch(function(e)
          {
            res.status(400).json(e);
          });
      }      
    };
}

