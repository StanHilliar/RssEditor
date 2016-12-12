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
    // var imagesize = require('imagesize');
    var request = require('request');
    var size = require('request-image-size');



function expandUrl(shortUrl, cb) 
{
    //console.log('expandURL('+shortUrl+')');
    var r = request(
    {
        url: shortUrl,
        followRedirect: true,
        followAllRedirects: true
    }, 
    function (e, response) 
    {
        // console.log('result:');
        if(e)
        {
            console.error(e);
            return cb(e);
        }
        // console.log(r.uri);
        //console.log(response.request.uri);
        //console.log(response.headers);
        //console.log(response.body);
        var url = r.uri.href;

        if(r.uri.port == '80')
        {
           url = url.replace(r.uri.host, r.uri.hostname);
        }

        return cb(null, url);
    });
}

function isURL(str) 
{
     var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
     var url = new RegExp(urlRegex, 'i');
     return str.length < 2083 && url.test(str);
}


module.exports = function(MeanUser) {
    return {
        /**
         * Find user by id
         */
        isAdvertismentBooked: function(req, res) 
        {
            console.log('isAdvertismentBooked');
            var imgUrl = req.params.url;
            // imgUrl = 'http://bn-01.adtomafusion.com/static/view/bbm.dagens_medicin.nyhetsbrev.dagliga_dm/dm_mail_rekt11';
            // console.log(imgUrl);
    
            if(isURL(imgUrl))
            { 
                expandUrl(imgUrl, function(err, url)
                {
                    if(isURL(url))
                    {    
                        // console.log('url: '+url);
                        expandUrl(url, function(err, finalUrl)
                        {   
                            if(finalUrl == undefined || finalUrl == null || finalUrl == '')
                            {
                                // console.log('error 1');
                                return res.status(400).json('there was a problem with expanding url of the image');
                            }
                            else
                            {      
                                if(isURL(finalUrl))
                                { 
                                    // console.log('finalUrl: '+finalUrl);
                                    size(finalUrl, function(err, dimensions, length) 
                                    {
                                        if(err != null)
                                        {
                                            // console.log('error 5');
                                            // console.log(err);
                                            return res.status(400).json(err);
                                        }
                                        else
                                        {
                                            // console.log('no error');
                                            // console.log(err, dimensions, length);
                                            res.jsonp([dimensions]);  
                                        }
                                    });
                                }
                                else
                                {
                                     // console.log('error 2');
                                    return res.status(400).json('the url '+finalUrl+' is invalid');
                                }
                            }
                        });
                    }
                    else
                    {
                        // console.log('error 3');
                        return res.status(400).json('the url '+url+' is invalid');
                    }
                });
            }
            else
            {
                 // console.log('error 4');
                return res.status(400).json('the url '+imgUrl+' is invalid');
            }
        }
    };
}

