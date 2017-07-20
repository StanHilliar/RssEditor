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

var expect    = require('expect.js')
var request   = require('supertest'); 
var async     = require('async'); 
var mongoose  = require('mongoose');
var sinon     = require('sinon');
require('../models/emailModule');
var EmailModule = mongoose.model('EmailModule');
var EmailModuleCtrl = require('../controllers/emailModule')();

/**
 * Globals
 */
var emailModule1;
var emailModule2;
var emailModule3;
var emailModule4;

var url = 'http://127.0.0.1:3001';

function setupRequest(opts)
{
  var req = {
    assert: function(a,b)
    {
      var assertThis = {};
      assertThis.notEmpty =  function() {};

      return assertThis;
    },
    validationErrors: function()
    {},
  };
  if(opts.body)
  {
    req.body = opts.body
  }
  if(opts.user)
  {
    req.user = opts.user
  }
  return req;
}

function setupResponse(opts, cb)
{
  return {
      send: function(r)
      {
        // console.log(r);
        cb(r);
      },
      end: function(){ cb();},
      json: function(err){
          console.log("\n : " + err);
          cb();
      },
      jsonp: function(r){
          console.log(r);
          cb(r);
      },
      status: function(responseStatus) 
      {
          expect(responseStatus).to.be(opts.statusCode);
          // This next line makes it chainable
          return this; 
      }
  };

}


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

var testEmailModules = [];

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
        type: '0',
        company: 'fake',
        user: 
        {
          username: 'simon'
        }
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

    testEmailModules.push(emailModule1);
    testEmailModules.push(emailModule2);
    testEmailModules.push(emailModule3);
    testEmailModules.push(emailModule4);

    done();
  });

  describe('Module:', function()
  {
    beforeEach(function()
    {
      sinon.stub(EmailModule.prototype, 'save');
    });

    afterEach(function() 
    { 
      EmailModule.prototype.save.restore();
    });

    it.skip('create - req body is undefined', function(done)
    {
      var req = setupRequest();
      var res = setupResponse({statusCode: 400}, done);

      EmailModule.prototype.save.yields(null, true);

      EmailModuleCtrl.create(req, res, next);
    });

    it('create - missing name/type', function(done)
    {
      var req = setupRequest(
      {
        body: {},
        user: {username: 'tester'}
      });

      var res = setupResponse({statusCode: 400}, function(data)
      {
        done();
      });

      EmailModule.prototype.save.yields(null, true);

      EmailModuleCtrl.create(req, res, next);
    });

    it('create - simple', function(done) 
    {
      var req = setupRequest(
      {
        body: emailModule1,
        user: {username: 'tester'}
      });

      var res = setupResponse({statusCode: 200}, function(data)
      {       
        expect(data).to.be(true);
        done();
      });
      
      EmailModule.prototype.save.yields(null, true);

      EmailModuleCtrl.create(req, res, next);
      /*
      (function(err, res)
      {
        // console.log(err);
        // console.log(res);

        expect(err).to.be(null);
        expect(res.error).to.eql(false); 

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
      });  */
    });  

    it('__parseAndUpdateModule - pre/postbody', function(done) 
    {
      var parsedModule = EmailModuleCtrl.__parseAndUpdateModule(emailModule2);
     
      expect(parsedModule.preBody).to.be.an('string');
      expect(parsedModule.preBody).to.be.eql(emailModule2.preBody);       

      expect(parsedModule.preBody).to.be.an('string');
      expect(parsedModule.postBody).to.be.eql(emailModule2.postBody);     

      expect(parsedModule.childTagName).to.be.an('string');
      expect(parsedModule.childTagName).to.be.eql('table');

      done();
    });

    it('__parseAndUpdateModule - childTagName', function(done) 
    {
      var parsedModule = EmailModuleCtrl.__parseAndUpdateModule(emailModule3);

      expect(parsedModule.preBody).to.be.an('string');
      expect(parsedModule.preBody).to.be.eql(emailModule3.preBody);       

      expect(parsedModule.preBody).to.be.an('string');
      expect(parsedModule.postBody).to.be.eql(emailModule3.postBody);     

      expect(parsedModule.childTagName).to.be.an('string');
      expect(parsedModule.childTagName).to.be.eql('tr');

      done();
    });

    it.skip('__parseAndUpdateModule - childTagName 2', function(done) 
    {
      var parsedModule = EmailModuleCtrl.__parseAndUpdateModule(emailModule4);
      
      expect(parsedModule.childTagName).to.be.an('string');
      expect(parsedModule.childTagName).to.be.eql('');

      done();
    });

    it.skip('__parseAndUpdateModule - view - childTagName is div', function(done) 
    {
      var  myEmailModule = 
      {
        name: 'MyTestEmailModuleX',
        type: '0',
        preBody: '',
        postBody: '',
        views: 
        [
          {
            source: '<div> test </div>'
          }
        ]
      };
      
      testEmailModules.push(myEmailModule);

      var parsedModule = EmailModuleCtrl.__parseAndUpdateModule(myEmailModule);

      console.log(parsedModule);

      expect(parsedModule.childTagName).to.be.an('string');
      expect(parsedModule.childTagName).to.be.eql('');
      expect(parsedModule.views[0].childTagName).to.be.eql('div');
      expect(parsedModule.views[0].childTagName).to.be.eql('AD"§');

      done();
    });

  }); 
});