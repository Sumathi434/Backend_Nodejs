const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const Firm = require("../models/Firm")
const path = require("path")

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
    const { productName, price, category, bestseller, description } = req.body;
    try {

        const image = req.file ? req.file.filename : undefined;

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "Firm not found" });
        }

        const product = new Product({
            productName,
            price,
            category,
            bestseller,
            description,
            image,
            firm: firm._id,
        });

        const savedProduct = await product.save();
        firm.products.push(savedProduct);

        await firm.save();
        return res.status(200).json({message: "Products added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
};

const getProductbyfirm = async(req, res)=>{
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
        return res.status(404).json({ error: "firm not found" });
    }
    const RestaurantName = firm.firmName
   const products = await Product.find({firm: firmId})
   res.status(200).json( {RestaurantName, products} )
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
}

const productgetbyId = async(req, res)=>{
    try {
        const productId = req.params.productId;
        const deleteProduct = await Product.findByIdAndDelete(productId)

        if(!deleteProduct){
            return res.status(404).json({error: "No product found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
}

module.exports = {addProduct: [upload.single('image'), addProduct], getProductbyfirm, productgetbyId }