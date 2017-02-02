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

var expect    = require('expect.js');
var mongoose  = require('mongoose');
var NewsletterEntity      = mongoose.model('NewsletterEntity');
var request   = require('supertest'); 
var sinon     = require('sinon'); 

/**
 * Globals
 */
var user1, user2;

var url = 'http://127.0.0.1:3001';

/**
 * Test Suites
 */
describe('<Unit Test>', function() 
{
   
  describe('REST API:', function()
  {
    var newsletterEntityStub;
    beforeEach(function() 
    { 
       newsletterEntityStub = sinon.stub(NewsletterEntity, 'findOne');
    });

    afterEach(function() 
    { 
      NewsletterEntity.findOne.restore();
    });

    function setupNewsletterEntityStub(error,entity)
    {
      var mockFindOne =
      {   
          exec :function (callback) 
          {
              callback(null, entity);
          }      
      };

      newsletterEntityStub.returns(mockFindOne);
      // newsletterEntityStub.withArgs({ _id: entityId}).returns(mockFindOne);
    }

    it('newsletterentity api - get - entity for entityId doesnt exisit', function(done)     
    {
      var entityId = 'fake_id';
      var company = 'fake_company'

      var mockFindOne =
      {   
          exec :function (callback) 
          {
              callback(null, null);
          }      
      };

      newsletterEntityStub.withArgs({ _id: entityId}).returns(mockFindOne);

      request(url)
      .get('/api/'+company+'/emaileditor/newsletterentity/'+entityId)
      //.expect(200)
      .end(function(err, res)
      {
        expect(res.error.status).to.eql(500);
        if(err)
        {
          console.error(err);
        }
        if(res.error)
        {
          console.error(res.error);
        }
        done();
      });
    });

    it('newsletterentity api - get - entity for entityId- error', function(done)     
    {
      var entityId = 'fake_id';
      var company = 'fake_company'
  
      var entity =
      {
          _id         : entityId,
          company     : company,
          replyToName : '123test'
      };

      setupNewsletterEntityStub('testError');

      request(url)
      .get('/api/'+company+'/emaileditor/newsletterentity/'+entityId)
      //.expect(200)
      .end(function(err, res)
      {
        expect(err).to.be(null);
        expect(res.error.status).to.eql(500); 

        done();
      });
    });

    it('newsletterentity api - get - entity for entityId exisits', function(done)     
    {
      var entityId = 'fake_id';
      var company = 'fake_company'
  
      var entity =
      {
          _id         : entityId,
          company     : company,
          replyToName : '123test'
      };

      setupNewsletterEntityStub(null, entity);

      request(url)
      .get('/api/'+company+'/emaileditor/newsletterentity/'+entityId)
      //.expect(200)
      .end(function(err, res)
      {
        expect(err).to.be(null);
        expect(res.error).to.eql(false); 
        expect(res.status).to.eql(200);

        expect(res.body).to.eql([entity]);
        done();
      });
    });
  });
});