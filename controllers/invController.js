const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// Build single item view for inventory

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getProductByInventoryId(inventory_id);
  // console.log(`ATTENTION --------------${data}`)
  const display = await utilities.buildProductGrid(data);
  let nav = await utilities.getNav();
  res.render("./inventory/vehicle", {
    title: `${data.inv_make} ${data.inv_model} ${data.inv_year}`,
    nav,
    display,
  })

}

invCont.buildManagement = async function (req, res, next) {


  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Management",
    nav,
    
  })
}

invCont.buildAddClassification = async function (req, res, next) {

  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    
  })
}

invCont.buildAddInventory = async function (req, res, next) {
  let classificationList = await utilities.buildClassificationList();
  let nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

invCont.registerNewClassification = async function (req, res, next) {
      let nav = await utilities.getNav()
      const { classification_name } = req.body
  
    
      const regResult = await invModel.registerClassification(classification_name)
  
      if (regResult) {
          req.flash(
              "notice",
              `Congratulations, ${classification_name} has been added.`
          )
          res.status(201).render("./inventory/add-classification", {
              title: "Add Classification",
              nav,
              errors: null
          })
      } else {
          req.flash("notice", "Sorry, the classification was NOT added")
          res.status(501).render("./inventory/add-classification", {
              title: "Add Classification",
              nav,
              errors: null
          })
      
  }
}

invCont.registerNewInventory = async function (req, res, next) {
  let classificationList = await utilities.buildClassificationList();
  let nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    // inv_image,
    // inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id } = req.body
    
  const inv_image = "/images/vehicles/no-image.png";
  const inv_thumbnail = "/images/vehicles/no-image-tn.png";

  const regResult = await invModel.registerInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, ${inv_make} ${inv_model} ${inv_year} has been added.`
    )
    res.status(201).render("./inventory/management", {
      title: "Add Inventory",
      nav,
      // errors: null,
      // classificationList
    })
  } else {
    req.flash("notice", "Sorry, the classification was NOT added")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      classificationList
    })
  }
}

// Error Made on Purpose

invCont.throwError = async function (req, res) {
  throw new Error("I am an intentional error")
}


module.exports = invCont