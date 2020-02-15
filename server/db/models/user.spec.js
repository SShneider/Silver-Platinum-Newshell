
const {expect} = require('chai')
const db = require('../index')
const User = db.model('user')
//arrays of variables to test start
const createUserObj = {email:"cody@puppybook.com", password:"Abcdefg4*", firstName:"Joh-n",
lastName:"Joh-nny", userName:"Miracle", apt: "55B", city: "New Yok", houseNumber: "77C", street: "Ocean Ave.", zipcode: "11230", state: "NY", country: "St.Louis"}
const illegalPws = ["Abcdefg*", "Abcdefg4", "abcdefg4*", "ABCDEFG4*", "ABCD<ef*4", "A4*a", "abcdefghijklmnopqrstu*1A"]
const illegalPwResponses = ["Password must include at least one number", "Password must include at least one special character", 
"Password must include at least one upper case character", 	"Password must include at least one lower case character",
"Password must not include illegal characters", "Password must be between 6 and 15 characters", 
"Password must be between 6 and 15 characters"]
const addressCheck = ["country", "apt", "houseNumber", "street", "zipcode", "city", "state"]
//arrays of variables to test end
describe('User model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })
//PW start test
  describe('passwordTesting', () => {
    describe('correctPassword', () => {
    let cody
    
    beforeEach(async () => {
        cody = await User.create({
          firstName: "Cody",
          lastName: "Pumpkin",
          email: 'cody@puppybook.com',
          password: 'Cd123456*'
        })})
      //testing valid password
      
      it('returns true if the password is correct', () => {
        expect(cody.correctPassword('Cd123456*')).to.be.equal(true)
      })
      it('returns false if the password is incorrect', () => {
        expect(cody.correctPassword('bonez')).to.be.equal(false)
      })//end testing valid password
      it('the password is hidden', async () => {
        let foundUser = await User.findByPk(1)
        expect(typeof foundUser.password).to.be.equal('function')
      })
     //end password manipulation tests
    })
    
    //testing invalid passwords
    for(let i = 0; i<illegalPws.length; i++){
      it(`rejects pw - ${illegalPwResponses[i]}`, async () =>{
        let createdUser = await createUser({...createUserObj, email:'cody@puppybook.com', password:illegalPws[i]})
        expect(createdUser).to.be.equal(illegalPwResponses[i])
      })
    }
    //end testing invalid passwords
  }) //PW end test
  describe('nameTesting', ()=>{
    it('rejects firstname with illegal char', async()=>{
      let createdUser = await createUser({...createUserObj, firstName: 'Jear%'})
          expect(createdUser).to.be.equal('Must be a legal name')
    })
    it('rejects lastname with illegal char', async()=>{
      let createdUser = await createUser({...createUserObj, lastName: "Cuddles_"})
          expect(createdUser).to.be.equal('Must be a legal name')
    })
  })//Name end test
  describe('emailTesting', ()=>{
    it('rejects invalid email', async()=>{
      let createdUser = await createUser({...createUserObj, email: "cuddles@google.4com"})
          expect(createdUser).to.be.equal('Must be a valid email')
    })
    it("rejects accounts with duplicate email", async()=>{
      await createUser(createUserObj)
      let createDuplicate = await createUser(createUserObj)
      expect(createDuplicate).to.be.equal("email must be unique")
    })
  })//email end test
  describe('userNameTesting', ()=>{
    it('rejects a username that is too short', async()=>{
      let createdUser = await createUser({ ...createUserObj, userName:"wow"})
          expect(createdUser).to.be.equal("Username must be between 5 and 15 characters long")
    })
    it('rejects a username that is too long', async()=>{
      let createdUser = await createUser({ ...createUserObj, userName:"abcdefghijklmnopqrstu"})
          expect(createdUser).to.be.equal("Username must be between 5 and 15 characters long")
    })
    it('rejects a username that is invalid', async()=>{
      let createdUser = await createUser({ ...createUserObj, userName:"abrecadebre>"})
          expect(createdUser).to.be.equal("Username can only contain valid letters and numbers")
    })
  })//username end test
  describe("Address tests", ()=>{
    addressCheck.forEach(entry => {
      it(`rejects incorrect ${entry}`, async()=>{
        let createdUser = await createUser({...createUserObj, [entry]: ">"})
        expect(typeof createdUser).to.be.equal('string')
      })
    })
    it("rejects country with invalid characters", async()=>{
      let createdUser = await createUser({...createUserObj, country: "Burkina&Faso"})
      expect(createdUser).to.be.equal("Must be a valid country")
    })
    it("assembles the address correctly", async() => {
      let createdUser = await createUser(createUserObj)
      expect(createdUser.address).to.be.equal('Apt 55B, 77C Ocean Ave., New Yok, 11230, NY, St.Louis')
    })
  })//Address test end
  describe("empty required input", ()=>{
    it("does not accept empty email", async()=>{
      let createdUser = await createUser({firstName: "Cody",lastName: "Garbrant", password: "Abcdefg5$"})
      expect(createdUser).to.be.equal("user.email cannot be null")
    }) 
    it("does not accept empty firstName", async()=>{
      let createdUser = await createUser({email: "cody@puppy.com", lastName: "Garbrant", password: "Abcdefg5$"})
      expect(createdUser).to.be.equal("user.firstName cannot be null")
    }) 
    it("does not accept empty lastName", async()=>{
      let createdUser = await createUser({email: "cody@puppy.com", firstName: "Garbrant", password: "Abcdefg5$"})
      expect(createdUser).to.be.equal("user.lastName cannot be null")
    }) 
    it("does not accept empty password", async()=>{
      let createdUser = await createUser({email: "cody@puppy.com", firstName: "Garbrant", lastName: "Abcdefg"})
      expect(createdUser).to.be.equal("user.password cannot be null")
    }) 
  })//Emtpy required input end
  describe("bankroll tests", () =>{
    let cody
    beforeEach(async () => {
      cody = await User.create({
        firstName: "Cody",
        lastName: "Pumpkin",
        email: 'cody@puppybook.com',
        password: 'Cd123456*'
      })})
    it("sets the bankroll on create", () =>{
      expect(cody.bankroll).to.be.equal(5000)
    })
   })
}) 

//helper function that creates the user
async function createUser(userIn){
  try{
    let userOut = await User.create({
    ...userIn
    })
    return userOut
  }catch(err){
    return err.errors[0].message.toString()
  }
}
//end helper functions
