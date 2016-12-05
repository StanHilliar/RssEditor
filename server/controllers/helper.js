'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    EmailModule = mongoose.model('EmailModule'),
    async = require('async'),
    config = require('meanio').loadConfig();
    var url = require('url');
    var http = require('http');
    //var sizeOf = require('image-size');
    var imagesize = require('imagesize');
    var size = require('request-image-size');
 


module.exports = function(MeanUser) {
    return {
        /**
         * Find user by id
         */
        isAdvertismentBooked: function(req, res) 
        {
            console.log('isAdvertismentBooked');
            var imgUrl = req.params.url;
            console.log(imgUrl);

            size(imgUrl, function(err, dimensions, length) 
            {
                if(err != null)
                {
                    return res.status(400).json(err);
                }
                else
                {
                    console.log(err, dimensions, length);
                    res.jsonp([dimensions]);  
                //res.status(200);
                }
            });
/*
            var img = new Image();

            img.onload = function()
            {
              var height = img.height;
              var width = img.width;
              console.log(height);
              console.log(width);
              res.status(200);
              // code here to use the dimensions
            }

            img.src = url;*/


            /*  
            var request = http.get(imgUrl, function (response) 
            {
                console.log('cb');
                imagesize(response, function (err, result) 
                {
                    console.log('cb1');
                    console.log(err);
                    console.log(result);
                    // do something with result

                    // we don't need more data
                    request.abort();
                    res.status(200);
                });
            });*/
            
            /*
            var options = url.parse(imgUrl);
            console.log(options);

            http.get(options, function (response) 
            {
              var chunks = [];
              response.on('data', function (chunk) 
              {
                chunks.push(chunk);
              }).on('end', function() 
              {
                var buffer = Buffer.concat(chunks);
                console.log(buffer);
                console.log(sizeOf(buffer));
                res.status(200);
              });
            });*/

            //res.status(200);
        }
    };
}

