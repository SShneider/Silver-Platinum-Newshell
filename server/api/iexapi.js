const router = require('express').Router()
module.exports = router
const axios = require('axios')
let idValue//either a query(if own profile) or the session user id(if checked by admin)

//logged out users have no access
//logged in users can only access their own information
//admins can access all the information
//to mask multiple user pages admin-accessed pages are specified with queries
//if query is sent by someone without admin rights it gets rejected

const verifyLoggedIn = async (req, res, next) => {
  if(!req.user){
    return res.status(401).send('Insufficient Rights')
  } else {
    next()
  }
}

router.use(verifyLoggedIn)

router.get('/', async (req, res, next) => {
    try {
        const stocks = await axios.get(`https://cloud.iexapis.com/stable/stock/market/batch?symbols=${req.query.tickers}&types=quote&token=${process.env.IEX_API_TOKEN}`)
        res.send(stocks.data)
    } catch (error) {
        next(error)
    }
})