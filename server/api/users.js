const router = require('express').Router()
const { User } = require('../db/models')

module.exports = router
let idValue
const verifyLoggedIn = async (req, res, next) => {
  if(!req.user || req.query && !req.user.admin){
    res.status(401).send('Insufficient Rights')
  }
  else {
    req.query.id ? idValue = req.query.id : idValue = req.user.id
    next()
  }
}
router.use(verifyLoggedIn)
router.get('/', async (req, res, next) => {
	try {
    //console.log(req.params)
    const user = await User.findAll({
      where: {
        id: idValue
      },
      attributes: [
        'id',
        'email',
        'address',
        'userName',
        'firstName',
        'lastName',
        'apt',
        'houseNumber',
        'street',
        'zipcode',
        'state',
        'country',
        'admin'
      ]
    })
    //console.log(user)
			res.json(user)
	} catch (error) {
		next(error)
	}
})

router.get('/all', async (req, res, next) => {
	try {
      const users = await User.findAll({
				attributes: [
					'id',
					'email',
					'address',
					'userName',
					'firstName',
					'lastName'
        ]
      })
			res.json(users)
		} catch (error) {
		next(error)
	}
})

router.put('/', async (req, res, next) => {
	try {
				await User.update(
					{
						email: req.body.email,
						password: req.body.password,
						userName: req.body.userName,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						apt: req.body.apt,
						street: req.body.street,
						houseNumber: req.body.houseNumber,
						zipcode: req.body.zipcode,
						state: req.body.state,
						country: req.body.country
					},
					{
						where: { id: req.params.id },
						individualHooks: true
					}
				)
		res.json(user)
	} catch (error) {
		res.status(401).send(error.message)
	}
})

router.delete('/', async (req, res, next) => {
	try {
			const destroyed = await User.destroy({
				where: { id: idValue }
			})
			res.json(destroyed)
	} catch (error) {
		next(error)
	}
})
