/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const User = db.model('user')
const codyObject = {firstName: "cody", lastName: "pumpkin", email: "cody@codygoogle.com", password: "Abcdefgh4*"}
const codysEmail = 'cody@puppybook.com'
const codyPW = "Abcdefgh4*"
xdescribe('Authorization page', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })
  describe('Singup', ()=>{
    it('Works', async () => {
        const res = await request(app)
        .post('/auth/signup')
        .send(codyObject)
        .expect(200)
      })
    it('Email must be unique', async () => {
      const newUser = await User.create(codyObject)
      const res = await request(app)
      .post('/auth/signup')
      .send(codyObject)
      .expect(401)
    })
    it('Responds with an error when incomplete', async () => {
        const res = await request(app)
          .post('/auth/signup')
          .type("form")
          .send({email: "12345@gmail.com"})
          .expect(500)
    })
    it('Doesnt accept any private fields', async()=>{
        const res = await request(app)
          .post('/auth/signup')
          .type("form")
          .send({...codyObject, admin: true, bankroll: 10000})
          .expect(200)
        expect(res.body.admin).to.be.equal(false)
        expect(res.body.bankroll).to.be.equal(5000)
    })
    it('Does not expose user password', async() =>{
        const res = await request(app)
          .post('/auth/signup')
          .type("form")
          .send(codyObject)
          .expect(200)
        expect(res.body.password).to.be.equal(undefined)
    })
    })
    describe('Login', ()=>{
        beforeEach(() => {
            return User.create({
                email: codysEmail,
                password: codyPW,
                firstName: "Cody",
                lastName: "Pickles"
            })
          })
        let res;
        it('Works', async () => {
            res = await request(app)
            .post('/auth/login')
            .send({email: codysEmail, password: codyPW})
            .expect(200)
          })
        it('Does not expose the password', ()=>{
            expect(res.body.password).to.be.equal(undefined)
        })
        })
    describe('Logout', ()=>{
        beforeEach(() => {
            return User.create({
                email: codysEmail,
                password: codyPW,
                firstName: "Cody",
                lastName: "Pickles"
            })
          })
          let res;
          it('Works', async () => {
              await request(app)
              .post('/auth/login')
              .send({email: codysEmail, password: codyPW})
              res = await request(app)
              .post('/auth/logout')
              .expect(302)
            })
          
    })
}) // end describe('User routes')