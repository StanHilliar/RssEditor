'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Email = mongoose.model('Email'),
  async = require('async'),
  config = require('meanio').loadConfig(),
  crypto = require('crypto'),
  _ = require('lodash'),
  jwt = require('jsonwebtoken'); //https://npmjs.org/package/node-jsonwebtoken
  var shortid = require('shortid');
  var parse5 = require('parse5');


function _getEmailById(id, cb)
{
    console.log('_getEmailById');
    console.log(id);

    Email.findOne(
    {
        _id: id
    }).exec(function(err, email) 
    {
        if (err) 
        {
            console.error('error1');
            return cb(err, null);
        }
        if (!email)
        {
            console.error('error2');
            return cb('Failed to load email ' + id, null);
        }    

        cb(null,email);
    });
}


module.exports = function() {
    return {
        /**
         * Create user
         */
        create: function(req, res, next) 
        {
            //console.log('newsletter entity create');
            var email = new Email(req.body);

            // because we set our user.provider to local our models/user.js validation will always be true
            req.assert('name', 'You must enter a name').notEmpty();

            var errors = req.validationErrors();
            if (errors) 
            {
                return res.status(400).send(errors);
            }

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
        },
      

        /**
         * Find user by id
         */
        get: function(req, res) 
        {
            console.log('email get');
            console.log(req.params);
            
            _getEmailById(req.params.emailId, function(err, email)
            {
                if (err) 
                {
                    console.error('error1');
                    return res.status(500).send(err);
                }
                if (!email)
                {
                    console.error('error2');
                    return res.status(500).send('Failed to load email ' + req.params.moduleId);
                }    
               
                res.jsonp([email]);
            });

        },

        /**
         * Delete an emailModule
         */
        destroy: function(req, res) 
        {

            Email.findOne(
            {
                _id: req.params.emailId
            }).exec(function(err, _email) 
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
            });
        },

        getEmailById: function(emailId, cb)
        {
           _getEmailById(emailId,cb);
        },
        update: function(req, res) 
        {
            console.log('update email');
            Email.findOne(
            {
                _id: req.params.emailId
            }).exec(function(err, email) 
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
            });
        },
        list: function(req, res, next) 
        {
            Email.find(
            {
            }, function(err, email) 
            {
               res.jsonp(email);
            });
        }     
    };
}

