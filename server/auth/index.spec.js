/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const User = db.model('user')
const codyObject = {firstName: "cody", lastName: "pumpkin", email: "cody@codygoogle.com", password: "Abcdefgh4*"}
describe('Authorization page', () => {
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
          .send({...codyObject, admin: true})
          .expect(200)
        expect(res.body.admin).to.be.equal(false)
    })
    it('Does not expose user password', async() =>{
        const res = await request(app)
          .post('/auth/signup')
          .type("form")
          .send({email: "12345@gmail.com"})
          .expect(500)
        expect(res.body.password).to.be.equal(undefined)
    })
    })
}) // end describe('User routes')