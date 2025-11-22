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
  console.log(`ATTENTION --------------${data}`)
  const display = await utilities.buildProductGrid(data);
  let nav = await utilities.getNav();
  res.render("./inventory/vehicle", {
    title: `${data.inv_make} ${data.inv_model} ${data.inv_year}`,
    nav,
    display,
  })

}

// Error Made on Purpose

invCont.throwError = async function (req, res) {
  throw new Error("I am an intentional error")
}


module.exports = invCont;