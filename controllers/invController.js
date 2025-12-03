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
  const classificationList = await utilities.buildClassificationList()
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationList,
    
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


invCont.editExistingInventory = async (req, res, next) => {
  const inventory_id = parseInt(req.params.inventory_id)
  let classificationList = await utilities.buildClassificationList();
  const itemData = await invModel.getProductByInventoryId(inventory_id)
  let nav = await utilities.getNav();
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/modify-inventory", {
    title: "Modify " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/modify-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

// Build the delete inventory confirmation page
invCont.buildDeleteInventoryView = async (req, res, next) => {
  const inventory_id = parseInt(req.params.inventory_id)
  const itemData = await invModel.getProductByInventoryId(inventory_id)
  let nav = await utilities.getNav();
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,

  })
}

// DELETE the inventory item
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id } = req.body
  const deleteResult = await invModel.deleteInventoryByProductId(inv_id)
  if (deleteResult) {
    req.flash("notice", `The deletion was completed.`)
    res.redirect("/inv/management")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).redirect(`inventory/delete-confirm/${inv_id}`)
  }
}


// Error Made on Purpose
invCont.throwError = async function (req, res) {
  throw new Error("I am an intentional error")
}


module.exports = invCont