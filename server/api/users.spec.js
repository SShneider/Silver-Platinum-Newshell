/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const User = db.model('user')

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
  }) // end logged out user tests
}) // end describe('User routes')
