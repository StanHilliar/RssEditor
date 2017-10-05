/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */

var expect              = require('expect.js');
var mongoose            = require('mongoose');
var Email               = mongoose.model('Email');
var NewsletterEntity    = mongoose.model('NewsletterEntity');
var request             = require('supertest');
var sinon               = require('sinon');
var EmailCtrl           = require('../controllers/email')();
var CirclesCtrl         = require('../../../../../node_modules/meanio-circles/server/controllers/circles')();

/**
 * Globals
 */
var user1, user2;

var url = 'http://127.0.0.1:3001';

function setupRequest(opts)
{
  var req = {
    assert: function(a,b)
    {
      var assertThis = {};
      assertThis.notEmpty = function() 
      { 
        if(!req.body[a] || req.body[a] == '')
        {
            return b;
        }
      };

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
        console.log(' ------ response SEND ------- ');
        console.log(r);
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

/**
 * Test Suites
 */
describe('email.spec.js', function () 
{
    describe('REST API:', function () 
    {
        var emailStub;
        var newsletterEntityStub;
        var hasCircleStub;
        var hasOneOfTheseCirclestub;
        var hasCompanyStub;

        beforeEach(function () 
        {
            emailStub = sinon.stub(Email, 'findOne');
            newsletterEntityStub = sinon.stub(NewsletterEntity, 'findOne');
            hasCircleStub = sinon.stub(CirclesCtrl, 'hasCircle');
            hasOneOfTheseCirclestub = sinon.stub(CirclesCtrl, 'hasOneOfTheseCircles');
            hasCompanyStub = sinon.stub(CirclesCtrl, 'hasCompany');
        });

        afterEach(function () 
        {
            Email.findOne.restore();
            NewsletterEntity.findOne.restore();
        });

        function setupNewsletterEntityStub(error, entity)
        {
            var mockFindOne =
                {
                    lean: function()
                    {
                        return this;
                    },
                    exec: function (callback)
                    {
                        callback(null, entity);
                    }
                };

            newsletterEntityStub.returns(mockFindOne);
            // newsletterEntityStub.withArgs({ _id: entityId}).returns(mockFindOne);
        }

        it('email api - create - without required params - should fail', function (done) 
        {
            var company = 'fake_company';
            var newEmail = 
            {
                user: 
                {
                    _id: '1234',
                    email: 'fake@leadteq.com',
                    companie:{
                        fake_company: 
                        {
                            name: 'fake_company'
                        }
                    }
                }
            };

            var mockFindOne =
            {
                exec: function (callback) 
                {
                    callback(null, null);
                }
            };

            // var req = setupRequest(
            // {
            //     body: {},
            //     user: {username: 'tester'}
            // });

            // var res = setupResponse({statusCode: 400}, function(data)
            // {
            //     console.log('--------------');
            //     console.log(data);
            //     expect(data).to.be.an('array');
            //     expect(data).to.contain('You must enter a type');
            //     done();
            // });
            
            // EmailCtrl.create(req, res, next);
            //   Email.withArgs({ _id: entityId}).returns(mockFindOne);
            
            console.log('-------------------------------------------------------');
                request(url)
                    .post('/api/emaileditor/email?company='+company)
                    .send(newEmail)
                    //.expect(200)
                    .end(function (err, res) 
                    {
                        // console.log(err);
                        // console.log(res);
                        expect(err).to.eql(null);
                        expect(res.error.status).to.eql(400);
                        expect(res.body).to.be.an('array');

                        sinon.assert.calledOnce(hasCompanyStub);

                        // expect(res.body).to.contain('You must enter a type');
                        if (err)
                        {
                            console.error(err);
                        }
                        if (res.error) 
                        {
                            console.error(res.error);
                        }
                        done();
                    });
        });

        it.skip('email api - create - with required params - should not fail', function (done) 
        {
            var company = 'fake_company';
            var newEmail = 
            {
                name: 'test',
                type: 'testtype',
                segment: 'test',
                subject: 'test',
                eloquaFolder: 'test',
                eloquaCampaignFolder: 'test',
                eloquaFooter: 'test',
                eloquaHeader: 'test',
                eloquaEmailGroup: 'test',
                bounceBackAddress: 'test',
                replyToName: 'test',
                replyToEmail: 'test', 
                user: 
                {
                    acl:
                    {
                        company:
                        {
                            allowed:
                            [
                                company
                            ]                           
                        }
                    }
                }
            };

            var mockFindOne =
                {
                    exec: function (callback) 
                    {
                        callback(null, null);
                    }
                };

            setupNewsletterEntityStub(null,  {circles:[company]});
        
            //   Email.withArgs({ _id: entityId}).returns(mockFindOne);

            request(url)
                .post('/api/' + company + '/emaileditor/email')
                .send(newEmail)
                //.expect(200)
                .end(function (err, res) 
                {
                    
                    console.error(err);
                    console.log(res.body);
                    expect(err).to.eql(null);
                    expect(res.error).to.eql(null);
                    // expect(res.status).to.eql(200);
                    expect(res.body).to.eql({});
                    // expect(res.body).to.contain('You must enter a type');
                    if (err)
                    {
                        console.error(err);
                    }
                    if (res.error) 
                    {
                        console.error(res.error);
                    }
                    done();
                });
        });


    });
});