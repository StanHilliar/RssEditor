'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  NewsletterEntity = mongoose.model('NewsletterEntity'),
  emailModules = require('./emailModule')(),
  async = require('async'),
  config = require('meanio').loadConfig(),
  crypto = require('crypto'),
  _ = require('lodash'),
  jwt = require('jsonwebtoken'); //https://npmjs.org/package/node-jsonwebtoken



module.exports = function(MeanUser) {
    return {
        /**
         * Create user
         */
        create: function(req, res, next) 
        {
            var newsletterEntity = new NewsletterEntity(req.body);


            // because we set our user.provider to local our models/user.js validation will always be true
            req.assert('name', 'You must enter a name').notEmpty();
            req.assert('type', 'You must enter a type').notEmpty();

            var errors = req.validationErrors();
            if (errors) {
                return res.status(400).send(errors);
            }

            newsletterEntity.createdBy = req.user.username;
            newsletterEntity.updatedBy = req.user.username;

            console.log('newsletter entity create 1');
            newsletterEntity.save(function(err) 
            {
                console.log('newsletter entity create 222');
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

                    console.log('newsletter entity create 888');
                    return res.status(400);
                }

                    console.log('newsletter entity create 999');
                return res.status(200).json({success: true});
            });
        },
      

        /**
         * Find user by id
         */
        get: function(req, res) 
        {
            NewsletterEntity.findOne({
                _id: req.params.entityId
            }).exec(function(err, newsletterEntity) 
            {
                if (err) 
                {
                    console.error('error1');
                    return res.status(500).send(err);
                }
                if (!newsletterEntity)
                {
                    console.error('error2');
                    return res.status(500).send('Failed to load newsletterEntity ' + id);
                }    

               
                res.jsonp([newsletterEntity]);
            });
        },        /**
         * Find user by id
         */
        getfull: function(req, res) 
        {
            NewsletterEntity.findOne({
                _id: req.params.entityId
            }).exec(function(err, newsletterEntity) 
            {
                if (err) 
                {
                    console.error('error1');
                    return res.status(500).send(err);
                }
                if (!newsletterEntity)
                {
                    console.error('error2');
                    return res.status(500).send('Failed to load newsletterEntity ' + id);
                }    

                var cache = [];

                async.eachSeries(newsletterEntity.modules, function (module, callback) 
                {
                    console.log('each '+module._id);
                    if(module._id != "")
                    {
                        if (_.contains(cache, module._id)) 
                        {
                            async.setImmediate(function () 
                            {
                                callback(null, cache[module._id]);
                            });
                        } 
                        else 
                        {
                            emailModules.getModuleById(module._id, function(err, emailModule)
                            {
                                console.log('getemailModules');
                                if(err != null)
                                {
                                    return callback(err);
                                }

                                if(emailModule != null)
                                {
                                    console.log(module._id)
                                    //cache[module._id] = emailModule;
                                    cache[module._id] = _.extend(emailModule._doc, module);
                                    return callback(null, cache[module._id]);
                                }
                                else
                                {
                                    return callback('getfull - emailModule is null');
                                }
                            });
                        }
                    }
                    else
                    {
                        callback(null, module);
                    }
                }, function()
                {
                    
                    newsletterEntity.modules = [];

                    for(var key in cache)
                    {
                        if(cache.hasOwnProperty(key))
                        {
                            newsletterEntity.modules.push(cache[key]);
                        }
                    }
                    console.log('done');
                    
                    res.jsonp([newsletterEntity]);
                });

               
              
            });
        },
        /**
         * Delete an NewsletterEntity
         */
        destroy: function(req, res) 
        {
            NewsletterEntity.findOne(
            {
                _id: req.params.entityId
            }).exec(function(err, _newsletterEntity) 
            {
                _newsletterEntity.remove(function(saveErr)
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
                        res.jsonp(_newsletterEntity);
                    }
                });
            });
        },
        update: function(req, res) 
        {
            NewsletterEntity.findOne(
            {
                _id: req.params.entityId
            }).exec(function(err, newsletterEntity) 
            {
                newsletterEntity = _.extend(newsletterEntity, req.body);
                newsletterEntity.updatedBy = req.user.username;
                newsletterEntity.save(function(saveErr)
                {
                    res.jsonp(newsletterEntity);
                });
            });
        },
        list: function(req, res, next) 
        {
            console.log('list');
            console.log(req.user.roles);
            var roles = req.user.roles;
            if(_.contains("LT_RSSAPP", roles))
            {      
                NewsletterEntity.find(
                {
                }, function(err, newsletterEntities) 
                {
                   res.jsonp(newsletterEntities);
                });
            }
            else
            {
                var circles = [];
                for(var i = 0; i < roles.length; i++)
                {
                    circles.push({'circles': roles[i]});
                }

                NewsletterEntity.find(
                {
                    $or: circles
                },function(err, newsletterEntities) 
                {
                   res.jsonp(newsletterEntities);
                });
            }
        },


     
    };
}

