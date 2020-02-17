const router = require('express').Router()
const {User, Transaction} = require('../db/models')
module.exports = router
const verifyLoggedIn = async (req, res, next) => {
  if(!req.user){
    res.sendStatus(401)
  }
  else{
    next()
  }
}
router.use(verifyLoggedIn)
router.get('/', async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
        where:{
            userId: req.user.id
        }
    })
    res.json(transactions)
  } catch (err) {
    next(err)
  }
})
router.get('/portfolio', async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
        where:{
            userId: req.user.id,
            sold: false
        }
    })
    res.json(transactions)
  } catch (err) {
    next(err)
  }
})
router.get('/all', async (req, res, next) => {
    if(!req.user.admin) res.status(401).end()
    try {
      const transactions = await Transaction.findAll()
      res.json(transactions)
    } catch (err) {
      next(err)
    }
  })