'use strict';

/**
 * Module dependencies.
 */
var mongoose            = require('mongoose');
var NewsletterEntity    = mongoose.model('NewsletterEntity');
var emailModules        = require('./emailModule')();
var async               = require('async');
var config              = require('meanio').loadConfig();
// var _                   = require('lodash');
var _                   = require('underscore');

module.exports = function(circles) {

    function getEmailModuleByArrayOfIds(modules, cb)
    {
        console.log('getEmailModuleByArrayOfIds--------------------');
        var cache = [];
        async.eachSeries(modules, function (module, callback) 
        {
            console.log('each '+module._id);
            console.log(module.placeholderType);
            if(module._id != "")
            {
                if(module.placeholderType == 'DROPZONE')
                {
                    console.log('IS dropzone');
                    cache[module.moduleIdentifier] = module;
                    return callback(null,  cache[module.moduleIdentifier]);
                }
                else
                {
                    if (_.contains(cache, module._id)) 
                    {
                        async.setImmediate(function () 
                        {
                            return callback(null, cache[module._id]);
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
                                //cache[module._module._id] = emailModule;
                                cache[module._id]       = emailModule._doc;
                                return callback(null, cache[module._id]);
                            }
                            else
                            {
                                return callback('getfull - emailModule is null');
                            }
                        });
                    }
                }
            }
            else
            {
                return callback('module id is null');
            }
        }, 
        function(err)
        {
            console.log('getEmailModuleByArrayOfIds done');
            return cb(err, cache);
        });
    }

    return {
        /**
         * Create entity
         */
        create: function(req, res, next) 
        {
            var newsletterEntity = new NewsletterEntity(req.body);


            // because we set our user.provider to local our models/user.js validation will always be true
            req.assert('name',         'You must enter a name').notEmpty();
            req.assert('type',         'You must enter a type').notEmpty();
            req.assert('name',         'You must enter a name').notEmpty();
            req.assert('type',         'You must enter a type').notEmpty();
            req.assert('eloquaFooter', 'You must set a email Footer in Eloqua').notEmpty();
            req.assert('replyToName',  'You must set a reply to Name').notEmpty();
            req.assert('replyToEmail', 'You must set a reply to Email').notEmpty();
            req.assert('replyToEmail', 'You must enter a valid reply to Email Address').isEmail();
            req.assert('fromAddress',  'You must set a from-address').notEmpty();
            req.assert('fromAddress',  'You must enter a valid from-address').isEmail();
            req.assert('senderName',   'You must set a senderName').notEmpty();

            var errors = req.validationErrors();
            if (errors) {
                return res.status(400).send(errors);
            }

            newsletterEntity.createdBy = req.user.username;
            newsletterEntity.updatedBy = req.user.username;

            console.log('newsletter entity create 1');
            newsletterEntity.save(function(err, savedNewsletterEntity) 
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
                return res.status(200).json(savedNewsletterEntity);
            });
        },
        /**
         * Find entity by id
         */
        get: function(req, res) 
        {
            NewsletterEntity.findOne(
            {
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
                    return res.status(500).send('Failed to load newsletterEntity ' + req.params.entityId);
                }    

                res.jsonp([newsletterEntity]);
            });
        },       
        /**
         * get entity and modules by id
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

                getEmailModuleByArrayOfIds(newsletterEntity.modules, 
                function(err, modules)
                {
                    if(err)
                    {
                        console.error(err);
                    }
                    console.log(modules.length);
                    var myDropzoneModules = _.map(newsletterEntity.dropzoneModules, function(id){ return {_id: id}; });;
                    getEmailModuleByArrayOfIds(myDropzoneModules, 
                    function(dropErr, dropzoneModules)
                    {
                        if(dropErr)
                        {
                            console.error(dropErr);
                        }
                        console.log(dropzoneModules.length);
                        // newsletterEntity.modules = [];

                        console.log('modules:');
                        for(var i = 0; i < newsletterEntity.modules.length; i++)
                        {
                            newsletterEntity.modules[i]._id
                            // newsletterEntity.modules[i].type
                            _.extend(newsletterEntity.modules[i], modules[newsletterEntity.modules[i]._id]);
                        //  cache[module._id]       = _.extend(emailModule._doc, module);
                        }
                       

                        newsletterEntity.dropzoneModules = [];

                        for(var key in dropzoneModules)
                        {
                            if(dropzoneModules.hasOwnProperty(key))
                            {
                                newsletterEntity.dropzoneModules.push(dropzoneModules[key]);
                            }
                        }
                        console.log('done');
                        
                        res.jsonp([newsletterEntity]);
                    });
                });
                // var cache = [];

                // async.eachSeries(newsletterEntity.modules, function (module, callback) 
                // {
                //     console.log('each '+module._id);
                //     if(module._id != "")
                //     {
                //         if (_.contains(cache, module._id)) 
                //         {
                //             async.setImmediate(function () 
                //             {
                //                 callback(null, cache[module._id]);
                //             });
                //         } 
                //         else 
                //         {
                //             emailModules.getModuleById(module._id, function(err, emailModule)
                //             {
                //                 console.log('getemailModules');
                //                 if(err != null)
                //                 {
                //                     return callback(err);
                //                 }

                //                 if(emailModule != null)
                //                 {
                //                     console.log(module._id)
                //                     //cache[module._id] = emailModule;
                //                     cache[module._id] = _.extend(emailModule._doc, module);
                //                     return callback(null, cache[module._id]);
                //                 }
                //                 else
                //                 {
                //                     return callback('getfull - emailModule is null');
                //                 }
                //             });
                //         }
                //     }
                //     else
                //     {
                //         callback('module id is null');
                //     }
                // }, 
                // function()
                // {
                    
                //     newsletterEntity.modules = [];

                //     for(var key in cache)
                //     {
                //         if(cache.hasOwnProperty(key))
                //         {
                //             newsletterEntity.modules.push(cache[key]);
                //         }
                //     }
                //     console.log('done');
                    
                //     res.jsonp([newsletterEntity]);
                // });

               
              
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
            req.assert('name',         'You must enter a name').notEmpty();
            req.assert('type',         'You must enter a type').notEmpty();
            req.assert('name',         'You must enter a name').notEmpty();
            req.assert('type',         'You must enter a type').notEmpty();
            req.assert('eloquaFooter', 'You must set a email Footer in Eloqua').notEmpty();
            req.assert('replyToName',  'You must set a reply to Name').notEmpty();
            req.assert('replyToEmail', 'You must set a reply to Email').notEmpty();
            req.assert('replyToEmail', 'You must enter a valid reply to Email Address').isEmail();
            req.assert('fromAddress',  'You must set a from-address').notEmpty();
            req.assert('fromAddress',  'You must enter a valid from-address').isEmail();
            req.assert('senderName',   'You must set a senderName').notEmpty();

            var errors = req.validationErrors();
            if (errors) {
                return res.status(400).send(errors);
            }
            
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
            console.log(req.params.company);
          
            NewsletterEntity.find(
                {},
                'name createdBy createdAt updatedBy updatedAt circles'
            )
            .lean()
            .exec(function(err, newsletterEntities) 
            {
                // res.jsonp(newsletterEntities);
                res.jsonp(newsletterEntities);      
            });
            
        }
    };

}