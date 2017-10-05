'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose');
var EmailModule = mongoose.model('EmailModule');
var async       = require('async');
var config      = require('meanio').getConfig();
var _           = require('lodash');
var shortid     = require('shortid');
var parse5      = require('parse5');


function _getModuleById(moduleId, cb)
{
    // console.log('_getModuleById');
    // console.log(moduleId);

    EmailModule.findOne(
    {
        _id: moduleId
    }).exec(function(err, emailModule) 
    {
        if (err) 
        {
            // console.error('error1');
            return cb(err, null);
        }
        if (!emailModule)
        {
            // console.error('error2');
            return cb('Failed to load emailModule ' + moduleId, null);
        }    

       
        cb(null,emailModule);
    });
}

function _parseAndUpdateModule(module)
{
    var emailModule = module;
    // console.log('_parseAndUpdateModule');
    if(emailModule.views != null && emailModule.views.length > 0)
    {
        for(var i = 0; i < emailModule.views.length; i++)
        {
            if(emailModule.views[i]._id == '')
            {
                emailModule.views[i]._id = shortid.generate();
                //console.log(emailModule.views[i]._id);
            }

            var source = emailModule.views[i].source;
            // console.log(source);
            // console.log('-----------------------');
            source =  source.replace(/[^\x20-\x7E]+/g, '');
            // console.log(source);
            // console.log('-----------------------');
            source =  source.replace(/\r?\n|\r/g,"");
            // console.log(source);
            // console.log('-----------------------');
            // console.log('-----------------------');
            var ser = parse5.serialize(source);
            
            // source =  source.replace(/ /g,'');
            // console.log(ser);
            // console.log('-----------------------');

            var fragment = parse5.parseFragment(source);
            // console.log(fragment);
            emailModule.views[i].childTagName = 'div';
            if(fragment != null)
            {
                if(fragment.childNodes.length == 1)
                {   
                    emailModule.views[i].childTagName = fragment.childNodes[0].tagName;
                }
                else
                {
                    if(fragment.childNodes.length > 1)
                    {   
                        // console.log('childNodes.length >1 ');
                        var firstChildTagName = fragment.childNodes[0].tagName;
                        var isTheSameForAllChildren = true;
                        for(var x = 0; x < fragment.childNodes.length; x++)
                        {
                            // console.log(fragment.childNodes[x].tagName+' !== '+firstChildTagName)
                            if(fragment.childNodes[x].nodeName === '#text' && fragment.childNodes[x].value.trim() === '')
                            {
                                //ignore empy text elements
                            }
                            else
                            {
                                if(fragment.childNodes[x].tagName !== firstChildTagName)
                                {
                                    isTheSameForAllChildren = false;
                                }
                            }
                        }

                        if(isTheSameForAllChildren)
                        {
                            emailModule.views[i].childTagName = firstChildTagName;
                        }
                        console.log('emailModule.views[i].childTagName '+emailModule.views[i].childTagName );
                    }
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

            if(req.user)
            {
                emailModule.createdBy = req.user.username;
                emailModule.updatedBy = req.user.username;
                
                //console.log('newsletter entity create 1');
                emailModule.save(function(err, resEmailModule) 
                {
                    // console.log('5');
                    // console.log(err);
                    // console.log(resEmailModule);
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

                        // console.log('newsletter entity create 888');
                        return res.status(400).end();
                    }
                    else
                    {
                        //console.log('newsletter entity create');
                        return res.jsonp(resEmailModule);
                    }
                });
            }
            else
            {
                return res.status(400).send([{msg: 'user is not setup'}]);
            }
        },
        __parseAndUpdateModule: function(module)
        {
            return _parseAndUpdateModule(module);
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
                    console.error('error1');
                    return res.status(500).send(err);
                }
                if (!emailModule)
                {
                    console.error('error2');
                    return res.status(500).send('Failed to load emailModule ' + req.params.moduleId);
                }    

               
                res.jsonp([emailModule]);
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
                        res.render('error', 
                        {
                            status: 500
                        });
                    } 
                    else 
                    {
                        res.jsonp(_emailModule);
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
            // console.log('update email module');
            EmailModule.findOne(
            {
                _id: req.params.moduleId
            }).exec(function(err, emailModule) 
            {
                emailModule = _.extend(emailModule, req.body);
                emailModule.updatedBy = req.user.username;
                // console.log('update email module cb');

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
                    
                    res.jsonp(emailModule);
                });
            });
        },
        list: function(req, res, next) 
        {
            // console.log('list');
            // console.log(req.query.company);
            EmailModule.find(
                { company: req.query.company },
                'name company createdBy createdAt updatedBy updatedAt'
            )
            .lean()
            .exec(function(err, emailModules) 
            {
               res.jsonp(emailModules);
            });
        },


     
    };
}

