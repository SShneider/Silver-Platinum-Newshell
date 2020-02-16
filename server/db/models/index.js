const User = require('./user')
const Transaction = require('./transactions')

Transaction.belongsTo(User)
User.hasMany(Transaction)

module.exports = {
  Transaction,
  User
}
