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
router.get("/management", utilities.handleErrors(invController.buildManagement));

// Management Add NEW Classifcation View
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

router.post("/add-classification", validate.classificationRules(), validate.checkClassificationData, utilities.handleErrors(invController.registerNewClassification))

// Management Add NEW Inventory View
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

router.post("/add-inventory", validate.inventoryRules(), validate.checkInventoryData, utilities.handleErrors(invController.registerNewInventory))

// Error Event Handling
router.get(
    "/broken", utilities.handleErrors(invController.throwError))   


module.exports = router;

