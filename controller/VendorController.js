const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();
const secretKey = process.env.SecretKey;

const vendorRigester = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json({ error: "Email already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword,
        });
        await newVendor.save();
        console.log("Vendor Registered successfully");
        res.status(201).json({ message: "Vendor registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: "Invalid login details" });
        }

        const token = jwt.sign({ vendorId: vendor._id }, secretKey, {
            expiresIn: "1h",
        });

        console.log("Login Successfully");
        res.status(200).json({ message: "Login successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllvendors = async(req, res)=>{
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getVendorById = async(req, res)=>{
    const vendorId = req.params.id
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(404).json({error:"Vendor not found"})
        }
        res.status(200).json({vendor})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

}

module.exports = { vendorRigester, vendorLogin , getAllvendors, getVendorById};
