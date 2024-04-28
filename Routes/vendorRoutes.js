const vendorController = require("../controller/VendorController")
const express = require("express")

const router = express.Router()

router.post("/register", vendorController.vendorRigester)
router.post("/login", vendorController.vendorLogin)
router.get("/all-vendors", vendorController.getAllvendors)
router.get("/single-record/:id", vendorController.getVendorById)
module.exports = router