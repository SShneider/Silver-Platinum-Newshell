const router = require('express').Router()
const { User } = require('../db/models')

module.exports = router

const verifyLoggedIn = async (req, res, next) => {
  if(!req.user){
    res.status(401).send('Insufficient Rights')
  }
  else{
    next()
  }
}
router.use(verifyLoggedIn)
router.get('/', async (req, res, next) => {
	try {
    const user = await User.findAll({
      where: {
        id: req.user.id
      },
      attributes: [
        'id',
        'email',
        'address',
        'username',
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
						username: req.body.username,
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
				where: { id: req.user.id }
			})
			res.json(destroyed)
	} catch (error) {
		next(error)
	}
})
