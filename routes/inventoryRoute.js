// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build a single vehicle view page
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Management Main View
router.get("/management", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));

// Management Add NEW Classifcation View
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

router.post("/add-classification", utilities.checkAccountType, validate.classificationRules(), validate.checkClassificationData, utilities.handleErrors(invController.registerNewClassification))

// Management Add NEW Inventory View
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

router.post("/add-inventory", utilities.checkAccountType, validate.inventoryRules(), validate.checkInventoryData, utilities.handleErrors(invController.registerNewInventory))

// Management of Existing Inventory
router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON))

// Modify Existign Inventory
router.get("/edit/:inventory_id", utilities.checkAccountType, utilities.handleErrors(invController.editExistingInventory))

// Post the modified existing inventory
router.post("/update/", utilities.checkAccountType, validate.inventoryRules(), validate.checkUpdateData, utilities.handleErrors(invController.updateInventory))

// Delete Information from the database
router.get("/delete/:inventory_id", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteInventoryView))

router.post("/delete/", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory))

// Error Event Handling
router.get(
    "/broken", utilities.handleErrors(invController.throwError))   


module.exports = router;

