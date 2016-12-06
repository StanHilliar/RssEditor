'use strict';

var expect = require('expect.js');
var request = require('supertest'); 
var helper = require('../controllers/helper.js')();

var url = 'http://127.0.0.1:3001';


var Mitm = require("mitm");
var mitm = Mitm();
mitm.disable();

function getData(req, cb)
{
  var bodyData = '';
  var bodyJson;
  req.on('data', function(chunk) 
  {
      bodyData += chunk.toString(); 
  });

    req.on('end', function() 
    {
      bodyJson = JSON.parse(bodyData)
      cb(null, bodyJson);
    });
}

describe('<Unit Test>', function() 
{
	beforeEach(function() 
	{ 
	    mitm = Mitm();
	    mitm.on("connect", function(socket, opts) 
	    {
	      //console.log('---->'+opts.host);
	      //console.log(opts.href);
	     if (opts.host == "127.0.0.1") socket.bypass();
	    });
	});
	  
	afterEach(function() { mitm.disable(); });

    it('isAdvertismentBooked - empty url should return 404', function(done) 
    {
    	mitm.disable();

    	request(url)
     	.get('/api/emaileditor/checkadvertisment/')
      	.end(function(err, res)
      	{
        	expect(res.error.status).to.eql(404);
        	//TODO more tests
        
        	done();
    	});
  	});

  	it('isAdvertismentBooked - invalid url should return 400', function(done) 
    {
    	mitm.disable();
    	
    	request(url)
     	.get('/api/emaileditor/checkadvertisment/invalid_url')
      	.end(function(err, res)
      	{
        	expect(res.error.status).to.eql(400);
        	console.log(res.status);
        	//TODO more tests
        
        	done();
    	});
  	});  	

  	it('isAdvertismentBooked - valid url should return 200', function(done) 
    {
    	mitm.disable();

    	request(url)
     	.get('/api/emaileditor/checkadvertisment/http:%2F%2Fleadteq.com%2Fwp-content%2Fuploads%2F2014%2F02%2Fleadteq_logo.png')
      	.expect(200, [{width: 180, height: 64, type: 'png'}], done);
   	
  	});

  	it('isAdvertismentBooked - first expand returns empty strings - should return 400', function(done) 
    {
      mitm.on("request", function(req, res) 
        {
            // console.log('mitm request');
            // console.log(req.headers.host + ' -> '+req.url);

            if(req.url ==  '/wp-content/uploads/2014/02/leadteq_logo.png')
            {
              res.end( JSON.stringify({uri:{href: ''}}));
            }
        });

      request(url)
      .get('/api/emaileditor/checkadvertisment/http:%2F%2Fleadteq.com%2Fwp-content%2Fuploads%2F2014%2F02%2Fleadteq_logo.png')
        .end(function(err, res)
        {
          expect(res.error.status).to.eql(400);
          // console.log(res.error);
          // console.log(res.status);
          // console.log(err);
          //TODO more tests
        
          done();
      });   
    });

    it('isAdvertismentBooked - issue', function(done) 
    {
      mitm.disable();

      request(url)
      .get('/api/emaileditor/checkadvertisment/http:%2F%2Fbn-01d.adtomafusion.com%2Fstatic%2Fview%2Fbbm.dagens_medicin.nyhetsbrev.dagliga_dm%2Fdm_mail_rekt21g')
        .expect(200, [{width: 180, height: 64, type: 'png'}], done);
  	});

});