// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


// // Default Route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

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

router.get("/logout", utilities.handleErrors(accountController.logout))

// UPDATE ACCOUNT INFORMATION

router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdateAccountView))

router.post("/update", regValidate.updateRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))

router.post("/updatePassword/", regValidate.passwordRules(), regValidate.checkPasswordData , utilities.handleErrors(accountController.updatePassword))

// Error Event Handling
router.get("/broken", utilities.handleErrors(accountController.throwError))   


// Exports
module.exports = router;