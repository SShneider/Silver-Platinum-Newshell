
const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const User = db.model('user')
const Trans = db.model('transaction')
const seed = require('../../script/seed')
seed()
describe('transactionTests - api', ()=>{
    
})