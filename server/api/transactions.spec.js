
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

//The number expected in this test will cascade as they depend on the results of previously
//called methods, and will not always equal default numbers

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
        it('blocks add transaction if not logged in', async ()=>{
            await request(app).post('/api/transactions/')
                .send({order:[{ticker: 'AMZN', priceAtTransaction: 2000, quantity: 1}]})
                .expect(401)
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
        })//end transaction get tests
        describe('transaction post', ()=>{
            it('Posts user transactions and subtracts from bankroll',  function(done){
                authorizedSession
                    .post('/api/transactions')
                    .send({order:[{ticker: 'AMZN', priceAtTransaction: 2000, quantity: '1'}]})
                    .expect(201)
                    .end((function (err) {
                        if (err) return done(err);
                        authorizedSession
                        .get('/api/transactions')
                        .expect(200)
                        .end((function (err, res) {
                            if (err) return done(err);
                            expect(res.body).to.be.an('array')
                            expect(res.body.length).to.be.equal(4)
                            expect(res.body[0].userId).to.be.equal(1)
                            authorizedSession
                                .get('/api/users/')
                                .expect(200)
                                .end((function (err, res) {
                                    if (err) return done(err);
                                    expect(res.body[0].bankroll).to.be.equal(300000)
                                    done()
                            }));
                        }));
                    }));
            })
            it('Doesnt post transaction if sum>bankroll',  function(done){
                authorizedSession
                    .post('/api/transactions')
                    .send({order:[{ticker: 'AMZN', priceAtTransaction: 2000, quantity: 1}, {ticker: 'FAKE', priceAtTransaction: 10000, quantity: 1}]})
                    .expect(406)
                    .end((function (err) {
                        if (err) return done(err);
                        authorizedSession
                        .get('/api/transactions')
                        .expect(200)
                        .end((function (err, res) {
                            if (err) return done(err);
                            expect(res.body).to.be.an('array')
                            expect(res.body.length).to.be.equal(4)
                            expect(res.body[0].userId).to.be.equal(1)
                            done();//these tests only trigger when there is an error
                        }));
                    }));
            })
        })//end transaction post
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
                        expect(res.body.length).to.be.equal(5)
                        done();//these tests only trigger when there is an error
                    }));
            })
            it('Grabs user transactions at /api/transactions',  function(done){
                adminSession
                    .get('/api/transactions')
                    .query({id:1})
                    .expect(200)
                    .end((function (err, res) {
                        if (err) return done(err);
                        expect(res.body).to.be.an('array')
                        expect(res.body.length).to.be.equal(4)
                        expect(res.body[0].userId).to.be.equal(1)
                        done();//these tests only trigger when there is an error
                    }))
            })
        })//end admin get tests
        describe('Admin transaction posts', ()=>{
            it('Cant post transactions to other users',  function(done){
                adminSession
                    .post('/api/transactions')
                    .query({id:1})
                    .send({order:[{ticker: 'AMZN', priceAtTransaction: 2000, quantity: 1}]})
                    .expect(401)
                    .end((function (err) {
                        if (err) return done(err);
                        adminSession
                        .get('/api/transactions')
                        .query({id:1})
                        .expect(200)
                        .end((function (err, res) {
                            if (err) return done(err);
                            expect(res.body).to.be.an('array')
                            expect(res.body.length).to.be.equal(4)
                            expect(res.body[0].userId).to.be.equal(1)
                            adminSession
                                .get('/api/users/')
                                .query({id:1})
                                .expect(200)
                                .end((function (err, res) {
                                    if (err) return done(err);
                                    console.log(res.body[0])
                                    expect(res.body[0].bankroll).to.be.equal(300000)
                                    done()
                            }));
                        }));
                }))
             })
        })//end Admin post tests
        describe('Admin delete', ()=>{
            it('transactions shouldnt be deletable', function(done){
                adminSession
                    .delete('/api/transactions/')
                    .query({id:3})
                    .expect(404)
                    .end((function (err, res) {
                        if (err) return done(err);
                        adminSession
                            .get('/api/transactions')
                            .expect(200)
                            .end((function (err, res) {
                                if (err) return done(err);
                                console.log(res.body)
                                expect(res.body).to.be.an('array')
                                expect(res.body.length).to.be.equal(1)
                                expect(res.body[0].userId).to.be.equal(3)
                                done();//these tests only trigger when there is an error
                            }))
                }));
            })
        })//end transaction delete - admin(but also the only one)
    })//end transaction access - logged in Admin
})
