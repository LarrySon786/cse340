// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


// Route to account login
// router.get("/login", utilities.handleErrors(accController.buildLogin))
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration to set-up account
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Post New Registration to Database
router.post("/register", regValidate.registationRules(),
  regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount)
)

// Temporary Login POST
router.post(
  "/login", regValidate.loginRules(), regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Error Event Handling
// router.get("/broken", utilities.handleErrors(accountController.throwError))   


// Exports
module.exports = router;