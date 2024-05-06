const express = require("express");
const productController = require("../controller/productController")
const path = require("path")

const router = express.Router()

router.post("/add-product/:firmId", productController.addProduct)
router.get("/get-products/:firmId", productController.getProductbyfirm)
router.delete("/:productId", productController.productgetbyId)

router.get('/uploads/:imageName', (req, res)=>{
    const imageName = req.params.imageName;
    res.headersSent('Content-Type','image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName))
})

module.exports = router