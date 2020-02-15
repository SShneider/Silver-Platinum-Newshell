
const {expect} = require('chai')
const db = require('../index')
const User = db.model('user')
//arrays of variables to test start

const illegalChars = ["[",";","<",">","]"]
const illegalPws = ["Abcdefg*", "Abcdefg4", "abcdefg4*", "ABCDEFG4*", "ABCD<ef*4", "A4*a", "abcdefghijklmnopqrstu*1A"]
const illegalPwResponses = ["Password must include at least one number", "Password must include at least one special character", 
"Password must include at least one upper case character", 	"Password must include at least one lower case character",
"Password must not include illegal characters", "Password must be between 6 and 15 characters", 
"Password must be between 6 and 15 characters"]

//arrays of variables to test end
describe('User model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })
//PW start test
  describe('passwordTesting', () => {
    describe('correctPassword', () => {
    let cody
    //testing valid password
    before(async () => {
        cody = await User.create({
          email: 'cody@puppybook.com',
          password: 'Cd123456*'
        })
      
      it('returns true if the password is correct', () => {
        expect(cody.correctPassword('Cd123456*')).to.be.equal(true)
      })

      it('returns false if the password is incorrect', () => {
        expect(cody.correctPassword('bonez')).to.be.equal(false)
      })
    })
    })
    // end testing valid password
    //testing invalid passwords
    for(let i = 0; i<illegalPws.length; i++){
      it(`rejects pw - ${illegalPwResponses[i]}`, async () =>{
        let createdUser = await createUser('cody@puppybook.com', illegalPws[i])
        expect(createdUser).to.be.equal(illegalPwResponses[i])
      })
    }
    //end testing invalid passwords
  }) //PW end test
  describe('nameTesting', ()=>{
    it('rejects firstname with illegal char', async()=>{
      let createdUser = await createUser('cody@puppybook.com', 'Abcdefg4*', 'Jear&')
          expect(createdUser).to.be.equal('Must be a legal name')
    })
    it('accepts legal firstname', async()=>{
      let createdUser = await createUser('cody@puppybook.com', 'Abcdefg4*', 'Jear-meow')
          expect(createdUser.firstName).to.be.equal('Jear-meow')
    })
    it('rejects lastname with illegal char', async()=>{
      let createdUser = await createUser('cody@puppybook.com', 'Abcdefg4*', 'Jear', 'Cuddles_')
          expect(createdUser).to.be.equal('Must be a legal name')
    })
    it('accepts legal lastname', async()=>{
      let createdUser = await createUser('cody@puppybook.com', 'Abcdefg4*', 'Jear-meow', 'Cuddles-pumpkernickel')
          expect(createdUser.lastName).to.be.equal('Cuddles-pumpkernickel')
    })
  })//Name end test
  describe('emailTesting', ()=>{
    it('rejects invalid email', async()=>{
      let createdUser = await createUser('cody@puppybook.4com', 'Abcdefg4*', 'Jear-meow', 'Cuddles-pumpkernickel')
          expect(createdUser).to.be.equal('Must be a valid email')
    })
  })//email end test
}) 
//helper functions
async function createUser(emailIn, passwordIn, firstName="John", lastName="John"){
  try{
    let userOut = await User.create({
    email: emailIn,
    password: passwordIn,
    firstName: firstName,
    lastName: lastName,
    })
    
    return userOut
  }catch(err){
    return err.errors[0].message.toString()
  }
}
//end helper functions
