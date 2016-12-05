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

var expect = require('expect.js'),
    mongoose = require('mongoose'),
  User = mongoose.model('User');
var request = require('supertest'); 

/**
 * Globals
 */
var user1, user2;

var url = 'http://127.0.0.1:3001';

/**
 * Test Suites
 */
describe.skip('<Unit Test>', function() 
{
  before(function(done) 
  {
    user1 = 
    {
        firstname: 'Tom',
        lastname: 'Tester',
        email: 'test' + getRandomString() + '@test.com',
        company: 'testCompany'+getRandomString(),
        username: getRandomString(),
        password: 'password11',
        confirmPassword: 'password11',
        provider: 'local'
    };

    user2 = 
    {
        firstname: 'Tim',
        lastname: 'Tester',
        email: 'test' + getRandomString() + '@test.com',
        company: 'testCompany'+getRandomString(),
        username: getRandomString(),
        password: 'password22',
        confirmPassword: 'password22',
        provider: 'local'
      };

      done();
  });

  describe('REST API:', function()
  {

    it('newsletterentity api - get', function(done) 
    {

      request(url)
      .get('/api/emaileditor/newsletterentity/get')
      .send(user1)
      //.expect(200)
      .end(function(err, res)
      {
        if(err)
        {
          throw  err;
        }
        if(res.error)
        {
          throw res.error;
        }
        //console.log("RES::::::::");
        //console.log(res);
        expect(res.body.token).to.be.an('string');
        expect(res.body.redirect).to.be.an('string');
        expect(res.status).to.eql(200);
        Company.find(
        {
          name: user1.company
        }, function(errCompany, companies)
        {
          if(errCompany)
          {
            throw  errCompany;
          }

          //console.log('companies');
          //console.log(companies);
          expect(companies.length).to.eql(1);
          var _company = companies[0];
          expect(_company.name).to.eql(user1.company);
          _company.remove();

          User.find(
          {
            email: user1.email
          }, function(errUser, users) 
          {
            if(errUser)
            {
              throw  errUser;
            }
            //console.log(users);
            //console.log("length "+users.length);
            expect(users.length).to.eql(1);
            var _user = users[0];
            expect(_user.email).to.eql(user1.email);
            _user.remove();
      
            done();
          });
        });
      });
    });
   

    after(function(done) {

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

      done();
    });
  });

 
});
