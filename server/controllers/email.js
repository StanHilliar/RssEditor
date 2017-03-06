'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Email = mongoose.model('Email'),
  NewsletterEntity = mongoose.model('NewsletterEntity'),
  async = require('async'),
  config = require('meanio').loadConfig(),
  crypto = require('crypto'),
  _ = require('lodash'),
  jwt = require('jsonwebtoken'); //https://npmjs.org/package/node-jsonwebtoken
  var shortid = require('shortid');
  var parse5 = require('parse5');


function _getEmailById(id, cb)
{
    // console.log('_getEmailById');
    // console.log(id);

    Email.findOne(
    {
        _id: id
    }).exec(function(err, email) 
    {
        if (err) 
        {
            // console.error('error1');
            return cb(err, null);
        }
        if (!email)
        {
            // console.error('error2');
            return cb('Failed to load email ' + id, null);
        }    

        cb(null,email);
    });
}

function _checkNewsletterEntityForCircles(circles, req, newsletterEntityId, cb)
{ 
    console.log('_checkNewsletterEntityForCircles');
    NewsletterEntity.findOne(
        {_id: newsletterEntityId},
        'name createdBy createdAt updatedBy updatedAt circles'
    )
    .lean()
    .exec(function(getEntityErr, newsletterEntity) 
    {
        console.log('findONe');
        console.log(newsletterEntity);
        var hasAccess = false;
        var hasAccess = false;
        if(getEntityErr != null)
        {
            console.error(getEntityErr)
        }
        else
        {
            for(var x = 0; x < newsletterEntity.circles.length; x++)
            {
                if(circles.hasCompanyCircleBoolean(req, newsletterEntity.circles[x]))
                {
                    hasAccess = true;
                }
            }
        }
        return cb(getEntityErr, hasAccess);
    });    
}


module.exports = function(circles) {
    return {
        /**
         * Create use{ param: 'name', msg: 'You must enter a name' })  // directly from Upsales
7        * 
         * Create use{ param: 'name', msg: 'You must enter a name' })  // directly from Upsales
         */
        create: function(req, res, next) 
        {
            //console.log('newsletter entity create');
            var email = new Email(req.body);

            // because we set our user.provider to local our models/user.js validation will always be true
            req.assert('name', 'You must enter a name').notEmpty();
            req.assert('segment', 'You must enter a segment').notEmpty();
            req.assert('subject', 'You must enter a subject').notEmpty();
            req.assert('eloquaFolder', 'the email must have  a eloquaFolder - contact an admin').notEmpty();
            req.assert('eloquaCampaignFolder', 'the email must have a eloquaCampaignFolder - contact an admin').notEmpty();
            req.assert('eloquaFooter', 'the email must have a eloquaFooter - contact an admin').notEmpty();
            req.assert('eloquaHeader', 'the email must have a eloquaHeader - contact an admin').notEmpty();
            req.assert('eloquaEmailGroup', 'the email must have a eloquaEmailGroup - contact an admin').notEmpty();
            req.assert('bounceBackAddress', 'the email must have a bounceBackAddress - contact an admin').notEmpty();
            req.assert('replyToName', 'the email must have a replyToName - contact an admin').notEmpty();
            req.assert('replyToEmail', 'the email must have a replyToEmail - contact an admin').notEmpty();

            var errors = req.validationErrors();
            if (errors) 
            {
                return res.status(400).send(errors);
            }

            _checkNewsletterEntityForCircles(circles, req, req.body.newsletterEntity, function(checkAccessErr, hasAccess)
            {
                console.log('_checkNewsletterEntityForCircles cb: '+hasAccess);
                if(checkAccessErr != null) 
                {
                    return res.status(400).send(checkAccessErr);
                }
                else
                {
                    if(!hasAccess)
                    {
                        return res.status(400).send([
                        {
                            msg: 'user doesnt has access to this resource',
                            param: 'create email'
                        }]);
                    }
                    else
                    {
                        email.createdBy = req.user.username;
                        email.updatedBy = req.user.username;

                        //console.log('newsletter entity create 1');
                        email.save(function(err, resEmailModule) 
                        {
                            //console.log('newsletter entity create 222');
                            if (err) 
                            {
                                switch (err.code) 
                                {
                                    case 11000:
                                    case 11001:
                                    return res.status(400).json([
                                    {
                                        msg: 'Name already taken',
                                        param: 'name'
                                    }]);
                                    break;
                                    default:
                                    var modelErrors = [];

                                    if (err.errors) 
                                    {                    
                                        for (var x in err.errors) 
                                        {
                                            modelErrors.push(
                                            {
                                                param: x,
                                                msg: err.errors[x].message,
                                                value: err.errors[x].value
                                            });
                                        }

                                        return res.status(400).json(modelErrors);
                                    }
                                }

                                //console.log('emailt entity create 888');
                                return res.status(400);
                            }
                            else
                            {
                                //console.log('newsletter entity create');
                                return res.jsonp(resEmailModule);
                            }
                        });
                    }
                }
            });
        },
      

        /**
         * Find user by id
         */
        get: function(req, res) 
        {
            // console.log('email get');
            // console.log(req.params);
            
            _getEmailById(req.params.emailId, function(err, email)
            {
                if (err) 
                {
                    // console.error('error1');
                    return res.status(500).send(err);
                }
                if (!email)
                {

                    // console.error('error2');
                    return res.status(500).send('Failed to load email ' + req.params.moduleId);
                }    
                else
                {
                    _checkNewsletterEntityForCircles(circles, req, email.newsletterEntity, function(checkAccessErr, hasAccess)
                    {
                        console.log('_checkNewsletterEntityForCircles cb: '+hasAccess);
                        if(checkAccessErr != null) 
                        {
                            return res.status(400).send(checkAccessErr);
                        }
                        else
                        {
                            if(!hasAccess)
                            {
                                return res.status(400).send([
                                {
                                    msg: 'user doesnt has access to this resource',
                                    param: 'get email'
                                }]);
                            }
                            else
                            {
                                res.jsonp([email]);
                            }
                        }
                    });
                }
            });
        },

        /**
         * Delete an email
         */
        destroy: function(req, res) 
        {
            Email.findOne(
            {
                _id: req.params.emailId
            }).exec(function(err, _email) 
            {   
                _checkNewsletterEntityForCircles(circles, req, _email.newsletterEntity, function(checkAccessErr, hasAccess)
                {
                    console.log('_checkNewsletterEntityForCircles cb: '+hasAccess);
                    if(checkAccessErr != null) 
                    {
                        return res.status(400).send(checkAccessErr);
                    }
                    else
                    {
                        if(!hasAccess)
                        {
                            return res.status(400).send([
                            {
                                msg: 'user doesnt has access to this resource',
                                param: 'delete email'
                            }]);
                        }
                        else
                        {
                            _email.remove(function(saveErr)
                            {
                                if (saveErr) 
                                {
                                    res.render('error', 
                                    {
                                        status: 500
                                    });
                                } 
                                else 
                                {
                                    res.jsonp(_email);
                                }
                            });
                        }
                    }
                });
            });
        },
        getEmailById: function(emailId, cb)
        {
           _getEmailById(emailId,cb);
        },
        update: function(req, res) 
        {
            // console.log('update email');

            req.assert('segment', 'You must enter a segment').notEmpty();
            req.assert('subject', 'You must enter a subject').notEmpty();
            req.assert('eloquaFolder', 'the email must have  a eloquaFolder - contact an admin').notEmpty();
            req.assert('eloquaCampaignFolder', 'the email must have a eloquaCampaignFolder - contact an admin').notEmpty();
            req.assert('eloquaFooter', 'the email must have a eloquaFooter - contact an admin').notEmpty();
            req.assert('eloquaHeader', 'the email must have a eloquaHeader - contact an admin').notEmpty();
            req.assert('eloquaEmailGroup', 'the email must have a eloquaEmailGroup - contact an admin').notEmpty();
            req.assert('bounceBackAddress', 'the email must have a bounceBackAddress - contact an admin').notEmpty();
            req.assert('replyToName', 'the email must have a replyToName - contact an admin').notEmpty();
            req.assert('replyToEmail', 'the email must have a replyToEmail - contact an admin').notEmpty();
            
            var errors = req.validationErrors();
            if (errors) 
            {
                return res.status(400).send(errors);
            }
          
            Email.findOne(
            {
                _id: req.params.emailId
            }).exec(function(err, email) 
            {
                if(err != null)
                {
                    return res.status(400).send(err);
                }
                else
                {
                    if(email != null)
                    {
                        _checkNewsletterEntityForCircles(circles, req, email.newsletterEntity, function(checkAccessErr, hasAccess)
                        {
                            console.log('_checkNewsletterEntityForCircles cb: '+hasAccess);
                            if(checkAccessErr != null) 
                            {
                                return res.status(400).send(checkAccessErr);
                            }
                            else
                            {
                                if(!hasAccess)
                                {
                                    return res.status(400).send([
                                    {
                                        msg: 'user doesnt has access to this resource',
                                        param: 'update email'
                                    }]);
                                }
                                else
                                {
                                    email = _.extend(email, req.body);
                                    console.log('update email cb');
                                
                                    email.updatedBy = req.user.username;

                                    email.save(function(saveErr)
                                    {
                                        if(saveErr != null)
                                        {   
                                            console.error(saveErr);
                                        }
                                        
                                        res.jsonp(email);
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        return res.status(400).send([
                        {
                            msg: 'email is null',
                            param: 'update email'
                        }]);
                    }
                }
            });
        },
        list: function(req, res, next) 
        {
            Email.find
            (
                {},
                'name company createdAt createdBy updatedAt updatedBy segment scheduledDate newsletterEntity status' 
            ).lean()
            // .sort({'updatedAt': -1})
            // .limit(100)
            .exec(
            function(getEmailsErr, email) 
            {
                if(getEmailsErr)
                {
                    return res.status(400).send(getEmailsErr);
                }
                else
                {
                    if(circles.hasCompanyCircleBoolean(req, 'Company_Admin'))
                    {
                        res.jsonp(email);
                        // res.jsonp(newsletterEntities);
                    }
                    else
                    {
                        NewsletterEntity.find(
                            {},
                            'name createdBy createdAt updatedBy updatedAt circles'
                        )
                        .lean()
                        .exec(function(getEntitiesErr, newsletterEntities) 
                        {
                            if(getEntitiesErr)
                            {
                                return res.status(400).send(getEntitiesErr);
                            }
                            else
                            {
                                var returnme         = [];
                                var circlesPerEntity = {};
                                
                                for(var i = 0; i < newsletterEntities.length; i++)
                                {
                                    circlesPerEntity[newsletterEntities[i]._id] = newsletterEntities[i].circles;
                                }

                                for(var i = 0; i < email.length; i++)
                                {
                                    var currentCircle = circlesPerEntity[email[i].newsletterEntity];
                                    if(currentCircle != null)
                                    {
                                        for(var x = 0; x < currentCircle.length; x++)
                                        {
                                            if(circles.hasCompanyCircleBoolean(req, currentCircle[x]))
                                            {
                                                returnme.push(email[i]);
                                                break;
                                            }
                                        }
                                    }
                                }
                                // console.log(returnme);

                                res.jsonp(returnme);
                            }
                        });
                    }
                }
            });
        }     
    };
}

