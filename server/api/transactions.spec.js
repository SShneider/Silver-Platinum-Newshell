
const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const User = db.model('user')
const Trans = db.model('transaction')
const seed = require('../../script/seed')
const session = require('supertest-session')

let testSession = null;
let testSessionAdmin = null;
let adminSession = null;
let authorizedSession = null;
describe('transactionTests - api', ()=>{
    before(async () => {
        await seed()
    })
    describe('transaction access - not logged in', ()=>{
        
        it('blocks transaction access if not logged in', async ()=>{
            await request(app).get('/api/transactions').expect(401)
        })
        it('blocks all transactions access if not logged in', async ()=>{
            await request(app).get('/api/transactions/all').expect(401)
        })
        it('blocks portfolio access if not logged in', async ()=>{
            await request(app).get('/api/transactions/portfolio').expect(401)
        })
    })//end transaction access - not logged in
    describe('transaction access -logged in - user', ()=>{
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
            it('Cant grab the transactions at /api/transactions/all',  function(done){
                authorizedSession//this should only have admin access
                    .get('/api/transactions/all')
                    .expect(401)
                    .end(function(err, res){
                        if (err) return done(err);
                        done()
                    });
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
        it('Logs out', function (done){
            authorizedSession
                .post('/auth/logout')
                .expect(302)
                .end(function(err, res){
                    if (err) return done(err);
                    done()
                });
          })
    })//end transaction access - logged in - User
    
    describe('transaction access -logged in - admin', ()=>{
        beforeEach( (done)=>{ //creates a session with an admin account
        testSessionAdmin = session(app)
        testSessionAdmin.post('/auth/login')
        .send({email: 'tom@email.com', password: 'Cd123456*'})
        .expect(200)
        .end(function (err) {
            if (err) return done(err);
            adminSession = testSessionAdmin;
            return done();
        });
        })
        describe('transaction GETs', ()=>{
            it('Grabs admin transactions at /api/transactions',  function(done){
                adminSession
                    .get('/api/transactions')
                    .expect(200)
                    .end((function (err, res) {
                        if (err) return done(err);
                        expect(res.body).to.be.an('array')
                        expect(res.body.length).to.be.equal(1)
                        expect(res.body[0].userId).to.be.equal(3)
                        done();//these tests only trigger when there is an error
                    }));
            })
            it('Grabs all the transactions at /api/transactions/all',  function(done){
                adminSession//this should only have admin access
                    .get('/api/transactions/all')
                    .expect(200)
                    .end((function (err, res) {
                        if (err) return done(err);
                        expect(res.body).to.be.an('array')
                        expect(res.body.length).to.be.equal(4)
                        done();//these tests only trigger when there is an error
                    }));
            })
            it('Grabs only stocks that the user currently owns',  function(done){
                adminSession 
                    .get('/api/transactions/portfolio')
                    .expect(200)
                    .end((function (err, res) {
                        if (err) return done(err);
                        expect(res.body).to.be.an('array')
                        expect(res.body.length).to.be.equal(1)
                        expect(res.body[0].userId).to.be.equal(3)
                        done();//these tests only trigger when there is an error
                    }));
            })
        })//end transaction get tests
    })//end transaction access - logged in Admin
})
