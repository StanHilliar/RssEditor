'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose');
var async       = require('async');
var config      = require('meanio').loadConfig();
var crypto      = require('crypto');
var _           = require('lodash');
var jwt         = require('jsonwebtoken'); //https://npmjs.org/package/node-jsonwebtoken
var shortid     = require('shortid');
var parse5      = require('parse5');

var EmailModule = mongoose.model('EmailModule');

function _getModuleById(moduleId, cb)
{
    console.log('_getModuleById');
    console.log(moduleId);

    EmailModule.findOne(
    {
        _id: moduleId
    }).exec(function(err, emailModule) 
    {
        if (err) 
        {
            console.error('error1');
            return cb(err, null);
        }
        if (!emailModule)
        {
            console.error('error2');
            return cb('Failed to load emailModule ' + moduleId, null);
        }    

       
        return cb(null,emailModule);
    });
}

function _parseAndUpdateModule(module)
{
    var emailModule = module;
    console.log('_parseAndUpdateModule');
    if(emailModule.views != null && emailModule.views.length > 0)
    {
        for(var i = 0; i < emailModule.views.length; i++)
        {
            if(emailModule.views[i]._id == '')
            {
                emailModule.views[i]._id = shortid.generate();
                //console.log(emailModule.views[i]._id);
            }

            var fragment = parse5.parseFragment(emailModule.views[i].source.replace(/[^\x20-\x7E]+/g, ''));
            // console.log(fragment);
            emailModule.views[i].childTagName = 'div';
            if(fragment != null)
            {
                if(fragment.childNodes.length == 1)
                {   
                    emailModule.views[i].childTagName = fragment.childNodes[0].tagName;
                }
            }
        }
    }

    var _fullHTML = emailModule.preBody+emailModule.postBody;
    // console.log(_fullHTML);
    emailModule.childTagName = 'div';
    if(_fullHTML != '')
    {
        var fullFragment = parse5.parseFragment(_fullHTML);
        if(fullFragment != null)
        {
            if(fullFragment.childNodes.length == 1)
            {   
                emailModule.childTagName = fullFragment.childNodes[0].tagName;
            }
        }    
    }
    return emailModule;
}


module.exports = function(MeanUser) {
    return {
        /**
         * Create user
         */
        create: function(req, res, next) 
        {
            // console.log('create');
            //console.log('newsletter entity create');
            var emailModule = new EmailModule(req.body);

            // console.log('1');
            /*
            if(emailModule.views != null)
            {
                for(var i = 0; i < emailModule.views.length; i++)
                {
                    if(emailModule.views[i]._id == '')
                    {
                        emailModule.views[i]._id = shortid.generate();
                    }
                }
            }*/
            emailModule = _parseAndUpdateModule(emailModule);
            // console.log('2');

            // because we set our user.provider to local our models/user.js validation will always be true
            req.assert('name', 'You must enter a name').notEmpty();
            req.assert('type', 'You must enter a type').notEmpty();
            // console.log('3');

            var errors = req.validationErrors();
            if (errors) 
            {
                return res.status(400).send(errors);
            }
            // console.log('4');

            emailModule.createdBy = req.user.username;
            emailModule.updatedBy = req.user.username;


            //console.log('newsletter entity create 1');
            emailModule.save(function(err, resEmailModule) 
            {
                // console.log('5');
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

                    console.log('newsletter entity create 888');
                    return res.status(400).end();
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
            /*
            EmailModule.findOne(
            {
                _id: req.params.moduleId
            }).exec(function(err, emailModule) 
            {
                if (err) 
                {
                    console.error('error1');
                    return res.status(500).send(err);
                }
                if (!emailModule)
                {
                    console.error('error2');
                    return res.status(500).send('Failed to load emailModule ' + id);
                }    

               
                res.jsonp([emailModule]);
            });*/
            
            console.log('email module get');
            console.log(req.params);
            
            _getModuleById(req.params.moduleId, function(err, emailModule)
            {
                if (err) 
                {
                    console.error(err);
                    return res.status(500).send(err);
                }
                if (!emailModule)
                {
                    console.error('error2');
                    return res.status(500).send('Failed to load emailModule ' + req.params.moduleId);
                }    

               
                return res.jsonp([emailModule]);
            });

        },

        /**
         * Delete an emailModule
         */
        destroy: function(req, res) 
        {

            EmailModule.findOne(
            {
                _id: req.params.moduleId
            }).exec(function(err, _emailModule) 
            {
                _emailModule.remove(function(saveErr)
                {
                    if (saveErr) 
                    {
                        return res.render('error', 
                        {
                            status: 500
                        });
                    } 
                    else 
                    {
                        return res.jsonp(_emailModule);
                    }
                });
            });
        },

        getModuleById: function(moduleId, cb)
        {
           _getModuleById(moduleId,cb);
        },
        update: function(req, res) 
        {
            console.log('update email module');
            EmailModule.findOne(
            {
                _id: req.params.moduleId
            }).exec(function(err, emailModule) 
            {
                emailModule = _.extend(emailModule, req.body);
                emailModule.updatedBy = req.user.username;
                if(err)
                {
                    console.error(err);
                }
                console.log('update email module cb');

                /*
                if(emailModule.views != null)
                {
                    for(var i = 0; i < emailModule.views.length; i++)
                    {
                        if(emailModule.views[i]._id == '')
                        {
                            emailModule.views[i]._id = shortid.generate();
                            //console.log(emailModule.views[i]._id);
                        }

                        var fragment     = parse5.parseFragment(emailModule.views[i].source);
                        console.log(fragment);
                        if(fragment != null)
                        {
                            if(fragment.childNodes.length == 1)
                            {   
                                emailModule.views[i].childTagName = fragment.childNodes[0].tagName;
                            }
                        }
                       
                    }
                }

                var _fullHTML = emailModule.preBody+ emailModule.postBody;
                if(_fullHTML != '')
                {
                    var fullFragment = parse5.parseFragment(_fullHTML);
                    if(fullFragment != null)
                    {
                        if(fullFragment.childNodes.length == 1)
                        {   
                            emailModule.childTagName = fullFragment.childNodes[0].tagName;
                        }
                    }    
                }*/

                emailModule = _parseAndUpdateModule(emailModule);

                emailModule.save(function(saveErr)
                {
                    if(saveErr != null)
                    {
                        console.error(saveErr);
                    }
                    
                    return res.jsonp(emailModule);
                });
            });
        },
        list: function(req, res, next) 
        {
            EmailModule.find(
                {},
                'name createdBy createdAt updatedBy updatedAt'
            )
            .lean()
            .exec(function(err, emailModules) 
            {
               return res.jsonp(emailModules);
            });
        },


     
    };
}

