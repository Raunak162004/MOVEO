const Captain = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlackList = require("../models/blacklistToken.model");

module.exports.registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {fullname, email, password, vehicle} = req.body;

    const existingCaptain = await Captain.findOne({email});

    if(existingCaptain) {
        return res.status(400).json({error: "Captain with this email already exists"});
    }

    const createdCaptain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    res.status(201).json(createdCaptain);
}

module.exports.loginCaptain = async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;

    const captain = await Captain.findOne({ email }).select("+password");

    if(!captain) {
        return res.status(401).json({error: "Invalid email or password"});
    }

    const isMatch = await bcrypt.compare(password, captain.password);

    if(!isMatch){
        return res.status(401).json({error: "Invalid email or password"});
    }

    const token = jwt.sign({captainId: captain._id}, process.env.JWT_SECRET, {expiresIn: "24h"});

    res.cookie("token", token)

    res.status(200).json({token, captain});
}

module.exports.getCaptainProfile = async (req,res) => {
    res.status(200).json(req.captain);
}

module.exports.logoutCaptain = async (req,res) => {
    
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    await BlackList.create({token});

    res.clearCookie("token");

    res.status(200).json({message: "Logged out successfully"});
}