const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}


validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isString()
            .isLength({ min: 1 })
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Please provide a valid classification name")
            .custom(async (classification_name) => {
                const nameExists = await invModel.checkClassificationExists(classification_name)
                if (nameExists) {
                    throw new Error("This classification already exists. Please enter a different classification name.")
                }
            }),
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    console.log("4 is here")
    errors = validationResult(req)
    console.log("5 is here")
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return;
    }
    console.log("6 is here")
    next()
}

validate.inventoryRules =  () => {
    return [
        body("inv_make")
            .trim()
            .notEmpty()
            .isString()
            .isLength({ min: 1 })
            // .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Please provide a valid make name"),
        
        body("inv_model")
            .trim()
            .notEmpty()
            .isString()
            .isLength({ min: 1 })
            // .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Please provide a valid model name"),
        
        body("inv_year")
            .trim()
            .notEmpty()
            .isInt({ min: 4 })
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Please provide a valid year"),
        
        body("inv_description")
            .trim()
            .notEmpty()
            .isString()
            .isLength({ min: 1 })
            // .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Please provide a valid description name"),
        
        body("inv_price")
            .trim()
            .notEmpty()
            .isString()
            .isLength({ min: 1 })
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Please provide a valid price"),
        
        body("inv_miles")
            .trim()
            .notEmpty()
            .isString()
            .isLength({ min: 1 })
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Please provide the miles"),
        
        body("inv_color")
            .trim()
            .notEmpty()
            .isString()
            .isLength({ min: 1 })
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Please provide a valid color"),
        
        body("classification_id")
            .trim()
            .notEmpty()
            .isString()
            .isLength({ min: 1 })
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Please select the classification")
    ]
}

validate.checkInventoryData = async (req, res, next) => {
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color,
        classification_id} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = utilities.buildClassificationList();
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
            classificationList,
            // classification_id,
        })
        return;
    }
    next()
}


module.exports = validate;