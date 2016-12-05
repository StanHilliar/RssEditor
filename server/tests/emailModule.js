/* jshint -W079 */ 
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

var crypto = require('crypto');


/**
 * Create a random hex string of specific length and
 * @todo consider taking out to a common unit testing javascript helper
 * @return string
 */
function getRandomString(len) {
  if (!len)
    len = 16;

  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}

/**
 * Module dependencies.
 */

var expect = require('expect.js')
var request = require('supertest'); 
var mongoose = require('mongoose');
require('../models/emailModule');
var EmailModule = mongoose.model('EmailModule');
var emailModules = require('../controllers/emailModule')();

/**
 * Globals
 */
var emailModule1;
var emailModule2;
var emailModule3;
var emailModule4;

var url = 'http://127.0.0.1:3001';


var res = {
    send: function(){ },
    json: function(err){
        console.log("\n : " + err);
    },
    status: function(responseStatus) {
        assert.equal(responseStatus, 404);
        // This next line makes it chainable
        return this; 
    }
};

var next = function(){console.log('next');};


function deleteModule(module, cb)
{
  EmailModule.find(
  {
    name: module.name
  }, 
  function(findModuleError, modules)
  {
    if(findModuleError)
    {
      throw  findModuleError;
    }
    if(modules != null)
    {
      modules[0].remove();
    }

      return cb();
  });
}


/**
 * Test Suites
 */
describe('<Unit Test>', function() 
{
  before(function(done) 
  {
    emailModule1 = 
    {
        name: 'TestEmailModule',
        type: '0'
    }; 

    emailModule2 = 
    {
      name: 'TestEmailModule2',
      type: '0',
      preBody: '<table>',
      postBody: '</table>'
    };

    emailModule3 = 
    {
      name: 'TestEmailModule3',
      type: '0',
      preBody: '<tr>',
      postBody: '</tr>'
    };

    emailModule4 = 
      {
        name: 'MyTestEmailModule',
        type: '0',
        preBody: '<table><tr><td></td></tr></table><table>',
        postBody: '</table>'
      };

    done();
  });

  describe('REST API:', function()
  {

    it('emailModules api - create - missing name/type', function(done) 
    {
      var emptyModule = 
      {
        
      };

      request(url)
      .post('/api/emaileditor/emailmodule')
      .send(emptyModule)
      //.expect(200)
      .end(function(err, res)
      {
        console.log("create cb");

        expect(res.error.status).to.eql(400);
        //TODO more tests
        
        done();
      });
    });  

    it('emailModules api - create - simple', function(done) 
    {
      request(url)
      .post('/api/emaileditor/emailmodule')
      .send(emailModule1)
      //.expect(200)
      .end(function(err, res)
      {
        expect(res.body.createdAt).to.be.an('string');
        expect(res.body.updatedAt).to.be.an('string');
        expect(res.body.name).to.be.eql(emailModule1.name);
        expect(res.body.type).to.be.eql(emailModule1.type);
        expect(res.body.views).to.be.an('array');
        expect(res.body.views.length).to.be.eql(0); 

        expect(res.body.variables).to.be.an('array');
        expect(res.body.variables.length).to.be.eql(0);

        expect(res.body.adViews).to.be.an('array');
        expect(res.body.adViews.length).to.be.eql(0);
        
        expect(res.body.ads).to.be.an('array');
        expect(res.body.ads.length).to.be.eql(0);

        expect(res.status).to.eql(200);

        done();
      });  
    });  

    it('emailModules api - create - pre/postbody', function(done) 
    {
      request(url)
      .post('/api/emaileditor/emailmodule')
      .send(emailModule2)
      //.expect(200)
      .end(function(err, res)
      {
        expect(res.status).to.eql(200);

        expect(res.body.preBody).to.be.an('string');
        expect(res.body.preBody).to.be.eql(emailModule2.preBody);       

        expect(res.body.preBody).to.be.an('string');
        expect(res.body.postBody).to.be.eql(emailModule2.postBody);     

        expect(res.body.childTagName).to.be.an('string');
        expect(res.body.childTagName).to.be.eql('table');
        done();
      });
    });


    it('emailModules api - create - childTagName', function(done) 
    {

      request(url)
      .post('/api/emaileditor/emailmodule')
      .send(emailModule3)
      //.expect(200)
      .end(function(err, res)
      {
        expect(res.status).to.eql(200);

        expect(res.body.preBody).to.be.an('string');
        expect(res.body.preBody).to.be.eql(emailModule3.preBody);       

        expect(res.body.preBody).to.be.an('string');
        expect(res.body.postBody).to.be.eql(emailModule3.postBody);     

        expect(res.body.childTagName).to.be.an('string');
        expect(res.body.childTagName).to.be.eql('tr');
        done();
      });
    });

    it('emailModules api - create - childTagName 2', function(done) 
    {

      request(url)
      .post('/api/emaileditor/emailmodule')
      .send(emailModule4)
      //.expect(200)
      .end(function(err, res)
      {
        console.log("create cb");
        console.log("RES::::::::");
        console.log(res.body);

        expect(res.status).to.eql(200);   

        expect(res.body.childTagName).to.be.an('string');
        expect(res.body.childTagName).to.be.eql('');
        done();
      });
    });
   

    after(function(done) 
    {

      /** Clean up user objects
       * un-necessary as they are cleaned up in each test but kept here
       * for educational purposes
       *
       *  var _user1 = new User(user1);
       *  var _user2 = new User(user2);
       *
       *  _user1.remove();
       *  _user2.remove();
       */
      deleteModule(emailModule1, function()
      {
        deleteModule(emailModule2, function()
        {
          deleteModule(emailModule3, function()
          {
            deleteModule(emailModule4, function()
            {
              done();
            });
          });
        });
      });
    });
  });

 
});
