'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  EmailTemplate = mongoose.model('EmailTemplate');




module.exports = function(MeanUser){
    return {

        create: function(req, res, next) 
        {
      
            var emailTemplate = new EmailTemplate(req.body);

            req.assert('name', 'You must enter a name').notEmpty();
            req.assert('type', 'You must enter a type').notEmpty();
            req.assert('createdBy', 'You must enter a createdBy').notEmpty();


            var errors = req.validationErrors();
            if (errors) 
            {
                return res.status(400).send(errors);
            }

            emailTemplate.save(function(err) 
            {
                if (err) 
                {
                    console.error(err);
                  /*  switch (err.code) 
                    {
                        case 11000:
                        case 11001:
                        res.status(400).json([
                        {
                            msg: 'Username already taken',
                            param: 'username'
                        }]);
                        break;
                        default:
                        var modelErrors = [];

                        if (err.errors) {

                            for (var x in err.errors) {
                                modelErrors.push({
                                    param: x,
                                    msg: err.errors[x].message,
                                    value: err.errors[x].value
                                });
                            }

                            res.status(400).json(modelErrors);
                        }
                    }*/
                    return res.status(400);
                }

                return res.status(200);
            });
        },
        update: function(req, res, next) 
        {
            var emailTemplate = new EmailTemplate(req.body);

            req.assert('name', 'You must enter a name').notEmpty();
            req.assert('type', 'You must enter a type').notEmpty();
            req.assert('user', 'You must enter a user').notEmpty();


            var errors = req.validationErrors();
            if (errors) 
            {
                return res.status(400).send(errors);
            }

            emailTemplate.save(function(err) 
            {
                if (err) 
                {
                    console.error(err);
                  /*  switch (err.code) 
                    {
                        case 11000:
                        case 11001:
                        res.status(400).json([
                        {
                            msg: 'Username already taken',
                            param: 'username'
                        }]);
                        break;
                        default:
                        var modelErrors = [];

                        if (err.errors) {

                            for (var x in err.errors) {
                                modelErrors.push({
                                    param: x,
                                    msg: err.errors[x].message,
                                    value: err.errors[x].value
                                });
                            }

                            res.status(400).json(modelErrors);
                        }
                    }*/
                    return res.status(400);
                }

                res.status(200);
            });
        },
       

        getEmailTemplateById: function(req, res, next) 
        {
            EmailTemplate.findOne(
            {
                _id: req.body.id
            }, function(err, emailTemplate) 
            {

               res.json(emailTemplate);
            });
        },
        getAllEmailTemplates: function(req, res, next) 
        {
            EmailTemplate.find(
            {
            }, function(err, emailTemplates) 
            {

               res.json(emailTemplates);
            });
        }

    
    };
}

