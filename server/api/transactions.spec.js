
const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const User = db.model('user')
const Trans = db.model('transaction')
const seed = require('../../script/seed')
const session = require('supertest-session')

let testSession = null;
let authorizedSession = null;
describe('transactionTests - api', ()=>{
    beforeEach(async () => {
        await seed()
    })
    beforeEach( (done)=>{ //creates a session with a non-admin account
    testSession = session(app)
    testSession.post('/auth/login')
    .send({email: 'cody@email.com', password: 'Ab123456*'})
    .expect(200)
    .end(function (err) {
        if (err) return done(err);
        authorizedSession = testSession;
        return done();
      });
    })
    describe('transaction GETs', ()=>{
        it('Grabs user transactions at /api/transactions',  function(done){
            authorizedSession
                .get('/api/transactions')
                .expect(200)
                .end((function (err, res) {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array')
                    expect(res.body.length).to.be.equal(3)
                    expect(res.body[0].userId).to.be.equal(1)
                    done();//these tests only trigger when there is an error
                }));
        })
        it('Grabs all the user transactions at /api/transactions/all',  function(done){
            authorizedSession//this should only have admin access
                .get('/api/transactions/all')
                .expect(200)
                .end((function (err, res) {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array')
                    expect(res.body.length).to.be.equal(4)
                    expect(res.body[3].userId).to.be.equal(2)
                    done();//these tests only trigger when there is an error
                }));
        })
        it('Grabs only stocks that the user currently owns',  function(done){
            authorizedSession 
                .get('/api/transactions/portfolio')
                .expect(200)
                .end((function (err, res) {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array')
                    expect(res.body.length).to.be.equal(2)
                    expect(res.body[0].userId).to.be.equal(1)
                    done();//these tests only trigger when there is an error
                }));
        })
    })//end transaction get tests
})
