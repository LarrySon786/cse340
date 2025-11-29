const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  console.log(data)
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

// CONSTRUCT THE PRODUCT PAGE DISPLAY

Util.buildProductGrid = async function (data) {
  
    let display =
      `
      <div id="product-display-page">
        <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">
        <section>
          <div>
            <h1>${data.inv_year} ${data.inv_make} ${data.inv_model}</h1>
            <h2>$${Intl.NumberFormat("en-US").format(data.inv_price)}</h2>
          </div>
          <div id="product-description">
            <p><span>Mileage:</span> ${Intl.NumberFormat("en-US").format(data.inv_miles)}</p>
            <p><span>Color:</span> ${data.inv_color}</p>
            <p><span>Description:</span> ${data.inv_description}</p>
          </div>
        </section>
        </div>
      `
  return display
}

// Build the Login View
// Util.getLoginBox = async function() {
//   let login = `
//   <div class=login-box>
//     <form id="login-form" action="/account/login" method="post">
//       <label for="email">Email</label>
//       <input type="email" name="account_email" id="email" required>
//       <label for="password">Pasword</label>
//       <input type="password" name="account_password" id="password" placeholder="****" required>
//       <input type="submit" value="Login">
//     </form>
//     <p>No Account? <a href="/account/register">Sign-up</a></p>
//   </div>
//   `
//   return login;
// }

// Build Registration View
// Util.getRegistration = async function () {
//   let register = `
//     <div class=login-box>
//     <form id="login-form" action="/account/register" method="post">
//       <label for="fname">*First Name</label>
//       <input type="text" name="account_firstname" id="fname" required value="<%= locals.account_firstname %>">
//       <label for="lname">*Last Name</label>
//       <input type="text" name="account_lastname" id="lname" required>
//       <label for="email">*Email</label>
//       <input type="email" name="account_email" id="email" required>
//       <label for="accountPassword">Password:</label>
//       <span>Pass words must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character</span>
//       <input type="password" name="account_password" id="accountPassword" required pattern=".*[A-Z].*"  pattern=".*\d.*" pattern="^(?=.*[!@#$%^&*]).+$">
//       <input type="submit" value="Register Account">
//     </form>
//   </div>
//   `;
//   return register;
// }

// Build Classifications Options for Add Inventory Form
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required value="<%= locals.classification_id %>">'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
module.exports = Util

