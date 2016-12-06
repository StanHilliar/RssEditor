'use strict';

var FeedParser = require('feedparser'), 
    request = require('request');


module.exports = function() {
    return {

    	loadRSS: function(req, res, next) 
        {
        	console.log('loadRSS: '+req.params.url);
        	var entries =[];
        	var metaInfo = null;

        	if(req != null && req.params != null && req.params.url != null && req.params.url != '')
        	{
				var feedReq = request(req.params.url), 
				feedparser = new FeedParser();

				feedReq.on('error', function (error) 
				{
				  console.log('feedReq error');
				  console.log(error);
				  // handle any request errors
				  return res.status(400).json([{
                                    param: '1000 - loading feed',
                                    msg: error
                            }]);
				});

				feedReq.on('response', function (res) 
				{
				  var stream = this;

				  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

				  stream.pipe(feedparser);
				});


				feedparser.on('error', function(error) 
				{
				  console.log('feedparser error');
				  console.log(error);
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
				    console.log(item);

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
