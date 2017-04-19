/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */

var expect = require('expect.js');
var mongoose = require('mongoose');
var Email = mongoose.model('Email');
var NewsletterEntity      = mongoose.model('NewsletterEntity');
var request = require('supertest');
var sinon = require('sinon');

/**
 * Globals
 */
var user1, user2;

var url = 'http://127.0.0.1:3001';

/**
 * Test Suites
 */
describe('email.spec.js', function () 
{
    describe('REST API:', function () 
    {
        var emailStub;
        var newsletterEntityStub;
        beforeEach(function () 
        {
            emailStub = sinon.stub(Email, 'findOne');
            newsletterEntityStub = sinon.stub(NewsletterEntity, 'findOne');
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
            var newEmail = {};

            var mockFindOne =
                {
                    exec: function (callback) 
                    {
                        callback(null, null);
                    }
                };

            //   Email.withArgs({ _id: entityId}).returns(mockFindOne);

            request(url)
                .post('/api/' + company + '/emaileditor/email')
                .send(newEmail)
                //.expect(200)
                .end(function (err, res) 
                {
                    // console.log(err);
                    // console.log(res);
                    expect(err).to.eql(null);
                    expect(res.error.status).to.eql(400);
                    expect(res.body).to.be.an('array');
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