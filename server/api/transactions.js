const router = require('express').Router()
const {User, Transaction} = require('../db/models')
module.exports = router

let idValue//either a query(if own profile) or the session user id(if checked by admin)

//logged out users have no access
//logged in users can only access their own information
//admins can access all the information
//to mask multiple user pages admin-accessed pages are specified with queries
//if query is sent by someone without admin rights it gets rejected

const verifyLoggedIn = async (req, res, next) => {
  if(!req.user || req.query.id && !req.user.admin){
    return res.status(401).send('Insufficient Rights')
  } else {
    req.query.id ? idValue = req.query.id : idValue = req.user.id
    next()
  }
}

router.use(verifyLoggedIn)

router.get('/', async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
        where:{
            userId: idValue
        }
    })
    res.json(transactions)
  } catch (err) {
    next(err)
  }
})

router.get('/all', async (req, res, next) => {
    if(!req.user.admin) return res.status(401).end() //not in middleware because no queries are sent
    try {
      const transactions = await Transaction.findAll()
      res.json(transactions)
    } catch (err) {
      next(err)
    }
  })

router.post('/', async (req, res, next) => {
    try {
      if(req.query.id && req.user.admin) return res.status(401).send('Admins cant add transactions to other users') //since this method does not use queryid at all we prevent admins from accidently deducting from their own accounts
      let transactionSum = 0;
      req.body.order.forEach(stock => transactionSum+=(stock.priceAtTransaction*Number(stock.quantity)))
      const user = await User.findByPk(req.user.id)
      if(user.bankroll<transactionSum)  return res.status(406).send('Insufficient Funds')
      req.body.order.forEach(async (stock) =>{
        await Transaction.create({
          ticker: stock.ticker,
          priceAtTransaction: stock.priceAtTransaction,
          quantity: stock.quantity,
          userId: req.user.id
        })
      })
      user.bankroll-=transactionSum
      user.save()
      
      const transactions = await Transaction.findAll({
        where:{
            userId: req.user.id
        }
    })
      res.status(201).send(transactions)
    } catch (err) {
      next(err)
    }
  })