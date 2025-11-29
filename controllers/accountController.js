const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// const accountController = {}

// Create Login View
// accController.buildLogin = async function (req, res) {
//     const nav = await utilities.getNav();
//     const login = await utilities.getLoginBox();
//     res.render("account/login", {
//         title: "Login",
//         nav,
//         login,
//         errors: null,
//     })
// }
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
    // errors: null,
  })
}

// Create Registration View
// accountController.buildRegistration = async function (req, res) {
//     const nav = await utilities.getNav();
//     // const register = await utilities.getRegistration();

//     res.render("account/register", {
//         errors: null,  
//         title: "Register",
//         nav,
        
//     })
// }

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
// accountController.registerAccount = async function(req, res) {
//   let nav = await utilities.getNav()
//   const { account_firstname, account_lastname, account_email, account_password } = req.body

//   // Hash the password before storing
//   let hashedPassword
//   try {
//     // regular password and cost (salt is generated automatically)
//     hashedPassword = await bcrypt.hashSync(account_password, 10)
//   } catch (error) {
//     req.flash("notice", 'Sorry, there was an error processing the registration.')
//     res.status(500).render("account/register", {
//       title: "Registration",
//       nav,
//       errors: null,
//     })
//   }

//   const regResult = await accountModel.registerAccount(
//     account_firstname,
//     account_lastname,
//     account_email,
//     hashedPassword
//   )

//   const login = await utilities.getLoginBox();
//   const register = await utilities.getRegistration();

//   if (regResult) {
//     req.flash(
//       "notice",
//       `Congratulations, you're registered ${account_firstname}. Please log in.`
//     )
//     res.status(201).render("account/login", {
//       title: "Login",
//       nav,
//       login,
//       errors: null,
//     })
//   } else {
//     req.flash("notice", "Sorry, the registration failed.")
//     res.status(501).render("account/register", {
//       title: "Registration",
//       nav,
//       register,
//       errors: null,
//     })
//   }
// }
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("./account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }
  
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered, ${account_firstname}. Please log in.`
        )
        res.status(201).render("./account/login", {
            title: "Login",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("./account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
//   console.log("1 is here")
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildLoggedInView(req, res) { 
    let nav = await utilities.getNav();
    console.log("2 is here")
    res.render("account/", {
        title: "Account Management",
        nav,
        errors: null,

    })
    console.log("3 is here")

}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildLoggedInView  }


