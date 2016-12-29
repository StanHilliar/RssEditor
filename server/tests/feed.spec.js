'use strict';

var expect = require('expect.js');
var request = require('supertest'); 
var feed = require('../controllers/feed.js')();

var url = 'http://127.0.0.1:3001';

var mock;

module.exports = mock = function(opts)
{
	var self = this;

	this.status = function(code)
	{
		var status = {};
		status.json = function(data)
		{
			return opts.jsonCB(data);
		}

		return status;
	}

	this.jsonp = function(data)
	{
		return opts.jsonpCB(data);
	}

	return self;
	
}


describe('<Unit Test>', function() 
{
    describe('loadRSS', function() 
    {
        it('loadRSS - empty feed url', function(done) 
        {   
            var res = new mock(
            {
                jsonCB: function(data)
                {
                    expect(data[0].param).to.be('1003 - url');
                    done();
                },
                jsonpCB: function(data)
                {
                    expect().fail("jsonCB should not be called");
                    done();
                }
            });

            feed.loadRSS({params:{url: ''}}, res);    
        });      

        it('loadRSS - no url', function(done) 
        {   
            var res = new mock(
            {
                jsonCB: function(data)
                {
                    expect(data[0].param).to.be('1003 - url');
                    done();
                },
                jsonpCB: function(data)
                {
                    expect().fail("jsonCB should not be called");
                    done();
                }
            });

            feed.loadRSS({params:{}}, res);    
        }); 

        it('loadRSS - no url', function(done) 
        {   
            var res = new mock(
            {
                jsonCB: function(data)
                {
                    expect(data[0].param).to.be('1003 - url');
                    done();
                },
                jsonpCB: function(data)
                {
                    expect().fail("jsonCB should not be called");
                    done();
                }
            });

            feed.loadRSS(null, res);    
        });       
        
        it('loadRSS - invalid url', function(done) 
        {   
            var res = new mock(
            {
                jsonCB: function(data)
                {
                    expect(data[0].param).to.be('1000 - loading feed');
                    done();
                },
                jsonpCB: function(data)
                {
                    expect().fail("jsonCB should not be called");
                    done();
                }
            });

            feed.loadRSS({params:{url: 'http:://s3.eu-central-1.amazonaws.com/leadteqtests/rss/feed.rss'}}, res);    
        });     
        
        it('loadRSS - non existent url', function(done) 
        {   
            var res = new mock(
            {
                jsonCB: function(data)
                {
                    expect(data[0].param).to.be('1001 - parsing feed');
                    done();
                },
                jsonpCB: function(data)
                {
                    expect().fail("jsonCB should not be called");
                    done();
                }
            });

            feed.loadRSS({params:{url: 'http://s3.eu-central-1.amazonaws.com/leadteqtests/rss/feed_DOENST_EXIST.rss'}}, res);    
        });     

        it('loadRSS - http', function(done) 
        {	
        	var res = new mock(
        	{
        		jsonCB: function(data)
        		{
        			expect().fail("jsonCB should not be called");
        			done();
        		},
        		jsonpCB: function(data)
        		{
        			// console.log('jsonpCB');
        			// console.log(data);
        			expect(data[0].feedUrl).to.be('http://www.leadteq.com/de/feed/');
        			expect(data[0].type).to.be('rss');
        			expect(data[0].entries.length).to.be(9);
        			done();
        		}
        	});

        	feed.loadRSS({params:{url: 'http://s3.eu-central-1.amazonaws.com/leadteqtests/rss/feed.rss'}}, res);	
      	});    

      	it('loadRSS - https', function(done) 
        {	
        	var res = new mock(
        	{
        		jsonCB: function(data)
        		{
        			expect().fail("jsonCB should not be called");
        			done();
        		},
        		jsonpCB: function(data)
        		{
        			// console.log('jsonpCB');
        			// console.log(data);
        			expect(data[0].feedUrl).to.be('http://www.leadteq.com/de/feed/');
        			expect(data[0].type).to.be('rss');
        			expect(data[0].entries.length).to.be(9);
        			done();
        		}
        	});

        	feed.loadRSS({params:{url: 'https://s3.eu-central-1.amazonaws.com/leadteqtests/rss/feed.rss'}}, res);	
        });
  	});

    describe('loadXML', function() 
    {

        it('loadXML - empty url', function(done) 
        {   
            var res = new mock(
            {
                jsonCB: function(data)
                {
                    expect(data[0].param).to.be('1003 - url');
                    done();
                },
                jsonpCB: function(data)
                {
                    // console.log('jsonpCB');
                    // console.log(data);
                    expect().fail("jsonCB should not be called");
                    
                    done();
                }
            });

            feed.loadXML({params:{url: ''}}, res);    
        });  

        it('loadXML - no url', function(done) 
        {   
            var res = new mock(
            {
                jsonCB: function(data)
                {
                    expect(data[0].param).to.be('1003 - url');
                    done();
                },
                jsonpCB: function(data)
                {
                    // console.log('jsonpCB');
                    // console.log(data);
                    expect().fail("jsonCB should not be called");
                    
                    done();
                }
            });

            feed.loadXML({params:{}}, res);    
        }); 

        it('loadXML - no url', function(done) 
        {   
            var res = new mock(
            {
                jsonCB: function(data)
                {
                    expect(data[0].param).to.be('1003 - url');
                    done();
                },
                jsonpCB: function(data)
                {
                    // console.log('jsonpCB');
                    // console.log(data);
                    expect().fail("jsonCB should not be called");
                    
                    done();
                }
            });

            feed.loadXML(null, res);    
        });  	

        it('loadXML - invalid url', function(done) 
        {   
            var res = new mock(
            {
                jsonCB: function(data)
                {
                    expect(data[0].param).to.be('1000 - loading feed');
                    done();
                },
                jsonpCB: function(data)
                {
                    // console.log('jsonpCB');
                    // console.log(data);
                    expect().fail("jsonCB should not be called");
                    
                    done();
                }
            });

            feed.loadXML({params:{url: 'http:://s3.eu-central-1.amazonaws.com/leadteqtests/xml/feed.xml'}}, res);    
        });  
        
        it('loadXML - non existent url', function(done) 
        {   
            var res = new mock(
            {
                jsonCB: function(data)
                {
                    expect(data[0].param).to.be('1000 - loading feed');
                    done();
                },
                jsonpCB: function(data)
                {
                    // console.log('jsonpCB');
                    // console.log(data);
                    expect().fail("jsonCB should not be called");
                    
                    done();
                }
            });

            feed.loadXML({params:{url: 'http://s3.eu-central-1.amazonaws.com/leadteqtests/xml/feedDOESNT_EXIST.xml'}}, res);    
        });  

        it('loadXML - http', function(done) 
        {	
        	var res = new mock(
        	{
        		jsonCB: function(data)
        		{
        			expect().fail("jsonCB should not be called");
        			done();
        		},
        		jsonpCB: function(data)
        		{
        			// console.log('jsonpCB');
        			// console.log(data);
        			
        			expect(data[0].Products.Product.length).to.be(8);
        			done();
        		}
        	});

        	feed.loadXML({params:{url: 'http://s3.eu-central-1.amazonaws.com/leadteqtests/xml/feed.xml'}}, res);	
      	});  	

      	it('loadXML - https', function(done) 
        {	
        	var res = new mock(
        	{
        		jsonCB: function(data)
        		{
        			console.log(data);
        			expect().fail("jsonCB should not be called");
        			done();
        		},
        		jsonpCB: function(data)
        		{
        			console.log('jsonpCB');
        			console.log(data);
        			
        			expect(data[0].Products.Product.length).to.be(8);
        			done();
        		}
        	});

        	feed.loadXML({params:{url: 'https://s3.eu-central-1.amazonaws.com/leadteqtests/xml/feed.xml'}}, res);	
        });
  	});
});