'use strict';

var FeedParser = require('feedparser'); 
var request = require('request');

var  http = require('http');
var  https = require('https');
var parseString = require('xml2js').parseString;


module.exports = function() {
    return {

    	loadRSS: function(req, res, next) 
        {
        	var entries =[];
        	var metaInfo = null;

        	if(req != null && req.params != null && req.params.url != null && req.params.url != '')
        	{
        		console.log('loadRSS: '+req.params.url);
				// var feedReq = request(req.params.url); 
				var feedparser = new FeedParser();

				var feedparserWasSuccessfull = true;

	
				request(req.params.url, function (error, response, body) 
				{
					if(error)
					{
						console.error(error);
					}	
					else
					{
						console.log(response.statusCode);
					}

				  	if (!error && response.statusCode == 200) 
				  	{
					    // var stream = this;
						// stream.pipe(feedparser);
				  	}
				  	else
				  	{
				  		return res.status(400).json(
				  		[{
	                		param: '1000 - loading feed',
	                    	msg: error
	                	}]);
					}
				}).pipe(feedparser);
				
				/*
				feedReq.pause();
				feedReq.on('error', function (error) 
				{
				  console.log('feedReq error');
				  console.log(error);
				  // handle any request errors
				  return res.status(400).json(
				  	[{
                    	param: '1000 - loading feed',
                        msg: error
                    }]);
				});

				feedReq.on('response', function (feedReqRes) 
				{
				  var stream = this;

				  if (feedReqRes.statusCode != 200) 
				  {
				  	return res.status(400).json(
				  	[{
                    	param: '1000 - loading feed',
                        msg: 'error'
                    }]);
				  }

				  stream.pipe(feedparser);
				  feedReq.resume();	
				});*/

				feedparser.on('error', function(error) 
				{
				  console.log('feedparser error');
				  console.log(error);
				  feedparserWasSuccessfull = false;
				  // always handle errors
				  return res.status(400).json([{
                                    param: '1001 - parsing feed',
                                    msg: error
                                }]);
				});

				feedparser.on('readable', function() 
				{
				  // This is where the action is!
				  var stream = this, 
				      meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
				    , item;

				  while (item = stream.read()) 
				  {
				    // console.log(item);

				   	var modItem = {};
				   	if(item['rss:title']['#'] != null)
				   	{
				   		modItem.title = item['rss:title']['#'];
				   	}
				
				   	if(item.link != null && item.link != null)
				   	{
				   		modItem.link = item.link;
				   	}
				   	
				   	if(item['rss:description']['#'] != null)
				   	{
				   		modItem.content = item['rss:description']['#'];
				   	}
				   
				   	if(item.pubDate != null)
				   	{
				   		modItem.publishedDate = item.pubDate;
				   	}  	

				   	if(item.date != null)
				   	{
				   		modItem.date = item.date;
				   	}
				   	
				   	if(item.categories != null)
				   	{
				   		modItem.categories = item.categories;
				   	} 	

				   	if(item.author != null)
				   	{
				   		modItem.author = item.author;
				   	} 	

				   	if(item['rss:enclosure'] != null && item['rss:enclosure']['@'] != null && item['rss:enclosure']['@']['url'] != null)
				   	{
				   		modItem.enclosure = item['rss:enclosure']['@']['url'];
				   	}
				    entries.push(modItem);
				  }

				  metaInfo = meta;
				
				  //console.log(meta);
				});

				feedparser.on('end', function() 
				{
					var meta= this.meta;
					if(feedparserWasSuccessfull)
					{
						if(meta != null)
						{
							var myFeed = 
							{
								'feedUrl': meta.xmlurl,
								'title': meta.title,
								'link': meta.link,
								'author': meta.author,
								'description': meta.description,
								'type': 'rss',
								'entries': entries
							};
						
						 	res.jsonp([myFeed]);
						}
						else
						{
							return res.status(400).json([{
	                            param: '1002 - feed',
	                            msg: 'issue loading the feed'
	                        }]);
						}
					}
				});
			}
			else
			{
				return res.status(400).json([{
                                    param: '1003 - url',
                                    msg: 'request didnt contain an url'
                                }]);
			}
       	},
       	loadXML: function(req, res, next) 
       	{
			var xml = '';

			if(req != null && req.params != null && req.params.url != null && req.params.url != '')
        	{
				request(req.params.url, function (error, response, body) 
				{
					if(error)
					{
						console.log(error);
					}	
					else
					{
						console.log(response.statusCode);
					}
					if(!error && response.statusCode == 200) 
				  	{
				  		try
				  		{
						    parseString(body, {explicitArray: true}, function (err, result) 
					        {
					        	// console.log('parseString CALLBACK');
					        	// console.log(err);
					        	// console.log(result);
					        	if(err)
					        	{
					        		console.error(err);
					        		return res.status(400).json(
								  	[{
					                	param: '1005 - error parsing feed',
					                    msg: err
					                }]);
					        	}
					        	else
					        	{
					        		// console.log('success');
					            	res.jsonp([result]);
					        	}
				         	});
				  		}
				  		catch(exception)
				  		{
				  			// console.error('catch:');
				  			console.error(exception);
				  		}
					}
					else
					{
					  	return res.status(400).json(
					  	[{
		                	param: '1000 - loading feed',
		                    msg: error
		                }]);
					}
				});
			}
			else
			{
				return res.status(400).json([{
                                    param: '1003 - url',
                                    msg: 'request didnt contain an url'
                                }]);
			}
       	}  
    };
}
