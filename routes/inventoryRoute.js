// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build a single vehicle view page
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Error Event Handling
router.get(
    "/broken", utilities.handleErrors(invController.throwError))   


module.exports = router;

