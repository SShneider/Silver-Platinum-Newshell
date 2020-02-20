const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const seed = require('../../script/seed')
const session = require('supertest-session')
const createUserObj = {email:"cody@puppybook.com", password:"Abcdefg4*", firstName:"Joh-n",
lastName:"Joh-nny", userName:"Miracle", apt: "55B", city: "New Yok", houseNumber: "77C", street: "Ocean Ave.", zipcode: "11230", state: "NY", country: "St.Louis"}

let testSession = null;
let testSessionAdmin = null;
let adminSession = null;
let authorizedSession = null;

describe('User routes', () => {

  describe('Logged out users shouldnt be able to access', ()=>{
   
    beforeEach(() => {
      return db.sync({force: true})
    })

    it('user lookup', async()=>{
      await request(app).get('/api/users/').expect(401)
    })

    it('all users lookup', async()=>{
      await request(app).get('/api/users/all').expect(401)
    })

    it('update feature', async()=>{
      await request(app).put('/api/users/').send(createUserObj).expect(401)
    })

    it('update feature with query', async()=>{
      await request(app).put('/api/users/').query({id:1}).send(createUserObj).expect(401)
    })

    it('delete', async()=>{
      await request(app).delete('/api/users/').send(createUserObj).expect(401)
    })

    it('delete with query', async()=>{
      await request(app).delete('/api/users/').query({id:1}).send(createUserObj).expect(401)
    })
  }) // end logged out user tests

  describe("Non-admin users should", () =>{

    before(async () => {
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

    it('not able to grab all users', function(done){
      authorizedSession
        .get('/api/users/all')
        .expect(401)
        .end(function(err, res){
          if (err) return done(err);
          done()
       });
    })

    it('able to grab own profile', function(done){
      authorizedSession
        .get('/api/users/')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          expect(res.body[0].email).to.be.equal("cody@email.com")
          done()
       });
    })

    it('not be able to grab others profile', function(done){
      authorizedSession
        .get('/api/users/')
        .query({id:2})
        .expect(401)
        .end(function(err, res){
          if (err) return done(err);
          done()
       });
    })

    it('can update their own account', function(done){
      authorizedSession
        .put('/api/users/')
        .send({firstName:'Codion'})
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          expect(res.body[1][0].firstName).to.be.equal('Codion')
          done()
       });
    })

    it('can not update others accounts', function(done){
      authorizedSession
        .put('/api/users/')
        .query({id:2})
        .send({firstName:'Codion'})
        .expect(401)
        .end(function(err, res){
          if (err) return done(err);
          done()
       });
    })

    it('can not delete others accounts', function(done){
      authorizedSession
        .delete('/api/users/')
        .query({id:2})
        .expect(401)
        .end(function(err, res){
          if (err) return done(err);
          done()
       });
    })

    it('can delete own accounts', function(done){
      authorizedSession
        .delete('/api/users/')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          done()
       })
     })
  })//end non admin user tests

  describe('Checking account after deletion', ()=>{
    it('checking login after delete', async()=>{
      await request(app)
      .post('/auth/login')
      .send({email:'cody@email.com', password:'Ab123456*'})
      .expect(401)
    })
  })//checks that account is actually deleted(gets 401 in before hook otherwise)
  
  describe("Admin users should", () =>{

    before(async () => {
      await seed()
    })

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

      it('able to grab all users', function(done){
        adminSession
          .get('/api/users/all')
          .expect(200)
          .end(function(err, res){
            if (err) return done(err);
            expect(res.body).to.be.an('array')
            expect(res.body.length).to.be.equal(3)
            done()
         });
      })

      it('be able to grab others profile', function(done){
        adminSession
          .get('/api/users/')
          .query({id:2})
          .expect(200)
          .end(function(err, res){
            if (err) return done(err);
            expect(res.body[0].email).to.be.equal("cody@email.com")
            done()
         });
      })

      it('can update their own account', function(done){
        adminSession
          .put('/api/users/')
          .query({id:2})
          .send({firstName:'Codion'})
          .expect(200)
          .end(function(err, res){
            if (err) return done(err);
            expect(res.body[1][0].firstName).to.be.equal('Codion')
            done()
         });
      })

      it('can delete others accounts', function(done){
        adminSession
          .delete('/api/users/')
          .query({id:2})
          .expect(200)
          .end(function(err, res){
            if (err) return done(err);
            done()
         });
      })

      it('checking the acc is truly gone', function(done){
        adminSession
        .get('/api/users/')
        .query({id:2})
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          done()
         })
       })
    })
  })//end admin access tests
}) // end describe('User routes')
