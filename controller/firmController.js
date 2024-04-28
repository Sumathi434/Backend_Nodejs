const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
    const { firmName, area, category, region, offer } = req.body;
    try {
        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id,
        });

        
       const savedFirm = await firm.save();
       vendor.firm.push(savedFirm)

       await vendor.save()

        return res.status(200).json({ message: "Firm added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const firmgetbyId = async(req, res)=>{
    try {
        const firmId = req.params.firmId;
        const deleteFirm = await Firm.findByIdAndDelete(firmId)

        if(!deleteFirm){
            return res.status(404).json({error: "No firm found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
}

module.exports = { addFirm: [upload.single('image'), addFirm], firmgetbyId};
